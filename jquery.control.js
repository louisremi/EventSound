(function($) {

$.fn.control = function( $scene ) {
	var $this = $(this).tabs({
			cookie: {},
			show: function() {
				// Disable clone mode when switching tab
				if($scene.is(".clone")) $("div.clone .comment:first").trigger("click");
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
		});
	
	$this.find(".comment").live("click", function( event ) {
		$(event.currentTarget).toggleClass("un")
		.children(".slash").toggle().end()
		.closest(".snippet").trigger("update");
	
	// Set the scene to query mode when an selector input is clicked	
	}).end().find("input").live("click", queryMode
	
	// Update the snippet when an input is modified
	).end().find("input.selectorId").live("keypress", keypress
	
	).end().find("input.selectorClass").live("keypress", keypress
	
	).end().find("a.add").live("click", function( event ) {
		$(event.target).closest(".snippet").cloneSnippet();
	
	// Set the opacity of the snippet to 1 when it is hovered
	}).end().find(".snippet").live("mouseover", snippetHover
	
	).end().find(".snippet").live("mouseout", snippetHover
	
	// Destroy the snippet when the - is clicked
	).end().find("a.remove").live("click", function( event ) {
		$(event.target).closest(".snippet").trigger("update", [true]).remove();
	
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
		if($previousTarget) $previousTarget.unbind("play end");
		if(!destroy && $target.length) {
			// Bind the new event
			$target.bind("play", function( event ) {
				if(event.target.parentNode == event.currentTarget)
					$snippet.css("opacity", 1);
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
		
	}).end().find("div.trigger").live("update", function( event, destroy ) {
		
	}).end().find("div.custom").live("update", function( event, destroy ) {
		
	});
	
	$scene.bind("query", function( event, selector ) {
		console.info(selector)
		var isQueryId = $scene.is(".queryId");
		$scene.removeClass(isQueryId? "queryId" : "queryClass");
		$this.data("focus").find(isQueryId? '.selectorId' : ".selectorClass").attr("value", selector)
		.end().trigger("update");
	});
	
	return $this;
	
	// Set the scene to query mode: when an element is clicked, a corresponding selector is returned
	function queryMode( event ) {
		$this.data("focus", $(event.target).closest(".snippet"));
		$scene.addClass("query" + ($(event.target).is(".selectorId")? "Id" : "Class"));
	};
	
	// Debounce keypress event and update the associated snippet
	function keypress( event ) {
		if(keypressTimeout) clearTimeout(keypressTimeout);
		keypressTimeout = setTimeout(function() {
			$scene.removeClass("queryClass").removeClass("queryId");
			$(event.currentTarget).closest(".snippet").trigger("update");
		}, 700);
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
		var $snippet = $(init? this : this.parentNode).children(".snippet:first"),
			$clone;
		if(init) $snippet.css("opacity", .6);
		$clone = $snippet.clone().css("display", "block");
		if(init) $clone.find(".remove").css("visibility", "hidden");
		$clone.appendTo($snippet.parent());		
	});
} 
	
})(jQuery);