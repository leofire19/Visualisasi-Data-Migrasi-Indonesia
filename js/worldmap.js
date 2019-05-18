// size of svg
var width = 960,
    height = 500;

// define colors
var cntrCol = "#d0d0d0",
    cntrHoverCol = "#555555",
    cntrStrokeCol = "white",
    barColor = "rgba(248, 171, 101, 0.7)",
    sliderLineCol = "#d0d0d0",
    sliderHandleCol = "#f8ab65",
    arrowCol = "#f8ab65",
    arrowHeadCol = "#f8ab65",
    pieExtCol = "#f8ab65",
    pieIntCol = "#555555",
    titlebarCol = "#f8ab65",
    titlebarBgCol = "#f2f2f2";


// define fonts
var barFont = "Droid Sans",
    barFontSize = "11px";

var sliderFont = "Droid Sans",
    sliderSize = 8,
    sliderFontSize = "17px",
    sliderFontColor= "#555555";

var barchartFontColor = "#555555",
    barchartFont = "Droid Sans",
    barchartFontSize = "20px";

var pieTextFontColor = "#555555",
    pieFont = "Droid Sans",
    pieTextFontSize = "10px",
    pieFontColor = "#555555",
    pieFontSize = "25px";


// starting year
var selectedYear = 1990,
    region;

// additional variables
var cntrStrokeWidth = 0.3,
    lowerBound = 100;

// barchart variables
var barWidth = 210,
    barHeight = 120,
    barPadding = 0.2;

// initialize variables for data
var pies,
    lines;

// initialize tooltip
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


// create svg
var svg = d3.select("#worldmap")
  .append("svg")
  .attr("class", "svg_worldmap")
  .attr("viewBox", "0 0 " + width + " " + height )
  .attr("preserveAspectRatio", "xMidYMid meet");


// create groups for elements
var gMap = svg.append("g");
var gArrows = svg.append("g");
var gSlider = svg.append("g");
var gPie = svg.append("g")
   .attr("transform", "translate(900,230)");
var gBar = svg.append("g")
  .attr("transform", "translate(5, 350)");
var gTitleBar = svg.append("g");
var gTitleBarTxt = svg.append("g");

// create text-elements
var titleBarTxtRegion = gTitleBarTxt.append("text")
  .attr("x", 50)
  .attr("y", 50)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "30px");

var titleBarTxtNumber = gTitleBarTxt.append("text")
  .attr("x", 450)
  .attr("y", 50)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "40px");

var titleBarTxt1 = gTitleBarTxt.append("text")
  .attr("x", 450)
  .attr("y", 65)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "10px");

var titleBarTxtPercent = gTitleBarTxt.append("text")
  .attr("x", 700)
  .attr("y", 50)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "40px");

var titleBarTxt2 = gTitleBarTxt.append("text")
  .attr("x", 700)
  .attr("y", 65)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "10px");

// create groups for barchart
var rectG = gBar.append("g");
var xAxisG = gBar.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + barHeight + ")");
var yAxisG = gBar.append("g")
  .attr("class", "y axis");
var barchartCaption = svg.append("text")
  .attr("x", 3)
  .attr("y", 335)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", barchartFontSize);


// text-elements for barchart
var pieLabel1 = svg.append("text")
  .attr("x", 875)
  .attr("y", 350)
  .attr("fill", pieTextFontColor)
  .attr("font-family", pieFont)
  .attr("font-size", pieTextFontSize);

var pieLabel2 = svg.append("text")
  .attr("x", 875)
  .attr("y", 315)
  .attr("fill", pieTextFontColor)
  .attr("font-family", pieFont)
  .attr("font-size", pieTextFontSize);

var pieLabel3 = svg.append("text")
  .attr("x", 875)
  .attr("y", 340)
  .attr("fill", pieFontColor)
  .attr("font-family", pieFont)
  .attr("font-size", pieFontSize);

var pieLabel4 = svg.append("text")
  .attr("x", 875)
  .attr("y", 305)
  .attr("fill", pieFontColor)
  .attr("font-family", pieFont)
  .attr("font-size", pieFontSize);



