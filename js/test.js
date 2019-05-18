// size of svg
var width = 960,
    height = 600,
    centered;

// define colors
var cntrCol = "#d0d0d0",
    cntrStrokeCol = "white",
    barColor = "rgba(248, 171, 101, 0.7)",
    arrowCol = "#f8ab65",
    arrowHeadCol = "#f8ab65",
    pieExtCol = "#2196f3",
    pieIntCol = "#ff4081",
    titlebarCol = "#f8ab65",
    titlebarBgCol = "#f2f2f2";



// define fonts
var barFont = "Droid Sans",
    barFontSize = "11px";


var barchartFontColor = "#555555",
    barchartFont = "Droid Sans",
    barchartFontSize = "20px";

var pieTextFontColor = "#555555",
    pieFont = "Droid Sans",
    pieTextFontSize = "10px",
    pieFontColor = "#555555",
    pieFontSize = "25px";

// additional variables
var cntrStrokeWidth = 0.3,
    lowerBound = 100;

// barchart variables
var barWidth = 210,
    barHeight = 120,
    barPadding = 0.2;

// initialize tooltip
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


// create svg
var svg = d3.select("#peta-indo")
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
  .attr("x", 350)
  .attr("y", 50)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "40px");

var titleBarTxt1 = gTitleBarTxt.append("text")
  .attr("x", 350)
  .attr("y", 70)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "10px");

var titleBarTxtPercent = gTitleBarTxt.append("text")
  .attr("x", 600)
  .attr("y", 50)
  .attr("fill", barchartFontColor)
  .attr("font-family", barchartFont)
  .attr("font-size", "40px");

var titleBarTxt2 = gTitleBarTxt.append("text")
  .attr("x", 600)
  .attr("y", 70)
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
  .translate([width / 2, height / 2.25])
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
  .domain([1000,1593650])
  .range([0.2, 10])

// load data, then draw map
d3.queue().defer(d3.json,"data/peta/peta_prov_dens.json")
  .defer(d3.csv,"data/statistik/Arus Migrasi/DataTop5Migrasi.csv")
  .defer(d3.csv,"data/statistik/Arus Migrasi/DataInOut.csv")
  .await(drawMap)

  var colorMap = d3.scaleThreshold()
      .domain([0,50,250,400])
      .range(d3.schemeBlues[5]);
  var colorMapSelected = d3.scaleThreshold()
      .domain([0,50,250,400])
      .range(d3.schemeGreens[5]);



function drawMap (error,peta,arus,total) {
  var data_peta = topojson.feature(peta, peta.objects.peta_prov_dens).features
  lines = arus;
  Total_migrasi = total;
  gMap.selectAll(".provinsi")
		.data(data_peta)
    .enter().append("path")
    .attr("class", function(d){return d.properties.kode+" provinsi";})
    .attr("id", function(d){return d.properties.kode;})
    .attr("stroke", cntrStrokeCol)
    .attr("stroke-width",cntrStrokeWidth)
    .attr("fill", function(d){
      return colorMap(d.properties.X2015);
    })
    .attr("d",path)
    .on("mouseover", function(d) { // Animation für mouseover
      d3.select(this).transition()
        .ease(d3.easeLinear)
        .duration("50")
        .attr("stroke", "green")
        .attr("stroke-width",1)
      tooltip.transition()
        .duration(50)
        .style("opacity", .9);
      tooltip.text(d.properties.PROVINSI)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) { //Animation für mousout
      d3.select(this).transition()
        .ease(d3.easeLinear)
        .duration("100")
        .attr("stroke", cntrStrokeCol)
        .attr("stroke-width",cntrStrokeWidth)
    })
    .on("click", function(){
        d3.selectAll('path').style('fill',null)
        d3.select(this).style("fill",function(d){
          return colorMapSelected(d.properties.X2015);})
      provinsi = d3.select(this).attr('class').split(' ')[0];
      drawAnimation(provinsi)
    })
    .on("dblclick",dblclicked_)


	var legend = gMap.append("g")
		.attr("id", "legend");

  var legendText = ["0-50", "51-250", "250-400", ">400"];
  var legendTextCol=["#BFD6E6","#65A9D3","#4178A4","#034C97"];

  var legenditem = legend.selectAll(".legenditem")
  		.data(d3.range(4))
  		.enter()
  		.append("g")
  		.attr("class", "legenditem")
  		.attr("transform", function(d, i) { return "translate(" + i * 31 + ",0)"; });

  legenditem.append("rect")
		.attr("x", 675)
		.attr("y", 450)
		.attr("width", 30)
		.attr("height", 6)
		.attr("class", "rect")
		.style("fill", function(d, i) { return legendTextCol[i]; });

	legenditem.append("text")
		.attr("x", 690)
		.attr("y", 445)
		.style("text-anchor", "middle")
		.text(function(d, i) { return legendText[i]; })

    .attr("font-size", 7);

  var legendTitle = legend.append("text")
      .attr("class", "caption")
      .attr("x", 675)
      .attr("y", 470)
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .text("Tingkat Kepadatan Penduduk (Penduduk/km2)")
      .attr("font-size", 7);

  }



