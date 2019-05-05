function drawSlider(){
  var drag = d3.drag()
    //.origin(Object)
    .on("drag", dragMove)
    .on('end', dragEnd);

  var g = gSlider.selectAll('g')
      .data([{x: 0, y : 20}])
      .enter()
        .append('g')
        .attr("height", 10)
        .attr("widht", 400)
        .attr('transform', 'translate(450, 460)');

  var rect = g.append('rect')
    .attr('y', 19)
    .attr("height", 2)
    .attr("width", 280)
    .attr('fill', sliderLineCol)
    .on('click', function(d){
      selectedYear = sliderScale(d3.mouse(this)[0]);
      sliderHandle.attr("cx", d.x = d3.mouse(this)[0]);
      sliderYear.attr("x", d.x = d3.mouse(this)[0]-19)
          .text(selectedYear)
      dragEnd();
    });

  // add minus-button
  sliderLeft = g.append("text")
    .attr("x", 292)
    .attr("y", 26)
    .text("<<")
    .attr("fill", sliderLineCol)
    .attr("font-family", sliderFont)
    .attr("font-size", sliderFontSize);
  sliderBoxLeft = g.append("rect")
    .attr("x", 292)
    .attr("y", 10)
    .attr("height", 20)
    .attr("width", 20)
    .attr("fill", "none")
    .attr('pointer-events', 'all')
    .attr("opacity", 0)
    .on("mouseover", function() {
        sliderLeft.attr("fill", sliderHandleCol);
        })
    .on("mouseout", function() {
      sliderLeft.transition()
          .duration(200)
          .attr("fill", sliderLineCol);
        })
    .on("click", function() {
          if (selectedYear > 1990){
            selectedYear = selectedYear - 1
            sliderHandle.attr("cx", sliderScale.invert(selectedYear));
            sliderYear.attr("x", sliderScale.invert(selectedYear)-19)
                .text(selectedYear)
            dragEnd();
          }
        });

  // add plus-button
  sliderRight = g.append("text")
    .attr("x", 320)
    .attr("y", 26)
    .text(">>")
    .attr("fill", sliderLineCol)
    .attr("font-family", sliderFont)
    .attr("font-size", sliderFontSize);

  sliderBoxRight = g.append("rect")
    .attr("x", 320)
    .attr("y", 10)
    .attr("height", 20)
    .attr("width", 20)
    .attr("fill", "none")
    .attr('pointer-events', 'all')
    .attr('opacity', 0)
    .on("mouseover", function() {
        sliderRight.attr("fill", sliderHandleCol);
        })
    .on("mouseout", function() {
      sliderRight.transition()
          .attr("fill", sliderLineCol);
        })
    .on("click", function() {
          if (selectedYear < 2013){
            selectedYear = selectedYear + 1
            sliderHandle.attr("cx", sliderScale.invert(selectedYear));
            sliderYear.attr("x", sliderScale.invert(selectedYear)-19)
                .text(selectedYear)
            dragEnd();
          }
        });


  // add slider
  sliderHandle = g.append("circle")
    .attr("r", sliderSize)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("fill", sliderHandleCol)
    .call(drag);

  sliderYear = g.append("text")
    .attr("x", function(d) { return d.x-19; })
    .attr("y", function(d) { return d.y-13; })
    .text(selectedYear)
    .attr("fill", sliderFontColor)
    .attr("font-family", sliderFont)
    .attr("font-size", sliderFontSize);

  function dragMove(d) {
    selectedYear = sliderScale(Math.max(0, Math.min(280, d3.mouse(this)[0])));
    d3.select(this)
        .attr("opacity", 0.6)
        .attr("cx", d.x = Math.max(0, Math.min(280, d3.mouse(this)[0])))
        .attr("cy", d.y = 20);
    sliderYear.attr("x", d.x = Math.max(0, Math.min(280, d3.mouse(this)[0]))-19)
        .text(selectedYear)
  }

  function dragEnd() {
    sliderHandle.attr('opacity', 1)
    if (!d3.select(".cntrClicked").empty()){
      drawAnimation(region, selectedYear);
    }

  }
}