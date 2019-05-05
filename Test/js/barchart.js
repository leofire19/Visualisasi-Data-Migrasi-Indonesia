function barChartTop5(year, region, direction){

  if (direction == "inflows"){
    d3.csv("assets/data/top5to_region.csv", type, render);
    yColumn = "origin";
    barchartCaption.transition(t).text("Top Origin Countries")
  } else if (direction == "outflows"){
    d3.csv("assets/data/top5from_region.csv", type, render);
    yColumn = "asylum";
    barchartCaption.transition(t).text("Top Asylum Countries")
  }


  function render(data){

    // filter data
    if (direction == "inflows"){
      data = data.filter(function(d){
        if (d.as_region == region & d.year == year){
          return d;
        }
      })
    } else if (direction == "outflows"){
      data = data.filter(function(d){
        if (d.or_region == region & d.year == year){
          return d;
        }
      })
    }



    // create scale
    xScale.domain([0, d3.max(data, function (d){ return Math.floor(Math.round(d[xColumn]/100)*100)})]);
    // yScale.domain(data.map(function (d){
    //     return d[yColumn];
    //   })
    // );


    xAxisG.transition().duration(300).call(xAxis);
    yAxisG.transition().duration(300).call(yAxis);

    var bars = rectG.selectAll("rect").data(data);
    var barTexts = yAxisG.selectAll("text").data(data)
    bars.enter()
    .append("rect")
      .attr("x", 0)
      .attr("y",     function (d, i){ return 4.6153 + i * (4.6153 + 18.46); })
      .attr("font-family", barFont)
      .attr("font-size", barFontSize)
      .merge(bars)
        .attr("fill", function(d){
          if (d.as_region == d.or_region){
            return "rgb(208, 208, 208)";
          } else {
            return barColor;
          }
        }).transition().delay(300)
          .attr("y",     function (d, i){
            return 4.6153 + i * (4.6153 + 18.46) })
          .attr("width", function (d){ return xScale(Math.floor(Math.round(d[xColumn]/100)*100)); })
          .attr("height", 18.46)

      barTexts.enter()
          .append("text")
          .attr("x", 3)
          .attr("y", function (d, i){ return 18.6153 + i * (4.6153 + 18.46); })
          .attr("fill", "black")
          .attr("font-family", barchartFont)
          .attr("font-size", "11px")
          .merge(barTexts)
            .transition().delay(300)
            .attr("y", function (d, i){ return 18.6153 + i * (4.6153 + 18.46); })
            .text(function(d){
              return d[yColumn];
            });


    bars.on("mouseover", function(d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(d3.format(',')(Math.floor(Math.round(d.tot_compl/100)*100)))
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          })

    bars.exit()
      .transition().duration(300)
        .attr("width", "0")
        .transition().delay(300)
          .remove();

    barTexts.exit()
      .transition().duration(300)
        .remove();

  }

  function type(d){
    d.tot_compl = +d.tot_compl;
    return d;
  }



}