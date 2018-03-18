
// semantic zoom, not geometric zoom
function Zoom(zoomArea, link, node, label, trans, threshold, simulation) {
	// var links = d3.selectAll("line");
	// links.transition().duration(200).attr("transform", transform(d3.zoomIdentity));
	// var nodes = d3.selectAll("circle");
	// nodes.transition().duration(200).attr("transform", transform(d3.zoomIdentity));
	// var labels = d3.select("label");
	// labels.transition().duration(200).attr("transform", transform(d3.zoomIdentity));
	var zoom = d3.zoom().scaleExtent([0.5, 3]).on("zoom", zoomed);

	//zoomArea.call(d3.zoom().scaleExtent([1, 3]).on("zoom", zoomed));

	//transformArea.attr("transform", transform(d3.zoomIdentity));

	function zoomed() {
		transformArea.attr("transform", d3.event.transform);

		var k = d3.event.transform.k;
		var x = d3.event.transform.x;
		var y = d3.event.transform.y;

		// See if we cross the 'show' threshold in either direction
      	if(k >= threshold)
			svg.selectAll("text").classed('on',true);
      	else if(k < threshold)
			svg.selectAll("text").classed('on',false);

		// // move edges
	 //    links.attr("x1", function(d) { return x + k * (d.source.x); })
	 //    .attr("y1", function(d) { return y + k * (d.source.y); })
	 //    .attr("x2", function(d) { return x + k * (d.target.x); })
	 //    .attr("y2", function(d) { return y + k * (d.target.y); });

	 //    // move nodes
	 //    nodes.attr("transform", function(d) { return "translate(" + (x + k * d.x) + "," + (y + k * d.y) + ")" });

	 //    // move labels
	 //    labels.attr("transform", function(d) { return "translate(" + (x + k * d.x) + "," + (y + k * d.y) + ")" });

	 //links.attr("transform", transform(d3.event.transform));
	 //nodes.attr("transform", transform(d3.event.transform));
	 //labels.attr("transform", transform(d3.event.transform));


	    trans.k = k;
	   	trans.x = x;
	   	trans.y = y;
	};

	// function transform(t) {
 //  		return function(d) {
 //    		return "translate(" + t.apply(d) + ")";
 //  		};
	// };

	zoom(zoomArea);

};