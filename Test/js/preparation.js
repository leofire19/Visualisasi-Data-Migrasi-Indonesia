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
  .defer(d3.csv, "data/rasio_JenisKelamin.csv")
  .await(drawMap)