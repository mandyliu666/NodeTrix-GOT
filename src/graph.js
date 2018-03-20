function Graph(w, h, legend) {
	this.threshold = 2;
	//this.paths = paths;
	this.colorlegend = legend;
	this.w = w;
	this.h = h;
	this.nodes = [];
	this.links = [];
	this.weights = {};
	this.currNodes = [];
	this.currLinks = [];
	this.currNeighbors = {};
}


Graph.prototype.create = function (links, nodes, neighbors, weights) {
	this.layer = d3.select("#force");
	this.svg = d3.select("#mainsvg");
	this.nodes = nodes;
	this.links = links;
	this.weights = weights;

	var _this = this;

	nodes.forEach(function(d) {
		_this.currNodes.push(d);
	});

	links.forEach(function(d) {
		_this.currLinks.push(d);
	});

	Object.keys(neighbors).forEach(function(d) {
		_this.currNeighbors[d] = neighbors[d];
	});

	var network = this.layer.append("g")
		.attr("id", "networklayer");
	var link = network.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(links)
		.enter().append("line")
		.attr("fill", "#bbb")
	    .attr("stroke-width", 2);

	var node = network.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.attr("r", function(d) { return Math.sqrt(weights[d.id] + 10); })
		.attr("id", function(d) { return "n" + d.id; })
		.style("fill", function(d) {
			var familyname = d.fam;
			//console.log(familyname);
			if(familyname in _this.colorlegend) {
				//console.log(_this.colorlegend[familyname]);
				return _this.colorlegend[familyname];
			} else return "#bbb";
		})
		.attr('pointer-events', 'all')
		.on("mouseover", function(d) { highlight(d, true, neighbors); })
		.on("mouseout", function(d) { highlight(d, false, neighbors); })
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
		.force("link", d3.forceLink().id(function(d) { return d.id; })
		.distance(function(d) { return 60; }))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(this.w / 2, this.h / 2))
		.force("x", d3.forceX(this.w * 0.8))
        .force("y", d3.forceY(this.h * 0.8));

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
		console.log(1);
		for (var i in matrix_list) {
			var matrix = matrix_list[i];
			var x = d3.event.x;
			var y = d3.event.y;
			if (x>matrix.x && x<matrix.x+matrix.unitsize*matrix.num_nodes && y>matrix.y && y<matrix.y+matrix.unitsize*matrix.num_nodes) {
				console.log(2);
				var aaa = {};
				aaa[d.id] = 1;
				_this.delete(aaa);
				matrix.Push(d.id);
			}
		}
		
	}

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
			.attr("cx", function(d) { 
				paths.data.forEach(function(dd) {
					//console.log(dd);
					if (dd.force_id == d.id) {
						dd.pos_end.x = d.x;
						dd.pos_end.y = d.y;
					}
				});
				return d.x; 
			})
			.attr("cy", function(d) { return d.y; });

		label
			.attr("x", function(d) { return d.x+10; })
			.attr("y", function(d) { return d.y+3; });
		
		paths.Update();
		
		//d3.selectAll('.p'+nownode)
		//	.forEach(function)
		//console.log(nowx);
	}

}

Graph.prototype.add = function (ids) {
	console.log(ids);
	if(Object.keys(ids).length === 0) return;
	// add more nodes & links in the graph
	var n = this.currNodes;
	var l = this.currLinks;
	var ngb = this.currNeighbors;
	this.nodes.forEach(function(d) {
		if(ids[d.Id] != null) {
			n.push(d);
			if(ngb[d.Id] == null) ngb[d.Id] = [];
		}
	});

	this.links.forEach(function(d) {
		if(ids[d.Source] == null || ids[d.Target] == null) {
			if(!l.includes(d)) {
				l.push(d);
				ngb[d.Source].push(d.Target);
				ngb[d.Target].push(d.Source);
			}
		}
	});
	this.currNodes = n;
	this.currLinks = l;
	this.currNeighbors = ngb;
	graph.update();
	
	/*originData.forEach(function(d) {
		var in_matrix, in_force;
		if (matrix_nodes.indexOf(d.Source)>=0 && ) {
			in_matrix = d.Source;
			in_force = d.Target;
		}
		else if (matrix_nodes.indexOf(d.Target)>=0) {
			in_matrix = d.Target;
			in_force = d.Source;
		}
		else return;
		
	});*/
	//paths.Create();
}

