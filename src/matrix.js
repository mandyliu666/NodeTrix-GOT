function Matrix(id, paths) {
	this.id = id;
	this.num_nodes = 0;
	this.num_edges = 0;
	this.nodes = [];
	this.edges = [];
	this.adj_matrix = [];
	this.x = 100;
	this.y = 100;
	this.locallayer = d3.select('#matrix')
						.append('g')
						.attr('id', 'mat'+this.id);	
	this.paths = paths;
}

Matrix.prototype.type = 'matrix';
Matrix.prototype.unitsize = 15;
Matrix.prototype.fontsize = 10;

//Matrix.prototype.insert
Matrix.prototype.Create = function(node, data) {
	var _this = this;
	this.data = data;
	//var zoom = new Zoom(d3.select('#mainsvg'), _this.locallayer, trans);
	for (var i in node) this.nodes.push(node[i]);
	this.num_nodes = node.length;
	//console.log(data);
	data.forEach(function(d, i) {
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
}

Matrix.prototype.Delete = function(id) { //delete id from one matrix
	var _this = this;
	var num = this.nodes.indexOf(id);
	if (num >= 0) {
		this.nodes.splice(num, 1);
		for (var i in this.adj_matrix) this.adj_matrix[i].splice(num, 1);
		this.adj_matrix.splice(num, 1);
		//for (var i in this.edges)
	}
	this.num_nodes--;
	this.paths.Delete(id);
	this.Render();
}

Matrix.prototype.Push = function(id) {
	var _this = this;
	var num = this.nodes.indexOf(id);
	if (num < 0) {
		this.nodes.push(id);
		for (var i in this.nodes) this.adj_matrix[i].push(0);
		this.adj_matrix.push([]);
		for (var i in this.nodes) this.adj_matrix[this.num_nodes].push(0);
		data.forEach(function(d) {
			if (d.Source==id && _this.nodes.indexOf(d.Target)>=0) {
				this.adj_matrix[this.num_nodes][_this.nodes.indexOf(d.Target)] = 1;
				this.adj_matrix[_this.nodes.indexOf(d.Target)][this.num_nodes] = 1;
			}
			else if (d.Target==id && _this.nodes.indexOf(d.Source)>=0) {
				this.adj_matrix[this.num_nodes][_this.nodes.indexOf(d.Source)] = 1;
				this.adj_matrix[_this.nodes.indexOf(d.Source)][this.num_nodes] = 1;
			}
		});
		this.num_nodes++;
	}
	this.Render();
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
							.data([{i: i, j: j}])
							.attr('class', 'matrix'+_this.id)
							.attr('width', this.unitsize-1)
							.attr('height', this.unitsize-1)
							.attr('x', _this.x+i*this.unitsize)
							.attr('y', _this.y+j*this.unitsize)
							.style('fill', function(d){return (_this.adj_matrix[d.i][d.j]==1)?'#cbcbcb':'#424242';})
							.on('mousedown', function(d) {
								if (d.i==d.j) {
									_this.Delete(_this.nodes[d.i]);
								}
							})
							.on('mouseover', function(d) {
								d3.select(this).style('fill', 'red');
							})
							.on('mouseout', function(d) {
								d3.select(this).style('fill', function(){return (_this.adj_matrix[d.i][d.j]==1)?'#cbcbcb':'#424242';});
							});
							//.style('stroke', '#cbcbcb');
		}
	for (var i in this.nodes) {
		_this.locallayer.append('text')
						.attr('class', function(){return 'text'+_this.id;})
						.text(this.nodes[i])
						.style('text-anchor', 'end')
						.attr('x', this.x-5)
						.attr('y', this.y+i*this.unitsize+10)
						.style('font-size', '10px');
	}				
};
