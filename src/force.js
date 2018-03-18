function draw_force(matrix_nodes, networkWidth, networkHeight, dataLink, dataNode, trans, svg, flayer) {
		var networkplot = d3.select('#force');
		var dataLinks = [];
		var dataNodes = [];
		var nodeWeight = {};
		var neighbors = {};
		var threshold = 2;

		dataNode.forEach(function(d) {
			d.id = d.Id;
			d.label = d.Label;
			nodeWeight[d.id] = 0;
			neighbors[d.id] = [];
			if (matrix_nodes.indexOf(d.Id)<0) {
				dataNodes.push(d);
			}
		});

		dataLink.forEach(function(d) {
			d.weight = +d.weight;
			d.source = d.Source;
			d.target = d.Target;
			nodeWeight[d.source]++;
			nodeWeight[d.target]++;
			if (matrix_nodes.indexOf(d.Source)<0 && matrix_nodes.indexOf(d.Target)<0) { 
				dataLinks.push(d);
				neighbors[d.source].push(d.target);
				neighbors[d.target].push(d.source);
			}
		});

		dataNodes = dataNodes.filter(function(d) {
			return nodeWeight[d.id] >= 3;
			//return d;
		});

		dataLinks = dataLinks.filter(function(d) {
			return nodeWeight[d.source] >= 3 && nodeWeight[d.target] >= 3;
			//return d;
		});

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return 10; }))
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(networkWidth / 2, networkHeight / 2))
			.force("x", d3.forceX(networkWidth * 0.8))
        	.force("y", d3.forceY(networkHeight * 0.8));

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
				//console.log(d.id);
				return d.id;
			})
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
				.attr("x", function(d) { return d.x+12; })
				.attr("y", function(d) { return d.y+3; });
		}

		Zoom(svg, flayer, link, node, label, trans, threshold, simulation);

		function highlight(node, state) {

			var nid = parseId(node.id);

			var c = d3.select("#n" + nid);
			var l = d3.select("#l" + nid);

	      	c.classed("main", state);
	      	l.classed("on", state || trans.k >= threshold);
	      	l.classed("main", state);
		
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


