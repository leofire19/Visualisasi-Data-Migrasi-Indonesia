// Title-Bar
function titleBar(region, year, direction) {
  sumYear = [d3.sum(lines, function(d){
    if (d.year == year) {
      return d.tot_compl;
    }
  }) + d3.sum(pies, function(d){
    if (d.year == year) {
      return d.tot_compl;
    }
  })]

  if (direction == "outflows"){
    sumRegion = [d3.sum(lines, function(d){
      if (d.year == year & d.or_region == region) {
        return d.tot_compl;
      }
    }) + d3.sum(pies, function(d){
      if (d.year == year & d.or_region == region) {
        return d.tot_compl;
      }
    })]
    titleBarTxt1.transition().text("refugees originated from this region.")
  } else if (direction == "inflows"){
    sumRegion = [d3.sum(lines, function(d){
      if (d.year == year & d.as_region == region) {
        return d.tot_compl;
      }
    }) + d3.sum(pies, function(d){
      if (d.year == year & d.as_region == region) {
        return d.tot_compl;
      }
    })]
    titleBarTxt1.transition().text("individuals obtained refugee status in this region.")
  }

  var titleBarScale = d3.scaleLinear()
    .domain([0,sumYear])
    .range([0, 910]);

  titleBarBg = gTitleBar.selectAll(".titleBarBg").data(sumYear);


  titleBarBg.enter().append("rect")
    .attr("width", 920)
    .attr("height", 70)
    .attr("x", 20)
    .attr("y", 0)
    .attr("class", "titleBarBg")
    .style("fill", "white")
    .style("stroke", "#f8ab65")
    .style("stroke-width", 0.5)

  titleBarTxtRegion.transition().text(region.replace(/([a-z])([A-Z])/g, '$1 $2') + " - " + year)

  titleBarTxtNumber.transition(t).text(d3.format(',')(Math.floor(Math.round(sumRegion/100)*100)))

  titleBarTxtPercent.transition().text(d3.format(".2")(100/Math.floor(sumYear)*Math.floor(sumRegion)) + "%")

  titleBarTxt2.transition().text("of global refugee movements in selected year.")

  titleBarChart = gTitleBar.selectAll(".titleBar").data(sumRegion)
  titleBarChartBg = gTitleBar.selectAll(".titleBarChartBg").data(sumRegion)

  titleBarBg.enter().append("rect")
    .attr("width", 910)
    .attr("height", 10)
    .attr("x", 25)
    .attr("y", 5)
    .attr("class", "titleBarChartBg")
    .style("fill", "#f4f4f4")

  titleBarChart.enter().append("rect")
    .attr("height", 10)
    .attr("x", 25)
    .attr("y", 5)
    .attr("class", "titleBar")
    .style("fill", "#f8ab65")
    .merge(titleBarChart)
      .transition()
      .attr("width", titleBarScale(sumRegion))

}