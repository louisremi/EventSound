(function($) {

$.fn.scene = function() {
	// The scene should be a square
	var $this = $(this),
		width = $(document.body).width() - $("#control").width(),
		height = $(document.body).height();
	width = width < height? width : height;
	height = height < width? height : width;
	
	$this.css({
		width: width,
		height: height
	})
	.bind("mousedown", function( event ) {
		$(event.target).backgroundOpacity(1);
	})
	.bind("mouseup", function( event ) {
		$(event.target).backgroundOpacity(.3);
	})
	.click(function( event ) {
		if(event.target != this) {
			var $container = $(event.target).getContainer();
			if($this.is(".clone")) $container.cloneKey($this.is(".true"));
			else if($this.is(".queryId")) $this.trigger("query", ["#"+$container.attr('id')]);
			else if($this.is(".queryClass")) $this.trigger("query", ["."+$container.attr('class').match(/(lvl\d)/)[0]]);
			else $container.addToWaitingBeat();
		}		
	})
	.children(".container").organize(width, [null]).end()
	.children(".background").css("opacity", .3).end()
	.data("position", [null]);
	
	$.scene.setIntervals(3.6);
	
	$(document).keydown(function( event ) {
		if(event.keyCode == 17)
			if(!$.scene.keyupTimer)
				$(".container", $this).live("mouseover", function( event ) {
					$(event.currentTarget).addClass("matrix");
				}).live("mouseout", function( event ) {
					var $current = $(event.currentTarget),
						$related = $(event.relatedTarget).closest(".container", $this);
					if(!$related.length || $current[0] != $related[0])
						$(event.currentTarget).removeClass("matrix");
				});
			else clearTimeout($.scene.keyupTimer);
	}).keyup(function( event ) {
		$.scene.keyupTimer = setTimeout(function() {
			if(event.keyCode == 17) $this.die("mouseover").die("mouseout").find(".matrix").removeClass("matrix");
			$.scene.keyupTimer = null;
		}, 150);
	});
	
	return $this;
}

$.fn.cloneKey = function( events ) {
	return this.each(function() {
		var $this = $(this),
			$parent = $this.parent();
		if($parent.children(".container").length < 4) {
			$parent.append($this.clone( events ));
			$parent.children(".container").organize($parent.width(), $parent.data("position"), true);
		}
	});
}

$.fn.getBackground = function() {
	var $this = $(this);
	if($this.is(".container")) $this = $this.children(".background");
	return $this.is(".background")? $this : $([]);
};

$.fn.getContainer = function() {
	var $this = $(this);
	if($this.is(".background")) $this = $this.parent();
	return $this.is(".container")? $this : $([]);
};

$.fn.addToWaitingBeat = function() {
	return this.each(function() {
		var $this = $(this),
			background = $this.children(".background")[0],
			level = $this.data("position").length -1,
			list;
		for(; level > -1; --level, $this = $this.parent(), background = $this.children(".background")[0]) {
			list = $.scene.waitingBeat[level]
			if($.inArray(background, list) == -1) list.push(background);
			if($this.is(".false")) break;
		}
	});
};

$.fn.organize = function(parentWidth, position, animate) {
	return this.each(function(i) {
		var step = parentWidth /21,
			width = 9 * step,
			// We need to clone the position array
			pos = position.slice(0);
		pos.push(i);
		$(this).children(".background").css({
			backgroundColor: $.scene.color[i],
			opacity: .3
		}).end()
		.css({
			width: width,
			height: width
		})[animate? "animate" : "css"]({
			left: ((i %2 * 10) + 1) * step,
			top: ((Math.floor(i /2 ) * 10) + 1) * step,			
		}, animate? 400 : undefined).queue(function() {
			$(this).children(".container").organize(width, pos, animate).end()
			.children(".otag").html('&lt;div&nbsp;id="el'+pos.join('_')+'"&nbsp;class="lvl'+pos.length+'"&gt;').end()
			.addClass("lvl"+pos.length).attr('id', "el"+pos.join('_')).data("position", pos)
			.dequeue();
		});
	});
};

$.fn.backgroundOpacity = function( opacity ) {
	return this.each(function() {
		$(this).getBackground().css("opacity", opacity);
	});
};

$.scene = {
	color: [
		'#ff3c00',
		'#002aff',
		'#90ff00',
		'#ff00f6'
	],
	beatInterval: null,
	instantInterval: null,
	keyupTimer: null,
	setIntervals: function( time ) {
		clearInterval($.scene.beatInterval);
		clearInterval($.scene.instantInterval);
		$.scene.beatInterval = setInterval(function() {
			$.scene.beat = $.scene.waitingBeat.slice(0);
			$.scene.waitingBeat = [[], [], [], []];
			$(document.body).triggerHandler("feedMe");
		}, time * 1000);
		$.scene.instantInterval = setInterval(function() {
			$($.scene.instant).css("opacity", .3).trigger("end");
			$($.scene.instant = $.scene.beat.pop()).css("opacity", .6).trigger("play");
		}, time * 250);
	},
	// One array by level, doesn't scale.
	waitingBeat: [[], [], [], []],
	beat: [],
	instant: []
};
	
})(jQuery);