function Lasso() {
	this.circles = d3.selectAll("circle");
	this.svg = d3.select("#mainsvg");
	this.available = false;
	this.lasso = d3.lasso();
}

Lasso.prototype.bind = function () {
	// Lasso functions
	var lassostarted = function() {
			lasso.items()
		    	//.attr("fill", "#bbb")
		    	.classed("notpossible", true)
		        .classed("selected", false);
	};

	var lassodraw = function() {
	    	// Style the possible dots
			lasso.possibleItems()
			    .classed("notpossible", false)
			    .classed("possible", true);

			// Style the not possible dot
			lasso.notPossibleItems()
			    .classed("notpossible", true)
			    .classed("possible", false);
	};

	var lassoended = function() {
			// Reset the color of all dots
		    lasso.items()
		        .classed("notpossible", false)
		        .classed("possible", false);

			// Style the selected dots
		    lasso.selectedItems()
		        .classed("selected", true);
		        //.attr("fill", "red");

		    // Reset the style of the not selected dots
		    // lasso.notSelectedItems()
		    //     .attr("fill", "#bbb");

		    // update graph and matrix
		    var selected = lasso.selectedItems;
		    Graph.update()
		    console.log(lasso.selectedItems);
	};
 
	var lasso = this.lasso
	    .closePathSelect(true)
	    .closePathDistance(100)
	    .items(this.circles)
	    .targetArea(this.svg)
	    .on("start", lassostarted)
	    .on("draw", lassodraw)
	    .on("end", lassoended);


	this.svg.call(this.lasso);

};

Lasso.prototype.unbind = function () {


}