// Pie Chart
function pieChart(region, year, direction) {

  var radius = 50;

  // filter data on direction
  if (direction == "outflows"){
    outerData = lines.filter(function(d){
      if (d.or_region == region & d.year == year) {
        return d;
      }
    })
    innerData = pies.filter(function(d){
      if (d.or_region == region & d.year == year) {
        return d;
      }
    })
  } else if (direction == "inflows"){
    outerData = lines.filter(function(d){
      if (d.as_region == region & d.year == year) {
        return d;
      }
    })
    innerData = pies.filter(function(d){
      if (d.as_region == region & d.year == year) {
        return d;
      }
    })
  }

  // summarize data
  var outerSingle = d3.nest()
    .rollup(function(d) {
        return d3.sum(d, function(g) {return g.tot_compl; });
     }).entries(outerData);

 if (innerData[0]) {
   var innerSingle = innerData[0]["tot_compl"]
 } else {
   var innerSingle = 0;
 }


  var pieData = [+outerSingle,+innerSingle]

  // attach colors
  var pieColor = d3.scaleOrdinal()
   .range([pieExtCol,pieIntCol]);

  var pie = d3.pie()
  .value(function(d) { return d})
  .sort(null);

  var arc = d3.arc()
    .outerRadius(radius - 10)
     .innerRadius(0);

  var labelArc = d3.arc()
    .outerRadius(radius - 4)
    .innerRadius(radius - 4);

  gPie.selectAll("path").remove();

  var piePath = gPie.selectAll("path")
    .data(pie(pieData)).enter()
     .append("path")

  piePath.attr("d", arc)
    .style("fill", function(d) { return pieColor(d.data);})

  pieLabel1.transition()
    .text("within region");

  pieLabel2.transition()
    .text("across regions");


  pieLabel3.transition()
    .text(function(){
      if (pieData[1] == 0){
        return "0%";
      } else {
        return f(1 / (pieData[0]+pieData[1]) * pieData[1]);
      }
    });

  pieLabel4.transition()
    .text(function(){
      if (pieData[0] == 0){
        return "0%";
      } else {
        return f(1 / (pieData[0]+pieData[1]) * pieData[0]);
      }
    });



}