function Zoom(zoomArea, transformArea, trans) {
	this.zoom = d3.zoom();
	this.available = false;
	this.svg = d3.select("#mainsvg");
	this.threshold = 2;

	this.zoomed = function () {
		transformArea.attr("transform", d3.event.transform);

		var k = d3.event.transform.k;
		var x = d3.event.transform.x;
		var y = d3.event.transform.y;

		trans.k = k;
	   	trans.x = x;
	   	trans.y = y;
	};

	this.zoom.scaleExtent([0.5, 3]).on("zoom", this.zoomed);

 
	this.svg.on(".zoom", null); 
	

	this.zoom(this.svg);


	// See if we cross the 'show' threshold in either direction
//    	if(k >= this.threshold)
		// this.svg.selectAll("text").classed('on',true);
//    	else if(k < this.threshold)
		// this.svg.selectAll("text").classed('on',false);


}

Zoom.prototype.bind = function () {
	this.svg.on(".zoom", this.zoomed); 
};

Zoom.prototype.unbind = function () {
	this.svg.on(".zoom", null); 
}