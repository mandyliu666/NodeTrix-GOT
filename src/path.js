(function()
{
	function Paths() {
		this.data = [];
		this.locallayer = d3.select();
	}

	Path.prototype.create(matrix_nodes, matrix_list, dataNode, dataLink) {
		var _this = this;
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
			
			var node = d3.select(function() {return '#'+in_force;});
			var matrix;
			var num;
			
			for (var i in matrix_list) if (matrix_list[i].node.indexOf(in_matrix) >= 0) {
				//matrix = d3.select(function() {return '.'+i;});
				matrix = matrix_list[i];
				num = matrix_list[i].node.indexOf(in_matrix);
				break;
			}
			
			_this.data.push({
				matrix_id: in_matrix,
				force_id: in_force,
				center: {x: function() {return matrix.x+num*matrix.unitsize+matrix.unitsize/2;}, y: function() {return matrix.y+num*matrix.unitsize+matrix.unitsize/2;}},
				pos0: {x: function() {return matrix.x+num*matrix.unitsize+matrix.unitsize/2;}, y: function() {return matrix.y;}},
				pos1: {x: function() {return matrix.x;}, y: function() {return matrix.y+num*matrix.unitsize+matrix.unitsize/2;}},
				pos2: {x: function() {return matrix.x+matrix.num_nodes*matrix.unitsize;}, y: function() {return matrix.y+num*matrix.unitsize+matrix.unitsize/2;}},
				pos3: {x: function() {return matrix.x+num*matrix.unitsize+matrix.unitsize/2;}, y: function() {return matrix.y+matrix.num_nodes*matrix.unitsize;}},
				pos_end: {x: node.attr('x'), y: node.attr('y')},
			})
		});
	}
	
	Paths.prototype.render = function() {
		var _this = this;
		var generate = function(d) {
			var result = [];
			result.push([d.pos_end.x, d.pos_end.y]);
			var xx = d.pos2.x;
			var yy = d.pos3.y;
			//decide the point to use
			
			if (d.pos_end.x < _this.x && d.pos_end.y < yy) result.push([d.pos1.x, d.pos1.y]);//left
			else if (d.pos_end.x > xx && d.pos_end.y > _this.y) result.push([d.pos2.x, d.pos2.y]); //right
			else if (d.pos_end.x > _this.x && d.pos_end.y < _this.y) result.push([d.pos0.x, d.pos0.y]); //up
			else if (d.pos_end.x < xx && d.pos_end.y > yy) result.push([d.pos3.x, d.pos3.y]); //down
			return result;
		}
	
		var line = d3.svg.line(); 
		this.locallayer.selectAll('path')
					.data(_this.data)
					.enter()
					.append('path')
					.attr('d', line(generate(d))
					.attr('stroke-width', 2);
		
	}
}());
