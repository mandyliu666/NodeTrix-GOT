function Lasso(svg) {

	var circles = d3.selectAll("circle");
	// Lasso functions
	var lasso_start = function() {
		if(key.shift) {
			lasso.items()
		    	//.attr("fill", "#bbb")
		    	.classed("not_possible",true)
		        .classed("selected",false);
		}
	};

	var lasso_draw = function() {
	    if(key.shift) {
	    	// Style the possible dots
			lasso.possibleItems()
			    .classed("not_possible",false)
			    .classed("possible",true);

			// Style the not possible dot
			lasso.notPossibleItems()
			    .classed("not_possible",true)
			    .classed("possible",false);
	    }
	};

	var lasso_end = function() {
		if(key.shift) {
			// Reset the color of all dots
		    lasso.items()
		        .classed("not_possible",false)
		        .classed("possible",false);

			// Style the selected dots
		    lasso.selectedItems()
		        .classed("selected",true)
		        .attr("fill", "red");

		    // Reset the style of the not selected dots
		    lasso.notSelectedItems()
		        .attr("fill", "#bbb");
		}
	};
	        
	var lasso = d3.lasso()
	    .closePathSelect(true)
	    .closePathDistance(100)
	    .items(circles)
	    .targetArea(svg)
	    .on("start", lasso_start)
	    .on("draw", lasso_draw)
	    .on("end", lasso_end);
	        
	svg.call(lasso);
}