function Zoom(zoomArea, trans) {
	this.zoom = d3.zoom();
	this.available = false;
	this.svg = d3.select("#mainsvg");
	this.threshold = 2;

	this.zoom.scaleExtent([0.5, 3]).on("zoom", zoomed);

	function zoomed() {
		zoomArea.select('#matrix').attr("transform", d3.event.transform);
		zoomArea.select('#force').attr("transform", d3.event.transform);
		zoomArea.select('#path').attr("transform", d3.event.transform);

		var k = d3.event.transform.k;
		var x = d3.event.transform.x;
		var y = d3.event.transform.y;

		trans.k = k;
	   	trans.x = x;
	   	trans.y = y;
	};

	console.log(this.svg.on("mousedown.zoom"));

	this.mousedownZoom = this.svg.on("mousedown.zoom"); 
	this.mousemoveZoom = this.svg.on("mousemove.zoom"); 
	this.touchstartZoom = this.svg.on("touchstart.zoom");

	this.svg.on("mousedown.zoom", null); 
	this.svg.on("mousemove.zoom", null); 
	this.svg.on("touchstart.zoom", null); 

	this.zoom(this.svg);

	// See if we cross the 'show' threshold in either direction
//    	if(k >= this.threshold)
		// this.svg.selectAll("text").classed('on',true);
//    	else if(k < this.threshold)
		// this.svg.selectAll("text").classed('on',false);


}

Zoom.prototype.bind = function () {
	this.svg.on("mousedown.zoom", this.mousedownZoom);
	this.svg.on("mousemove.zoom", this.mousemoveZoom); 
	this.svg.on("touchstart.zoom", this.touchstartZoom);
};

Zoom.prototype.unbind = function () {
	this.svg.on("mousedown.zoom", null); 
	this.svg.on("mousemove.zoom", null); 
	this.svg.on("touchstart.zoom", null); 
}