// initialize variables
var xColumn = "tot_compl",
    yColumn;


//create scales
var xScale = d3.scaleLinear()
.range(      [0,barWidth]);
var yScale = d3.scaleBand()
.range([0,barHeight])
.padding(barPadding);

var xAxis = d3.axisBottom(xScale)
  .ticks(2)
  .tickSizeOuter(0);

var yAxis = d3.axisRight(yScale)
  .ticks(0)
  .tickSizeOuter(0);

// function to calculate percentages
var p = Math.max(0, d3.precisionFixed(0.05) - 2),
    f = d3.format("." + p + "%");



// define projection
var projection = d3.geoMercator()
  .translate([width / 2, height / 1.5]) // Zentrieren
  .scale(140)

// create path
var path = d3.geoPath()
  .projection(projection)

// initialize arrows
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

//create scales
var linearScale = d3.scaleLog()
    .domain([lowerBound,1000000])
    .range([0.2,1]);

var refugeeScale = d3.scaleLog()
  .domain([lowerBound,320000])
  .range([0.2, 10])

var sliderScale = d3.scaleLinear()
  .domain([0,280])
  .range([1990, 2013])
  .interpolate(d3.interpolateRound);

// load data, then draw map
d3.queue().defer(d3.json, "data/peta/indonesia.topojson")
  .defer(d3.csv, "data/statistik/maleTrans.csv")
  .defer(d3.csv, "data/femaleTrans.csv")
  .defer(d3.csv, "data/rasio_JenisKelamin.csv.csv")
  .await(drawMap)

// draw base map
function drawMap (error, data, iso3, arrows, bubbles) {
  var countries = topojson.feature(data, data.objects.world).features

  // attach data to existing variables
  pies = bubbles;
  lines = arrows;

  // draw map
  gMap.selectAll(".country")
    .data(countries)
    .enter().append("path")
    .attr("class", function(d, i){ return "country " + iso3[i]['region'] })
    .attr("id", function(d){ return d.id; }) // Ländername als id
    .attr("name", function(d){ return d.properties.name; })
    .attr("fill", cntrCol)
    .attr("stroke", cntrStrokeCol)
    .attr("stroke-width", cntrStrokeWidth)
    .attr("d", path)
    .on("mouseover", function(d,i) { // Animation für mouseover
      d3.selectAll("."+iso3[i]['region']).transition()
        .ease(d3.easeLinear)
        .duration("50")
        .attr("fill", cntrHoverCol);
    })
    .on("mouseout", function(d,i) { //Animation für mousout
      d3.selectAll("."+iso3[i]['region']).transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("fill", cntrCol);
    })
    .on("click", function(){
        //Kontinent bestimmen
        region = d3.select(this).attr('class').split(' ')[1];
        // Jahr bestimmen
        var year = selectedYear;


        drawAnimation(region, year)

    })

    //drawSlider();

}

// functions


// // Slider
// function drawSlider(){
//   var drag = d3.drag()
//     //.origin(Object)
//     .on("drag", dragMove)
//     .on('end', dragEnd);

//   var g = gSlider.selectAll('g')
//       .data([{x: 0, y : 20}])
//       .enter()
//         .append('g')
//         .attr("height", 10)
//         .attr("widht", 400)
//         .attr('transform', 'translate(450, 460)');

//   var rect = g.append('rect')
//     .attr('y', 19)
//     .attr("height", 2)
//     .attr("width", 280)
//     .attr('fill', sliderLineCol)
//     .on('click', function(d){
//       selectedYear = sliderScale(d3.mouse(this)[0]);
//       sliderHandle.attr("cx", d.x = d3.mouse(this)[0]);
//       sliderYear.attr("x", d.x = d3.mouse(this)[0]-19)
//           .text(selectedYear)
//       dragEnd();
//     });

