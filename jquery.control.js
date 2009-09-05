(function($) {

$.fn.control = function( $scene ) {
	var $this = $(this);
	
	$this.find(".comment").live("click", function( event ) {
		$(event.currentTarget).toggleClass("un")
		.children(".slash").toggle().end()
		.closest(".snippet").trigger("update");
		
	}).end().find("input.selectorId").live("click", function( event ) {
		$this.data("focus", $(event.target).closest(".snippet"));
		$scene.addClass("queryId");
		
	}).end().find("input.selectorClass").live("click", function( event ) {
		$this.data("focus", $(event.target).closest(".snippet"));
		$scene.addClass("queryClass");
		
	}).live("keypress", function( event ) {
		$(event.currentTarget).closest(".snippet").trigger("update");
		
	// Clone the snippet when the + is clicked
	}).end().find("a.add").live("click", function( event ) {
		$(event.target).closest(".snippet").clone()
		// Make the - visible
		.find(".remove").css("visibility", "visible").end()
		// append to the current tab
		.appendTo( $($this.find(".ui-tabs-selected a").attr("href")) );
	
	// Destroy the snippet when the - is clicked
	}).end().find("a.remove").live("click", function( event ) {
		$(event.target).closest(".snippet").trigger("update", [true]).remove();
		
	}).end().find("div.clone").live("update", function( event ) {
		var $target = $(event.currentTarget);
		$scene[($target.find("div.comment").is(".un")? "add" : "remove") + "Class"]("clone")
		[($target.find("span.comment").is(".un")? "add" : "remove") + "Class"]("true");
	
	}).end().find("div.bind").live("update", function( event, destroy ) {
		
	}).end().find("div.live").live("update", function( event, destroy ) {
		
	}).end().find("div.trigger").live("update", function( event, destroy ) {
		
	}).end().find("div.custom").live("update", function( event, destroy ) {
		
	});
	
	$scene.bind("query", function( event, selector ) {
		var isQueryId = $scene.is(".queryId");
		$scene.removeClass(isQueryId? "queryId" : "queryClass");
		$this.data("focus").find(isQueryId? '.selectorId' : ".selectorClass").attr("value", selector)
		.end().trigger("update");
	});
	
	return $this;
};
	
})(jQuery);