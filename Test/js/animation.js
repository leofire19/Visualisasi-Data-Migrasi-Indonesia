// calculate path
function pointAtLength(l, path) {
  var xy = path.getPointAtLength(l);
  return [xy.x, xy.y];
}


// calculate angle
function angleAtLength(l, path) {
  var a = pointAtLength(Math.max(l - 0.01,0), path),
      b = pointAtLength(l + 0.01, path);
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
}

function drawAnimation(region, year){

  // get chosen mode
  if (d3.select('#to').classed("btn-clicked")){
    var direction = "inflows";
  } else if(d3.select('#from').classed("btn-clicked")) {
    var direction = "outflows";
  }
  d3.selectAll(".country").classed("cntrClicked", false);
  d3.selectAll("."+region).classed("cntrClicked", true);

  interContinental(region, year, direction);
  pieChart(region, year, direction)
  barChartTop5(year, region, direction)
  titleBar(region, year, direction)


}


// Handling FROM and TO Button
d3.select('#to').on("click", function(){
  $('#from').removeClass("btn-clicked");
  $(this).addClass("btn-clicked");
  if (!d3.select(".cntrClicked").empty()){
    drawAnimation(region, selectedYear);
  }
});

d3.select('#from').on("click", function(){
  $('#to').removeClass("btn-clicked");
  $(this).addClass("btn-clicked");
  if (!d3.select(".cntrClicked").empty()){
    drawAnimation(region, selectedYear);
  }
});