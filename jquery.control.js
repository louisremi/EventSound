(function($) {

$.fn.control = function( $scene ) {
	var $this = $(this).tabs({
			cookie: {},
			show: function() {
				// Disable clone mode when switching tab
				if($scene.is(".clone")) $("#instructions div.comment:eq(1)").trigger("click");
			}
		}).children("div").cloneSnippet( true ).end(),
		keypressTimeout,
		$beatDisplay = $("#beatDisplay span"),
		$bubblebeat = $("#bubblebeat").slider({
			min: 1.2,
			max: 4.8,
			step: 1.2,
			value: 3.6,
			change: function( event ) {
				var beatValue = $bubblebeat.slider("value")
				$beatDisplay.text(beatValue);
				$.scene.setIntervals(beatValue);
			}
		}),
		$nextTrigger,
		$body = $(document.body).bind("feedMe", function() {
			if($nextTrigger) {
				var $target = $nextTrigger.data("previousTarget"),
					name = $nextTrigger.data("name");
				$target.trigger(name);
				$nextTrigger = $nextTrigger.next('.snippet');
				if($nextTrigger.length < 1) $nextTrigger = 0;
			}			
		});
	
	$(".comment", $this).live("click", function( event ) {
		$(event.currentTarget).toggleClass("un")
		.children(".slash").toggle().end()
		.closest(".snippet").trigger("update");
	
	// Set the scene to query mode when an selector input is clicked	
	}).end().find("input").live("click", queryMode
	
	// Update the snippet when an input is modified
	).end().find("input").live("keypress", keypress
	
	).end().find("a.add").live("click", function( event ) {
		$(event.target).closest(".snippet").cloneSnippet();
	
	// Set the opacity of the snippet to 1 when it is hovered
	}).end().find(".snippet").live("mouseover", snippetHover
	
	).end().find(".snippet").live("mouseout", snippetHover
	
	// Destroy the snippet when the - is clicked
	).end().find("a.remove").live("click", function( event ) {
		var $snippet = $(event.target).closest(".snippet"),
			$tab = $snippet.parent(),
			isSingle = $tab.children(".snippet").length < 3;
		$snippet.trigger("update", [true]).trigger("mouseout").remove();
		if(isSingle) $tab.cloneSnippet( true );
	
	// Update the clone snippet
	}).end().find("div.clone").live("update", function( event ) {
		var $target = $(event.currentTarget);
		$scene[($target.find("div.comment").is(".un")? "add" : "remove") + "Class"]("clone")
		[($target.find("span.comment").is(".un")? "add" : "remove") + "Class"]("true");
	
	// Update a snippet of the bind tab
	}).end().find("div.bind").live("update", function( event, destroy ) {
		var $snippet = $(event.currentTarget),
			$target = $($snippet.find(".selectorId").attr("value")),
			$previousTarget = $snippet.data("previousTarget");
		if($previousTarget) $previousTarget.unbind("fakeClick end");
		if(!destroy && $target.length) {
			// Bind the new event
			$target.bind("fakeClick", function( event ) {
				if(event.target.parentNode == event.currentTarget) {
					$snippet.css("opacity", 1);
					$(event.currentTarget).play();
				}
				return false;
			}).bind("end", function( event ) {
				if(event.target.parentNode == event.currentTarget)
					$snippet.css("opacity", .6);
				return false;
			});
			// Set the "return false" option
			$target[($snippet.children(".comment").is(".un")? "add" : "remove") + "Class"]("false");
		}
		$snippet.data("previousTarget", $target);
		
	}).end().find("div.live").live("update", function( event, destroy ) {
		var $snippet = $(event.currentTarget),
			selectorIdValue =  $snippet.find(".selectorId").attr("value"),
			$context = $(selectorIdValue != "#"? selectorIdValue : ""),
			$target = $(
				$snippet.find(".selectorClass").attr("value"), 
				$context
			),
			$previousTarget = $snippet.data("previous_Target");
		if($previousTarget) $previousTarget.die("fakeClick").die("end");
		if(!destroy && $target.length) {
			// Bind the new event
			$target.live("fakeClick", function( event ) {
				if(event.target.parentNode == event.currentTarget) {
					$snippet.css("opacity", 1);
					$(event.currentTarget).play();
				}
					
			}).live("end", function( event ) {
				if(event.target.parentNode == event.currentTarget)
					$snippet.css("opacity", .7);
			});
		}
		$snippet.data("previousTarget", $context).data("previous_Target", $target);
		
	}).end().find("div.trigger").live("update", function( event, destroy ) {
		var $snippet = $(event.currentTarget);
		$snippet
			.data("previousTarget", $($snippet.find(".selectorId").attr("value")))
			.data("name", $snippet.find(".customEvent").attr("value"));
		
	}).end().find("div.custom").live("update", function( event, destroy ) {
		var $snippet = $(event.currentTarget),
			$uncomment = $snippet.find("div.un"),
			previousName = $snippet.data("previousName"),
			previousFunction = $snippet.data("previousFunction"),
			newFunction,
			name,
			targets = [];
		if($uncomment.length) {
			$uncomment.removeClass("comment").removeClass("un").after(
				$("#custom div.comment:first").clone()
			);
		} else {
			if(previousName) $scene.unbind(previousName, previousFunction);
			if(!destroy) {
				// Find the name of the custom event
				name = $snippet.find(".customEvent").attr("value");
				// Find all the selectors set
				$snippet.find(".selectorId").each(function() {
					if($(this).attr("value") != "") targets.push($(this).attr("value"));
				});
				if(name != "" && targets.length) {
					// Create a custom function
					newFunction = new Function("$('"+targets.join()+"').trigger('click');");
					// Bind it
					$scene.bind(name, newFunction);
					// Save it
					$snippet.data("previousName", name).data("previousFunction", newFunction);
				}
			}
		}
	});
	
	$scene.bind("query", function( event, selector ) {
		var isQueryId = $scene.is(".queryId");
		$scene.removeClass(isQueryId? "queryId" : "queryClass");
		$this.data("focus").attr("value", selector)
		.closest(".snippet").trigger("update");
	});
	
	$("#play").click(function() {
		$nextTrigger = $(this.parentNode.parentNode).children(".snippet:eq(1)");
	});
	
	return $this;
	
	// Set the scene to query mode: when an element is clicked, a corresponding selector is returned
	function queryMode( event ) {
		var $target = $(event.target);
		if(!$target.is(".customEvent")) {
			$this.data("focus", $target);
			$scene.addClass("query" + ($target.is(".selectorId")? "Id" : "Class"));
		}
	};
	
	// Debounce keypress event and update the associated snippet
	function keypress( event ) {
		if(keypressTimeout) clearTimeout(keypressTimeout);
		keypressTimeout = setTimeout(function() {
			$scene.removeClass("queryClass").removeClass("queryId");
			$(event.currentTarget).closest(".snippet").trigger("update");
		}, 800);
	};
	
	function snippetHover( event ) {
		var mouseover = event.type == "mouseover",
			$current = $(event.currentTarget),
			$related = $(event.relatedTarget).closest(".snippet", $this[0]);
		if(!$related.length || $current[0] != $related[0]) {
			var $previousTarget = $current.css("opacity", mouseover? 1 : .6).data("previousTarget");
			if($previousTarget) $previousTarget.children(".background").css("opacity", mouseover? .6 : .3);
		}
	}
};

$.fn.cloneSnippet = function( init ) {
	return this.each(function() {
		var $snippet = $(init? this : this.parentNode).children(".snippet:first");
		if(init) $snippet.css("opacity", .6).addClass("first");
		$snippet.clone().css("display", "block").insertAfter(init? $snippet : $(this));
	});
} 
	
})(jQuery);