// arrows
function arusMigrasi(provinsi, arah,jk){
  if (arah == "keluar"){
    data = lines.filter(function(d){
      if (d.kode_lahir == provinsi & d.jenis_data==arah & d.jenis_jkdata==jk){
        return d;
      }
    })
  } else if (arah == "masuk"){
    data = lines.filter(function(d){
      if (d.kode_tinggal == provinsi & d.jenis_data==arah& d.jenis_jkdata==jk){
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


// Title-Bar
function titleBar(provinsi, arah,jk) {

  namaProvinsi = Total_migrasi.filter(function(d){
    if (d.jenis_jkdata == jk & d.kode_prov==provinsi) {
      return d.prov;
    }
  });
  sumPendudukProv = Total_migrasi.filter(function(d){
    if (d.jenis_jkdata == jk & d.kode_prov==provinsi) {
      return d.X2015;
    }
  })[0].X2015;
  if (arah == "keluar"){
    sumProvinsi = Total_migrasi.filter(function(d){
      if (d.jenis_jkdata == jk & d.kode_prov==provinsi) {
        return d.keluar;
      }
    })[0].keluar;
    titleBarTxt1.transition().text("Penduduk "+jk+" \nmigrasi keluar seumur hidup")
  } else if (arah == "masuk"){
    sumProvinsi = Total_migrasi.filter(function(d){
      if (d.jenis_jkdata == jk & d.kode_prov==provinsi) {
        return d.masuk;
      }
    })[0].masuk;
    titleBarTxt1.transition().text("Penduduk "+jk+" \nmigrasi masuk seumur hidup")
  }

  var titleBarScale = d3.scaleLinear()
    .domain([0,sumPendudukProv])
    .range([0, 910]);

  titleBarBg = gTitleBar.selectAll(".titleBarBg").data(sumPendudukProv);

  titleBarBg.enter().append("rect")
    .attr("width", 920)
    .attr("height", 80)
    .attr("x", 20)
    .attr("y", 0)
    .attr("class", "titleBarBg")
    .style("fill", "white")
    .style("stroke", "#f8ab65")
    .style("stroke-width", 0.5)

  titleBarTxtRegion.transition().text(namaProvinsi[0].prov)

  titleBarTxtNumber.transition(t).text(d3.format(',')(Math.floor(Math.round(sumProvinsi/100)*100)))

  titleBarTxtPercent.transition().text(d3.format(".2")((sumProvinsi/sumPendudukProv)) + "%")

  titleBarTxt2.transition().text("dari total jumlah penduduk provinsi.")

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
    .attr("width", 910)
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
function pieChart(provinsi,arah,jk) {

  var radius = 50;

  // filter data on direction
  if (arah == "masuk"){
    lakiLaki = Total_migrasi.filter(function(d){
      if (d.kode_prov == provinsi & d.jenis_jkdata=="Male") {
        return d.masuk;
      }
    })[0].masuk;
    perempuan = Total_migrasi.filter(function(d){
      if (d.kode_prov == provinsi & d.jenis_jkdata=="Female") {
        return d.masuk;
      }[0].masuk;
    })
  } else if (arah == "keluar"){
    lakiLaki = Total_migrasi.filter(function(d){
      if (d.kode_prov == provinsi & d.jenis_jkdata=="Male") {
        return d.keluar;
      }
    })[0].keluar;
    perempuan = Total_migrasi.filter(function(d){
      if (d.kode_prov == provinsi & d.jenis_jkdata=="Female") {
        return d.keluar;
      }
  })[0].keluar;
}



  var pieData = [+lakiLaki,+perempuan]

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
    .text("lakiLaki");

  pieLabel2.transition()
    .text("Perempuan");


  pieLabel3.transition()
    .text(function(){
      if (pieData[1] == 0){
        return "0%";
      } else {
        return f(1 / (pieData[0]+pieData[1]) * pieData[0]);
      }
    });

  pieLabel4.transition()
    .text(function(){
      if (pieData[0] == 0){
        return "0%";
      } else {
        return f(1 / (pieData[0]+pieData[1]) * pieData[1]);
      }
    });

}

// draw barchart
function barChartTop5(provinsi,arah,jk){
  var jk="Gabungan";
  if (arah == "keluar"){
    data = lines.filter(function(d){
      if (d.kode_lahir == provinsi & d.jenis_data==arah & d.jenis_jkdata==jk){
        return d;
      }
    })
    data_sort=data.sort(function(a, b) {
      return d3.descending(a.Jumlah_Migrasi, b.Jumlah_Migrasi)
    });
    yColumn = "prov_tinggal";
    tampilBarChart(data_sort,yColumn);
    barchartCaption.transition(t).text("Daerah Tujuan")
  } else if (arah == "masuk"){
    data = lines.filter(function(d){
      if (d.kode_tinggal == provinsi & d.jenis_data==arah& d.jenis_jkdata==jk){
        return d;
      }
    })
    data_sort=data.sort(function(a, b) {
      return d3.descending(a.Jumlah_Migrasi, b.Jumlah_Migrasi)
    });
    yColumn = "prov_lahir";
    tampilBarChart(data_sort,yColumn);
    barchartCaption.transition(t).text("Daerah Asal")
  }
}

function tampilBarChart(data,yColumn){
    xScale.domain([0, d3.max(data, function (d){
      return Math.floor(Math.round(d.Jumlah_Migrasi/100)*100)})]);
    // yScale.domain(data.map(function (d){
    //     return d[yColumn];
    //   })
    // );


    xAxisG.transition().duration(300).call(xAxis);
    yAxisG.transition().duration(300).call(yAxis);

    var bars = rectG.selectAll("rect")
                    .data(data);
    var barTexts = yAxisG.selectAll("text").data(data);

    bars.enter()
    .append("rect")
      .attr("x", 0)
      .attr("y",     function (d, i){ return 4.6153 + i * (4.6153 + 18.46); })
      .attr("font-family", barFont)
      .attr("font-size", barFontSize)
      .merge(bars)
        .attr("fill", function(d){
          if (d.kode_tinggal == d.kode_lahir){
            return "rgb(208, 208, 208)";
          } else {
            return barColor;
          }
        }).transition().delay(300)
          .attr("y",     function (d, i){
            return 4.6153 + i * (4.6153 + 18.46) })
          .attr("width", function (d){
            return xScale(Math.floor(Math.round(d.Jumlah_Migrasi/100)*100)); })
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

function drawAnimation(provinsi){

  // get chosen mode
  if (d3.select('#to').classed("btn-clicked")){
    var arah = "masuk";
  } else if(d3.select('#from').classed("btn-clicked")) {
    var arah = "keluar";
  }


  d3.selectAll(".provinsi").classed("cntrClicked", false);
  d3.selectAll("."+provinsi).classed("cntrClicked", true);
  //d3.selectAll("."+provinsi").classed("active", false);
  var jk = "Gabungan";

  arusMigrasi(provinsi,arah,jk);
  pieChart(provinsi,arah,jk);
  barChartTop5(provinsi,arah,jk);
  titleBar(provinsi, arah,jk);

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


function zoomed() {
  projection
      .translate(zoom.translate())
      .scale(zoom.scale());

  g.selectAll("path")
      .attr("d", path);
}


function dblclicked_(d) {
      var x, y, k;

      if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
      } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
      }
      gMap.selectAll(".provinsi")
          .classed("active", centered && function(d) { return d === centered; });

      gMap.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px")

      gArrows.transition()
              .duration(750)
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
              .style("stroke-width", 1.5 / k + "px");

      d3.event.stopPropagation();

    }
