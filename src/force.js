function draw_force(matrix_nodes, networkWidth, networkHeight, dataLink, dataNode, trans, svg) {
		var networkplot = d3.select('#force');
		var dataLinks = [];
		var dataNodes = [];
		var nodeWeight = {};
		var neighbors = {};
		var threshold = 2.5;

		dataNode.forEach(function(d) {
			if (matrix_nodes.indexOf(d.Id)<0) {
				d.id = d.Id;
				d.label = d.Label;
				dataNodes.push(d);
				nodeWeight[d.id] = 0;
				neighbors[d.id] = [];
			}
		});

		dataLink.forEach(function(d) {
			if (matrix_nodes.indexOf(d.Source)<0 && matrix_nodes.indexOf(d.Target)<0) { 
				d.weight = +d.weight;
				d.source = d.Source;
				d.target = d.Target;
				dataLinks.push(d);
				nodeWeight[d.source]++;
				nodeWeight[d.target]++;
				neighbors[d.source].push(d.target);
				neighbors[d.target].push(d.source);
			}
		});

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(networkWidth / 2, networkHeight / 2));

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
		var network = networkplot.append("g");
		var link = network.append("g")
		    .attr("class", "links")
		    .selectAll("line")
		    .data(dataLinks)
		    .enter().append("line")
		    .attr("fill", "#000")
		    .attr("stroke-width", 2);

		var node = network.append("g")
			.attr("class", "nodes")
		    .selectAll("circle")
		    .data(dataNodes)
		    .enter().append("circle")
		    .attr("r", function(d) {
		    	return Math.sqrt(nodeWeight[d.id] + 10)})
			.attr("id", function(d) {
				return "n" + d.id;
			})
		    .attr("fill", "#bbb")
		    .call(d3.drag()
		    .on("start", dragstarted)
		    .on("drag", dragged)
		    .on("end", dragended))
		    .on("mouseover", function(d) { highlight(d, true, this); })
		    .on("mouseout", function(d) { highlight(d, false, this); });

	    var label = network.append("g")
	        .attr("class", "labels")
	    	.selectAll("text")
	    	.data(dataNodes)
	    	.enter().append("text")
	      	.attr("class", "label")
	      	.attr("id", function(d) {
	      		return "l" + d.id;
	      	})
	      	.text(function(d) { return d.label; });
		
		simulation
			.nodes(dataNodes)
			.on("tick", ticked);

		simulation
			.force("link")
			.links(dataLinks);

		function ticked() {

		    link
		        .attr("x1", function(d) { return trans.x + trans.k * d.source.x; })
		        .attr("y1", function(d) { return trans.y + trans.k * d.source.y; })
		        .attr("x2", function(d) { return trans.x + trans.k * d.target.x; })
		        .attr("y2", function(d) { return trans.y + trans.k * d.target.y; });
			    
			node
				.attr("cx", function(d) { 
					//d.x = Math.max(10, Math.min(networkWidth - 10, d.x));
					return trans.x + trans.k * d.x; })
				.attr("cy", function(d) { 
					//d.y = Math.max(10, Math.min(networkHeight - 10, d.y));
					return trans.y + trans.k * d.y; });

			label
				.attr("x", function(d) { return trans.x + trans.k * d.x+12; })
				.attr("y", function(d) { return trans.y + trans.k * d.y+3; });
			// link
		 //        .attr("x1", function(d) { return d.source.x; })
		 //        .attr("y1", function(d) { return d.source.y; })
		 //        .attr("x2", function(d) { return d.target.x; })
		 //        .attr("y2", function(d) { return d.target.y; });
			    
			// node
			// 	.attr("cx", function(d) { return d.x; })
			// 	.attr("cy", function(d) { return d.y; });

			// label
			// 	.attr("x", function(d) { return d.x+12; })
			// 	.attr("y", function(d) { return d.y+3; });
		}

		Zoom(svg, link, node, label, trans);

		function highlight(node, state) {

			var nid = parseId(node.id);

			var circle = d3.select("#n" + nid);
			var label = d3.select("#l" + nid);

	      	circle.classed("main", state);
	      	label.classed("on", state || trans.k >= threshold);
	      	label.selectAll("text").classed("main", state);
		
			// activate all siblings
	      	neighbors[node.id].forEach( 
	      		function(id) {
	      			var idd = parseId(id);
					d3.select("#n" + idd).classed("sibling", state);
					d3.select("#l" + idd).classed("on", state || trans.k >= threshold);
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


