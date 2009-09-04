(function($) {

$.fn.control = function( $scene ) {
	var $this = $(this),
		$cloneBtn = $("#cloneBtn").click(function() {
			$(this).toggleClass("ui-state-default").toggleClass("ui-state-active");
			$scene.toggleClass("clone");
		}).hover(function() {
			$(this).toggleClass("ui-state-hover");
		});
	
	$this/*.bind("select", function() { // Why this doesn't work?
		console.log('ul click')
		if($scene.is(".clone")) $cloneBtn.trigger("click");
		
	// Option to return false from an event
	})*/.find("span.return").live("click", function( event ) {
		var $event = $(event.target).closest(".snippet"),
			returm = $event.data("return") !== false;
		$event.data("return", returm? false : true).find(".false").animate({marginLeft: returm? 0 : -50});
	
	// Add the "true" option to clone
	}).end().find("span.clone, span.true").click(function() {
		$(this).parent().find(".true").animate({marginLeft: $scene.is(".true")? -35 : 0});
		$scene.toggleClass("true");
		return false;
	
	// When a selector input is selected, clicking the scene returns a query for the element
	}).end().find("input.selector").live("click", function( event ) {
		var $snippet = $(event.target).closest(".snippet")
		$this.data("focus", $snippet.find('.selector'));
		$scene.addClass($snippet.is(".bind")? "bind" : "live");
		
	}).live("keypress", function( event ) {
		$this.data("focus").trigger("update");
		
	// Clone the snippet when the + is clicked
	}).end().find("a.add").live("click", function( event ) {
		$(event.target).closest(".snippet").clone()
		// Make the - visible
		.find(".remove").css("visibility", "visible").end()
		// into the current tab
		.appendTo( $($this.find(".ui-tabs-selected a").attr("href")) );
	
	// Destroy the snippet when the - is clicked
	}).end().find("a.remove").live("click", function( event ) {
		$(event.target).closest(".snippet").trigger("update", [true]).remove();
		
	}).end().find("div.bind").live("update", function( event, destroy ) {
		
	}).end().find("div.live").live("update", function( event, destroy ) {
		
	}).end().find("div.trigger").live("update", function( event, destroy ) {
		
	}).end().find("div.custom").live("update", function( event, destroy ) {
		
	});
	
	$scene.bind("query", function( event, id ) {
		$scene.removeClass("query");
		$this.data("focus").attr("value", "#"+id).trigger("update");
	});
	
	return $this;
};
	
})(jQuery);