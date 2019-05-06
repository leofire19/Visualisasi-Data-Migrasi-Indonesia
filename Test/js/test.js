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
  .attr("class", "svg_peta")
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
  .scale(1000)
  .rotate([-120, 0])

  
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
d3.queue().defer(d3.json,"data/peta/peta_indo_density.json")
  .defer(d3.csv,"data/statistik/Arus Migrasi/inoutTotal.csv")
  .defer(d3.csv,"data/statistik/Arus Migrasi/top5inTotal.csv")
  .defer(d3.csv,"data/statistik/Arus Migrasi/top5outTotal.csv")
  //.defer(d3.csv,"data/statistik/arusFemale.csv")
  //.defer(d3.csv,"data/statistik/keppen.csv")
  .await(drawMap)
  
      
function drawMap (error,peta,arus,top5in,top5out) {
  var data_peta = topojson.feature(peta, peta.objects.peta_indo_density).features
  // attach data to existing variables
  //pies = bubbles;   
  var color = d3.scaleThreshold()
      .domain([0,50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,12000,10000])
      .range(d3.schemeBlues[9]);

  // var color = d3.scale.threshold()
  //     .domain([10, 12.5, 15, 17.5, 20, 22.5, 25])
  //     .range(["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);
  lines = arus;
  dataMasuk = top5in;
  dataKeluar = top5out;
  gMap.selectAll(".country")
		.data(data_peta)
		.enter().append("path")
    .attr("id", function(d){return d.properties.IDPROV;})
    .attr("class", function(d){return d.properties.IDPROV + "_map";})
    .attr("d",path)
		.attr("stroke", cntrStrokeCol)
    .attr("stroke-width",cntrStrokeWidth)
    .attr("fill", function(d){
      return color(d.properties.X2015);
    })
    .on("mouseover", function(d) { // Animation für mouseover
      d3.select(this).transition()
        .ease(d3.easeLinear)
        .duration("50")
        .attr("stroke", "green")
        .attr("stroke-width",1)
    })
    .on("mouseout", function(d) { //Animation für mousout
      d3.select(this).transition()
        .ease(d3.easeLinear)
        .duration("100")
        .attr("stroke", cntrStrokeCol)
        .attr("stroke-width",cntrStrokeWidth)
    })
    .on("click", function(){
      provinsi = d3.select(this).attr('class').split(' ')[1];
      drawAnimation(provinsi)
    })
  }

// arrows
function arusMigrasi(provinsi, arah){
  
  if (arah == "keluar"){
    data = dataKeluar.filter(function(d){
      if (d.id_lahir == provinsi){
        return d;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      }
    })
  } else if (arah == "masuk"){
    data = dataMasuk.filter(function(d){
      if (d.id_tinggal == provinsi){
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
      var tujuan = projection([d.long_tinggal, d.lat_tinggal]);
      var awal = projection([d.long_lahir, d.lat_lahir]);
      return line([[awal[0], awal[1]], [(tujuan[0]+awal[0])/2+ Math.floor(Math.random() * 100) - 50, (tujuan[1]+awal[1])/2 + Math.floor(Math.random() * 100) - 50], [tujuan[0], tujuan[1]]]);
    })
    .attr("stroke-linejoin","round")
    .attr("stroke-width", function(d){
      return refugeeScale(d.Jumlah_Migrasi);
    })
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip	.html(d3.format(',')(Math.floor(Math.round(d.Jumlah_Migrasi/100)*100)))
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
      drawArrowheads(d.Jumlah_Migrasi, len, t, path, i);
    })
  // Exit
  arcs.exit().remove();
}

// Title-Bar
function titleBar(provinsi, arah) {
  if (arah == "keluar"){
    sumProvinsi = lines.Keluar;
    titleBarTxt1.transition().text("refugees originated from this region.")
  } else if (arah == "masuk"){
    sumProvinsi = lines.Masuk;
    titleBarTxt1.transition().text("individuals obtained refugee status in this region.")
  }

  var titleBarScale = d3.scaleLinear()
    .domain([0,sumProvinsi])
    .range([0, 910]);

  titleBarBg = gTitleBar.selectAll(".titleBarBg");

  titleBarBg.enter().append("rect")
    .attr("width", 920)
    .attr("height", 70)
    .attr("x", 20)
    .attr("y", 0)
    .attr("class", "titleBarBg")
    .style("fill", "white")
    .style("stroke", "#f8ab65")
    .style("stroke-width", 0.5)

  titleBarTxtRegion.transition().text(provinsi.replace(/([a-z])([A-Z])/g, '$1 $2') + " - " )

  titleBarTxtNumber.transition(t).text(d3.format(',')(Math.floor(Math.round(sumProvinsi/100)*100)))

  //titleBarTxtPercent.transition().text(d3.format(".2")(100/Math.floor(sumYear)*Math.floor(sumRegion)) + "%")

  //titleBarTxt2.transition().text("of global refugee movements in selected year.")

  titleBarChart = gTitleBar.selectAll(".titleBar").data(sumProvinsi)
  titleBarChartBg = gTitleBar.selectAll(".titleBarChartBg").data(sumProvinsi)

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
      .attr("width", titleBarScale(sumProvinsi))

}


