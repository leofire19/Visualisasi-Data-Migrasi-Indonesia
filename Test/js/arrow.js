// arrows
function interContinental(continent, year, direction) {

  // filter data on direction
  if (direction == "outflows"){
    data = lines.filter(function(d){
      if (d.or_region == continent & d.year == year & d.tot_compl >= lowerBound){
        return d;
      }
    })
  } else if (direction == "inflows"){
    data = lines.filter(function(d){
      if (d.as_region == continent & d.year == year & d.tot_compl >= lowerBound){
        return d;
      }
    })
  }

  // attach data to arrows
  var arcs = gArrows.selectAll(".arrows").data(data);

  // define transition
  t = d3.transition().duration(1000)


  // remove existing arrowheads
  gArrows.selectAll(".arrowHead").remove();

  // draw arrows
  arcs.enter().append("path")
    .attr("class", "arrows")
    .attr("stroke", arrowCol)
    .attr("fill", "none")
    .merge(arcs).attr("d", function(d){
      var asylum = projection([d.as_long, d.as_lat]);
      var origin = projection([d.or_long, d.or_lat]);
      return line([[origin[0], origin[1]], [(asylum[0]+origin[0])/2+ Math.floor(Math.random() * 100) - 50, (asylum[1]+origin[1])/2 + Math.floor(Math.random() * 100) - 50], [asylum[0], asylum[1]]]);
    })
    .attr("stroke-linejoin","round")
    .attr("stroke-width", function(d){
      return refugeeScale(d.tot_compl);
    })
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip	.html(d3.format(',')(Math.floor(Math.round(d.tot_compl/100)*100)))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })
    .transition(t).duration(1000)
        .attrTween("stroke-dasharray", function() {
            var len = this.getTotalLength();
            return function(t) {
              return (d3.interpolateString("0," + len, len + ",0"))(t)
            };
        })
    .on("start",function(d, i){
      var len = this.getTotalLength();
      var path = this;
      drawArrowheads(d.tot_compl, len, t, path, i);
    })


  // Exit
  arcs.exit().remove();

}