//   // add minus-button
//   sliderLeft = g.append("text")
//     .attr("x", 292)
//     .attr("y", 26)
//     .text("<<")
//     .attr("fill", sliderLineCol)
//     .attr("font-family", sliderFont)
//     .attr("font-size", sliderFontSize);
//   sliderBoxLeft = g.append("rect")
//     .attr("x", 292)
//     .attr("y", 10)
//     .attr("height", 20)
//     .attr("width", 20)
//     .attr("fill", "none")
//     .attr('pointer-events', 'all')
//     .attr("opacity", 0)
//     .on("mouseover", function() {
//         sliderLeft.attr("fill", sliderHandleCol);
//         })
//     .on("mouseout", function() {
//       sliderLeft.transition()
//           .duration(200)
//           .attr("fill", sliderLineCol);
//         })
//     .on("click", function() {
//           if (selectedYear > 1990){
//             selectedYear = selectedYear - 1
//             sliderHandle.attr("cx", sliderScale.invert(selectedYear));
//             sliderYear.attr("x", sliderScale.invert(selectedYear)-19)
//                 .text(selectedYear)
//             dragEnd();
//           }
//         });

//   // add plus-button
//   sliderRight = g.append("text")
//     .attr("x", 320)
//     .attr("y", 26)
//     .text(">>")
//     .attr("fill", sliderLineCol)
//     .attr("font-family", sliderFont)
//     .attr("font-size", sliderFontSize);

//   sliderBoxRight = g.append("rect")
//     .attr("x", 320)
//     .attr("y", 10)
//     .attr("height", 20)
//     .attr("width", 20)
//     .attr("fill", "none")
//     .attr('pointer-events', 'all')
//     .attr('opacity', 0)
//     .on("mouseover", function() {
//         sliderRight.attr("fill", sliderHandleCol);
//         })
//     .on("mouseout", function() {
//       sliderRight.transition()
//           .attr("fill", sliderLineCol);
//         })
//     .on("click", function() {
//           if (selectedYear < 2013){
//             selectedYear = selectedYear + 1
//             sliderHandle.attr("cx", sliderScale.invert(selectedYear));
//             sliderYear.attr("x", sliderScale.invert(selectedYear)-19)
//                 .text(selectedYear)
//             dragEnd();
//           }
//         });


//   // add slider
//   sliderHandle = g.append("circle")
//     .attr("r", sliderSize)
//     .attr("cx", function(d) { return d.x; })
//     .attr("cy", function(d) { return d.y; })
//     .attr("fill", sliderHandleCol)
//     .call(drag);

//   sliderYear = g.append("text")
//     .attr("x", function(d) { return d.x-19; })
//     .attr("y", function(d) { return d.y-13; })
//     .text(selectedYear)
//     .attr("fill", sliderFontColor)
//     .attr("font-family", sliderFont)
//     .attr("font-size", sliderFontSize);

//   function dragMove(d) {
//     selectedYear = sliderScale(Math.max(0, Math.min(280, d3.mouse(this)[0])));
//     d3.select(this)
//         .attr("opacity", 0.6)
//         .attr("cx", d.x = Math.max(0, Math.min(280, d3.mouse(this)[0])))
//         .attr("cy", d.y = 20);
//     sliderYear.attr("x", d.x = Math.max(0, Math.min(280, d3.mouse(this)[0]))-19)
//         .text(selectedYear)
//   }

//   function dragEnd() {
//     sliderHandle.attr('opacity', 1)
//     if (!d3.select(".cntrClicked").empty()){
//       drawAnimation(region, selectedYear);
//     }

//   }
// }

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

// draw arrowheads
function drawArrowheads(tot_compl, len, t, path, i){

  var arrowHeads = gArrows.selectAll(".arrowHead:nth-child(" + i + ")").data(data);

  // create arrowhead
  arrowHeads.enter().append("path")
    .attr("class", "arrowHead")
    .attr("fill", arrowHeadCol)
    .attr("d", "M-5,0 L-15,15 L15,0 L-15,-15 Z")
    .merge(arrowHeads)
    .transition(t).duration(1000)
      .attrTween("transform",function(d){
        return function(t) {
          var pos = t * len;
          return "translate(" + pointAtLength(pos, path) + ") rotate( " + angleAtLength(pos, path) + ") scale(" + linearScale(tot_compl) + ")";
        };
      })

}

// draw barchart
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




// });
