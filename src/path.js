function Paths() {
	this.data = [];
	this.locallayer = d3.select('#path');
	this.num = 0;
}

Paths.prototype.outDist = 20;
	
Paths.prototype.Create = function(matrix_nodes, matrix_list, dataNode, dataLink) {
	var _this = this;
	this.matrix_list = matrix_list;
	//var zoom = new Zoom(d3.select('#mainsvg'), _this.locallayer, trans);
	dataLink.forEach(function(d) {	
		var in_matrix, in_force;
		if (matrix_nodes.indexOf(d.Source)>=0) {
			in_matrix = d.Source;
			in_force = d.Target;
		}
		else if (matrix_nodes.indexOf(d.Target)>=0) {
			in_matrix = d.Target;
			in_force = d.Source;
		}
		else return;
		//console.log(in_force);
		var node = d3.selectAll('#n'+in_force);
		if (node.empty()) return;
//		console.log(node);
		//console.log(node.attr(''));
		var matrix;
		var num;
		
		for (var i in matrix_list) if (matrix_list[i].nodes.indexOf(in_matrix) >= 0) {
			//console.log(d3.selectAll(function() {return '.matrix'+i;}));
			matrix = matrix_list[i];
			//console.log(matrix);
			num = matrix_list[i].nodes.indexOf(in_matrix);
			break;
		}
			
		_this.data.push({
			r: node.attr('r'),
			x: matrix.x,
			y: matrix.y,
			matrix_id: in_matrix,
			force_id: in_force,
			center: {x: matrix.x+num*matrix.unitsize+matrix.unitsize/2, y: matrix.y+num*matrix.unitsize+matrix.unitsize/2},
			pos0: {x: matrix.x+num*matrix.unitsize+matrix.unitsize/2, y: matrix.y},
			pos1: {x: matrix.x, y: matrix.y+num*matrix.unitsize+matrix.unitsize/2},
			pos2: {x: matrix.x+matrix.num_nodes*matrix.unitsize, y: matrix.y+num*matrix.unitsize+matrix.unitsize/2},
			pos3: {x: matrix.x+num*matrix.unitsize+matrix.unitsize/2, y: matrix.y+matrix.num_nodes*matrix.unitsize},
			pos_end: {x: 0, y: 0},
		})
		_this.num++;
	});
	//console.log(_this.data);
}

Paths.prototype.UpdateData = function() {  //update existing data 
	var _this = this;
	this.data.forEach(function(d) { //rearrange
		var matrix;
		var num;
		for (var i in _this.matrix_list) if (_this.matrix_list[i].nodes.indexOf(d.matrix_id) >= 0) { //find the matrix and num
			matrix = _this.matrix_list[i];
			num = _this.matrix_list[i].nodes.indexOf(d.matrix_id);
			break;
		}
		d.pos0.x = matrix.x+num*matrix.unitsize+matrix.unitsize/2;
		d.pos0.y = matrix.y;
		d.pos1.x = matrix.x;
		d.pos1.y = matrix.y+num*matrix.unitsize+matrix.unitsize/2;
		d.pos2.x = matrix.x+matrix.num_nodes*matrix.unitsize;
		d.pos2.y = matrix.y+num*matrix.unitsize+matrix.unitsize/2;
		d.pos3.x = matrix.x+num*matrix.unitsize+matrix.unitsize/2
		d.pos3.y = matrix.y+matrix.num_nodes*matrix.unitsize;
	});
}

Paths.prototype.Delete = function(id) {
	var _this = this;
	this.locallayer.selectAll('.path'+id).remove();
	for (var i=this.data.length-1;i>=0;i--) if (this.data[i].matrix_id == id) this.data.splice(i, 1); //delete data that won't be used
	this.UpdateData();
	this.Update();
}

Paths.prototype.Push = function(id) {
	
	
}

Paths.prototype.generate = function(d) {
	var _this = this;
	var result = [];
	result.push([d.pos_end.x, d.pos_end.y]);
	var xx = d.pos2.x;
	var yy = d.pos3.y;
	//decide the point to use
	//console.log(_this.x)
	if (d.pos_end.x < d.x && d.pos_end.y < yy) { //left
		result.push([d.pos1.x-_this.outDist, d.pos1.y]);
		result.push([d.pos1.x, d.pos1.y]);
	}
	else if (d.pos_end.x > xx && d.pos_end.y > d.y) { //right
		result.push([d.pos2.x+_this.outDist, d.pos2.y]);
		result.push([d.pos2.x, d.pos2.y]);
	}
	else if (d.pos_end.x > d.x && d.pos_end.y < d.y) { //up
		result.push([d.pos0.x, d.pos0.y-_this.outDist]);
		result.push([d.pos0.x, d.pos0.y]);
	}
	else if (d.pos_end.x < xx && d.pos_end.y > yy) { //down
		result.push([d.pos3.x, d.pos3.y+_this.outDist]);
		result.push([d.pos3.x, d.pos3.y]);
	}
	//console.log(d);
	var dis = Math.sqrt((result[0][0] - result[1][0]) * (result[0][0] - result[1][0]) + (result[0][1] - result[1][1]) * (result[0][1] - result[1][1]));
	result[0][0] = result[0][0]+((d.r*1.1)/dis)*(result[1][0]-result[0][0]);
	result[0][1] = result[0][1]+((d.r*1.1)/dis)*(result[1][1]-result[0][1]);
	
	//console.log(result);
	return result;
}
	
Paths.prototype.Render = function() {
	d3.selectAll(this.locallayer.attr('id')+' > *').remove();
	var _this = this;
	console.log(_this.data);
	var line = d3.line()
				.x(function(d) {return d[0];})
				.y(function(d) {return d[1];})
				.curve(d3.curveBasis);
	this.locallayer.selectAll('path')
					.data(_this.data)
					.enter()
					.append('path')
					.attr('class', function(d) {return 'path'+d.matrix_id;})
					.attr('d', function(d) {return line(_this.generate(d));})
					.attr('stroke', '#999')
					.attr('stroke-width', 2)
					.attr('fill', 'none')
					.attr('stroke-opacity', 0.2);
}

Paths.prototype.Update = function() {
	var _this = this;
	var line = d3.line()
				.x(function(d) {return d[0];})
				.y(function(d) {return d[1];})
				.curve(d3.curveBasis);
	this.locallayer.selectAll('path')
					.attr('d', function(d) {return line(_this.generate(d));});
}