// Pie Chart
// function pieChart(provinsi,arah) {

//   var radius = 50;

//   // filter data on direction
//   if (direction == "outflows"){
//     outerData = lines.filter(function(d){
//       if (d.or_region == region ) {
//         return d;
//       }
//     })
//     innerData = pies.filter(function(d){
//       if (d.or_region == region) {
//         return d;
//       }
//     })
//   } else if (direction == "inflows"){
//     outerData = lines.filter(function(d){
//       if (d.as_region == region) {
//         return d;
//       }
//     })
//     innerData = pies.filter(function(d){
//       if (d.as_region == region) {
//         return d;
//       }
//     })
//   }

//   // summarize data
//   var outerSingle = d3.nest()
//     .rollup(function(d) {
//         return d3.sum(d, function(g) {return g.tot_compl; });
//      }).entries(outerData);

//  if (innerData[0]) {
//    var innerSingle = innerData[0]["tot_compl"]
//  } else {
//    var innerSingle = 0;
//  }


//   var pieData = [+outerSingle,+innerSingle]

//   // attach colors
//   var pieColor = d3.scaleOrdinal()
//    .range([pieExtCol,pieIntCol]);

//   var pie = d3.pie()
//   .value(function(d) { return d})
//   .sort(null);

//   var arc = d3.arc()
//     .outerRadius(radius - 10)
//      .innerRadius(0);

//   var labelArc = d3.arc()
//     .outerRadius(radius - 4)
//     .innerRadius(radius - 4);

//   gPie.selectAll("path").remove();

//   var piePath = gPie.selectAll("path")
//     .data(pie(pieData)).enter()
//      .append("path")

//   piePath.attr("d", arc)
//     .style("fill", function(d) { return pieColor(d.data);})

//   pieLabel1.transition()
//     .text("within region");

//   pieLabel2.transition()
//     .text("across regions");


//   pieLabel3.transition()
//     .text(function(){
//       if (pieData[1] == 0){
//         return "0%";
//       } else {
//         return f(1 / (pieData[0]+pieData[1]) * pieData[1]);
//       }
//     });

//   pieLabel4.transition()
//     .text(function(){
//       if (pieData[0] == 0){
//         return "0%";
//       } else {
//         return f(1 / (pieData[0]+pieData[1]) * pieData[0]);
//       }
//     });

// }

// draw arrowheads
function drawArrowheads(Jumlah_Migrasi, len, t, path, i){

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
          return "translate(" + pointAtLength(pos, path) + ") rotate( " + angleAtLength(pos, path) + ") scale(" + linearScale(Jumlah_Migrasi) + ")";
        };
      })

}

// draw barchart
function barChartTop5(provinsi,arah){

  if (arah == "masuk"){
    d3.csv("data/statistik/Arus Migrasi/top5inTotal.csv", type, render);
    yColumn = "Asal";
    barchartCaption.transition(t).text("Daerah Tujuan")
  } else if (arah == "keluar"){
    d3.csv("data/statistik/Arus Migrasi/top5outTotal.csv", type, render);
    yColumn = "Tujuan";
    barchartCaption.transition(t).text("Daerah Asal")
  }

  function render(data){

    // filter data
    if (arah == "masuk"){
      data = data.filter(function(d){
        if (d.kd_tinggal == provinsi){
          return d;
        }
      })
    } else if (arah == "keluar"){
      data = data.filter(function(d){
        if (d.kd_lahir == provinsi){
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
          if (d.kd_tinggal == d.kd_lahir){
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
          tooltip.html(d3.format(',')(Math.floor(Math.round(d.Jumlah_Migrasi/100)*100)))
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
    d.Jumlah_Migrasi = +d.Jumlah_Migrasi;
    return d;
  }

}

function drawAnimation(provinsi){

  // get chosen mode
  if (d3.select('#to').classed("btn-clicked")){
    var arah = "masuk";
  } else if(d3.select('#from').classed("btn-clicked")) {
    var arah = "keluar";
  }
  
  d3.selectAll(".country").classed("cntrClicked", false);
  d3.selectAll("."+provinsi).classed("cntrClicked", true);

  arusMigrasi(provinsi,arah);
  //pieChart(provinsi,arah)
  //barChartTop5(provinsi, arah)
  //titleBar(provinsi, arah)


}


d3.select('#to').on("click", function(){
  $('#from').removeClass("btn-clicked");
  $(this).addClass("btn-clicked");
  if (!d3.select(".cntrClicked").empty()){
    drawAnimation(provinsi);
  }
});

d3.select('#from').on("click", function(){
  $('#to').removeClass("btn-clicked");
  $(this).addClass("btn-clicked");
  if (!d3.select(".cntrClicked").empty()){
    drawAnimation(provinsi);
  }
});
