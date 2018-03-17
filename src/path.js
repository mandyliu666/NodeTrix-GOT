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
		this.locallayer.selectAll('path')
					.data(_this.data)
					.enter()
					.append('');
		
	}
}());