Graph.prototype.delete = function (ids) {
	if(Object.keys(ids).length === 0) return;
	// delete nodes & links in the graph
	var n = this.currNodes;
	var l = this.currLinks;
	var ngb = this.currNeighbors;

	this.nodes.forEach(function(d) {
		if(ids[d.Id] == 1) {
			var idx = n.indexOf(d);
			if(idx != -1) n.splice(idx, 1);
			if(ngb[d.Id] != null) ngb[d.Id] = [];
		}
	});

	this.links.forEach(function(d) {
		if(!(ids[d.Source] == null && ids[d.Target] == null)) {
			if(l.includes(d)) {
				var idx = l.indexOf(d);
				l.splice(idx, 1);
				if(ngb[d.Source] != null && ngb[d.Source].includes(d.Target)) {
					var t = ngb[d.Source].indexOf(d.Target);
					ngb[d.Source].splice(t, 1);
				}
				if(ngb[d.Target] != null && ngb[d.Target].includes(d.Source)) {
					var s = ngb[d.Target].indexOf(d.Source);
					ngb[d.Target].splice(s, 1);
				}
			}
		}
	});
	
	for (var str in Object.keys(ids)) d3.select('#n'+Object.keys(ids)[str]).remove();
	
	for (var i=paths.data.length-1;i>=0;i--) if (paths.data[i].force_id in ids) paths.data.splice(i, 1); //delete data that won't be used
	paths.Render();

	this.currNodes = n;
	this.currLinks = l;
	this.currNeighbors = ngb;
	graph.update();
}

Graph.prototype.update = function () {

	d3.selectAll("#networklayer > *").remove();
	var _this = this;

	var nodes = this.currNodes;
	var links = this.currLinks;
	var neighbors = this.currNeighbors;
	var weights = this.weights;

	var network = this.layer.append("g")
		.attr("id", "networklayer");
	var link = network.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(links)
		.enter().append("line")
		.attr("fill", "#bbb")
	    .attr("stroke-width", 2);

	var node = network.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.attr("r", function(d) { return Math.sqrt(weights[d.Id] + 10); })
		.attr("id", function(d) { return "n" + d.Id; })
		.style("fill", function(d) {
			var familyname = d.Family;
			//console.log(familyname);
			if(familyname in _this.colorlegend) {
				//console.log(_this.colorlegend[familyname]);
				return _this.colorlegend[familyname];
			} else return "#bbb";
		})
		.attr('pointer-events', 'all')
		.on("mouseover", function(d) { highlight(d, true, neighbors); })
		.on("mouseout", function(d) { highlight(d, false, neighbors); })
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
	    .attr("id", function(d) { return "l" + d.Id; })
	    .text(function(d) { return d.Label; });


	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d) { return d.Id; })
		.distance(function(d) { return 60; }))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(_this.w / 2, _this.h / 2))
		.force("x", d3.forceX(_this.w * 0.8))
        .force("y", d3.forceY(_this.h * 0.8));

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
		for (var i in matrix_list) {
			var matrix = matrix_list[i];
			var x = d3.event.x;
			var y = d3.event.y;
			if (x>matrix.x && x<matrix.x+matrix.unitsize*matrix.num_nodes && y>matrix.y && y<matrix.y+matrix.unitsize*matrix.num_nodes) {
				console.log(2);
				var aaa = {};
				aaa[d.id] = 1;
				_this.delete(aaa);
				matrix.Push(d.id);
			}
		}
	}

	simulation
		.nodes(nodes)
		.on("tick", ticked);

	simulation
		.force("link")
		.links(links);

	function ticked() {
		link
		    .attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });
			    
		node
			.attr("cx", function(d) { 
				paths.data.forEach(function(dd) {
					//console.log(dd);
					if (dd.force_id == d.id) {
						dd.pos_end.x = d.x;
						dd.pos_end.y = d.y;
					}
				});
				return d.x; 
			})
			.attr("cy", function(d) { return d.y; });

		label
			.attr("x", function(d) { return d.x+10; })
			.attr("y", function(d) { return d.y+3; });
		
		paths.Update();
	}
	var newlasso = new Lasso();
	newlasso.bind();

	var newzoom = new Zoom(d3.select("#mainsvg"), transform);
}

function highlight(node, state, neighbors) {

	var nid = parseId(node.id);

	var c = d3.select("#n" + nid);
	var l = d3.select("#l" + nid);

	c.classed("main", state);
	l.classed("on", state);
	l.classed("main", state);
		
	// activate all siblings
	neighbors[node.id].forEach( 
	    function(id) {
	      	var idd = parseId(id);
			d3.select("#n" + idd).classed("sibling", state);
			d3.select("#l" + idd).classed("on", state);
			d3.select("#l" + idd).selectAll("text").classed("sibling", state);
	    });
}

function parseId (id) {
	if(id.indexOf('(') != -1) {
		var lidx = id.indexOf('(');
		var ridx = id.indexOf(')');
		return id.substring(0, lidx) + '\\' + id.substring(lidx, ridx) + '\\' + id.substring(ridx);
	} else return id;
}

