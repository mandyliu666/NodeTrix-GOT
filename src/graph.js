function Graph() {
	this.layer = d3.select("#force");
	this.svg = d3.select("#mainsvg");
	this.threshold = 2;
}

Graph.prototype.create = function (w, h, links, nodes, neighbors, weights, trans) {
	var network = this.layer.append("g");
	var link = network.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(links)
		.enter().append("line")
		.attr("fill", "#000")
	    .attr("stroke-width", 2);

	var node = network.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.attr("r", function(d) { return Math.sqrt(weights[d.id] + 10); })
		.attr("id", function(d) { return "n" + d.id; })
		.attr("fill", "#bbb")
		.attr('pointer-events', 'all')
		.on("mouseover", function(d) { highlight(d, true); })
		.on("mouseout", function(d) { highlight(d, false); })
		.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));

	var label = network.append("g")
	    .attr("class", "labels")
	    .selectAll("text")
	    .data(nodes)
	    .enter().append("text")
	    .attr("class", "label")
	    .attr("id", function(d) { return "l" + d.id; })
	    .text(function(d) { return d.label; });


	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return 60; }))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(w / 2, h / 2))
		.force("x", d3.forceX(w * 0.8))
        .force("y", d3.forceY(h * 0.8));

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	  	d.fx = d.x;
	  	d.fy = d.y;
	}

	function dragged(d) {
	  	d.fx = d3.event.x; 
	  	d.fy = d3.event.y;
	}

	function dragended(d) {
	  	if (!d3.event.active) simulation.alphaTarget(0);
	  	d.fx = null;
	  	d.fy = null;
	}


	var zoom = new Zoom(this.svg, this.layer, trans);

	simulation
		.nodes(nodes)
		.on("tick", ticked);

	simulation
		.force("link")
		.links(links);

	function ticked() {

		 //    link
		 //        .attr("x1", function(d) { return trans.x + trans.k * d.source.x; })
		 //        .attr("y1", function(d) { return trans.y + trans.k * d.source.y; })
		 //        .attr("x2", function(d) { return trans.x + trans.k * d.target.x; })
		 //        .attr("y2", function(d) { return trans.y + trans.k * d.target.y; });
			    
			// node
			// 	.attr("cx", function(d) { return trans.x + trans.k * d.x; })
			// 	.attr("cy", function(d) { return trans.y + trans.k * d.y; });

			// label
			// 	.attr("x", function(d) { return trans.x + trans.k * d.x+12; })
			// 	.attr("y", function(d) { return trans.y + trans.k * d.y+3; });
			
		link
		    .attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });
			    
		node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

		label
			.attr("x", function(d) { return d.x+10; })
			.attr("y", function(d) { return d.y+3; });
	}

	function highlight(node, state) {

		var nid = parseId(node.id);

		var c = d3.select("#n" + nid);
		var l = d3.select("#l" + nid);

	    c.classed("main", state);
	    l.classed("on", state || trans.k >= this.threshold);
	    l.classed("main", state);
		
		// activate all siblings
	    neighbors[node.id].forEach( 
	        function(id) {
	      		var idd = parseId(id);
				d3.select("#n" + idd).classed("sibling", state);
				d3.select("#l" + idd).classed("on", state || trans.k >= this.threshold);
				d3.select("#l" + idd).selectAll("text").classed("sibling", state);
	      	});
	}
		
	function parseId(id) {
		if(id.indexOf('(') != -1) {
			var lidx = id.indexOf('(');
			var ridx = id.indexOf(')');
			return id.substring(0, lidx) + '\\' + id.substring(lidx, ridx) + '\\' + id.substring(ridx);
		} else return id;
	}
}

Graph.prototype.update = function () {

}

