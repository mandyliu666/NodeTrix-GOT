function Matrix(x, y) {
	this.id = matrix_list.length;
	this.num_nodes = 0;
	this.num_edges = 0;
	this.nodes = [];
	this.edges = [];
	this.adj_matrix = [];
	this.x = x;
	this.y = y;
	this.locallayer = d3.select('#matrix')
						.append('g')
						.attr('id', 'mat'+this.id);	
	//this.paths = paths;
}

Matrix.prototype.type = 'matrix';
Matrix.prototype.unitsize = 10;
Matrix.prototype.fontsize = 10;

//Matrix.prototype.insert
Matrix.prototype.Create = function(node) {
	var _this = this;
	//this.data = data;
	//var zoom = new Zoom(d3.select('#mainsvg'), _this.locallayer, trans);
	for (var i in node) {
		this.nodes.push(node[i]);
		matrix_nodes.push(node[i]);
	}
	this.num_nodes = node.length;
	//console.log(data);
	originData.forEach(function(d, i) {
		if ((node.includes(d.Source)) && (node.includes(d.Target))) {
			_this.edges.push(d);
			_this.num_edges=_this.num_edges+1;
		}
	});
	var m = this.adj_matrix;
	for (var i in node) {
		this.adj_matrix.push([]);
		for (var j in node) {
			this.adj_matrix[i].push(0)
		}
		this.adj_matrix[i][i] = 1;
	}
	for (var i in this.edges) {
		var x = this.nodes.indexOf(this.edges[i].Source);
		var y = this.nodes.indexOf(this.edges[i].Target);
		this.adj_matrix[x][y] = 1;
		this.adj_matrix[y][x] = 1;
	}
	matrix_list.push(this);
	this.Render();
	if (paths.created)
		for (var i in node) paths.Push(node[i]);
}

Matrix.prototype.Delete = function(id) { //delete id from one matrix
	var _this = this;
	var num = this.nodes.indexOf(id);
	var nn = matrix_nodes.indexOf(id);
	matrix_nodes.splice(nn, 1);
	if (num >= 0) {
		this.nodes.splice(num, 1);
		for (var i in this.adj_matrix) this.adj_matrix[i].splice(num, 1);
		this.adj_matrix.splice(num, 1);
		//for (var i in this.edges)
	}
	this.num_nodes--;
	paths.Delete(id);
	this.Render();
	var aaa = {};
	aaa[id] = 1;
	graph.add(aaa);
}

Matrix.prototype.Push = function(id) {
	var _this = this;
	var num = this.nodes.indexOf(id);
	if (num < 0) {
		for (var i in this.nodes) this.adj_matrix[i].push(0);
		this.nodes.push(id);
		this.adj_matrix.push([]);
		for (var i in this.nodes) this.adj_matrix[this.num_nodes].push(0);
		originData.forEach(function(d) {
			if (d.Source==id && _this.nodes.indexOf(d.Target)>=0) {
				_this.adj_matrix[_this.num_nodes][_this.nodes.indexOf(d.Target)] = 1;
				_this.adj_matrix[_this.nodes.indexOf(d.Target)][_this.num_nodes] = 1;
			}
			else if (d.Target==id && _this.nodes.indexOf(d.Source)>=0) {
				_this.adj_matrix[_this.num_nodes][_this.nodes.indexOf(d.Source)] = 1;
				_this.adj_matrix[_this.nodes.indexOf(d.Source)][_this.num_nodes] = 1;
			}
		});
		this.adj_matrix[this.num_nodes][this.num_nodes] = 1;
		this.num_nodes++;
	}
	this.Render();
	paths.Push(id, originData);
}

Matrix.prototype.Clear = function() {
	this.num_nodes = 0;
	this.num_edges = 0;
	this.nodes = [];
	this.edges = [];
	this.Render();
}

Matrix.prototype.Render = function() {
	d3.selectAll('#mat'+this.id+' > *').remove();
	var _this = this;
	for (var i in this.nodes)
		for (var j in this.nodes) {
			_this.locallayer.append('rect')
							.data([{namei:_this.nodes[i], namej:_this.nodes[j], id: _this.id, i: +i, j: +j}])
							.attr('class', 'matrix'+_this.id)
							.attr('width', this.unitsize-1)
							.attr('height', this.unitsize-1)
							.attr('x', _this.x+i*this.unitsize)
							.attr('y', _this.y+j*this.unitsize)
							.style('fill', function(d){return (_this.adj_matrix[d.i][d.j]==1)?'#cbcbcb':'#424242';})
							.on('contextmenu', function(d) {
								d3.event.preventDefault();
								if (d.i==d.j) {
									_this.Delete(_this.nodes[d.i]);
								}
							})
							.on('mouseover', function(d) {
								d3.select(this).style('fill', 'red');
								if (d.i==d.j) {
									d3.selectAll('rect').style('fill', function(dd) {
										return (matrix_list[dd.id].adj_matrix[dd.i][dd.j]==1)?'#cbcbcb':'#424242';
									});
									d3.select(this).style('fill', 'blue');
									d3.selectAll('path').attr('stroke', '#999');
									//console.log(d3.selectAll('.path'+d.namei));
									d3.selectAll('.path'+d.namei)
										.attr('stroke', 'blue');
									
								}
							})
							.on('mouseout', function(d) {
								if (d.i!=d.j) d3.select(this).style('fill', function(){return (_this.adj_matrix[d.i][d.j]==1)?'#cbcbcb':'#424242';});
								//if (d.i==d.j)
								//	d3.selectAll('.path'+d.namei)
								//		.attr('stroke', '#999');
							})
							.call(d3.drag()
									.on("start", dragstarted)
									.on("drag", dragged)
									.on("end", dragended));
		}
	for (var i in this.nodes) {
		_this.locallayer.append('text')
						.attr('class', function(){return 'text'+_this.id;})
						.text(ReplaceDash(this.nodes[i]))
						.style('text-anchor', 'end')
						.attr('x', this.x-5)
						.attr('y', this.y+i*this.unitsize+10)
						.style('font-size', '10px');
	}				
};

function ReplaceDash(str) {
	for (var i=0;i<str.length;i++) if (str.charAt(i)=='-') str = str.slice(0,i)+' '+str.slice(i+1);
	return str;
}

function dragstarted(d) {
	d3.selectAll('.matrix'+d.id).raise().classed("active", true);
}

function dragged(d) {
	var matrix = matrix_list[d.id];
	var mat = d3.selectAll('.matrix'+d.id)
	matrix.x = d3.event.x-d.i*matrix.unitsize;
	matrix.y = d3.event.y-d.j*matrix.unitsize;
	matrix.Render();
	paths.UpdateData();
	paths.Update();
	//d3.select('.').attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
	d3.select('.matrix'+d.id).classed("active", false);
}

var matrix_list = [];
var matrix_nodes = [];
var originData;