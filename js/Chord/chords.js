/*//////////////////////////////////////////////////////////
////////////////// Set up the Data /////////////////////////
//////////////////////////////////////////////////////////*/

var NameProvider = ["NAD","SUMUT","SUMBAR","RIAU","JAMBI","SUMSEL","BENGKULU","LAMPUNG","KEP.BABEL","KEPRI","DKI JAKARTA","JABAR","JATENG","DIY","JATIM","BANTEN","BALI","NTB","NTT","KALBAR","KALTENG","KALSEL","KALTIM","KALUT","SULUT","SULTENG","SULSEL","SULTENG","GORONTOALO","SULBAR","MALUKU","MALUT","PAPUA BARAT","PAPUA"];

var matrix = [[478.357,12.1864,1.1641,0.4517,0.1261,0.2923,0.0876,0.2048,0.0177,0.067,0.613,0.949,2.8655,0.1393,1.1148,0.2112,0.0215,0.0566,0.0201,0.0201,9.00E-04,0.0934,0.0497,0,0.0023,0.0086,0.0795,0.0075,0.0083,0.0075,0.0052,0,0.0052,0.0049],
[10.5306,1340.3419,8.0121,5.1506,0.7818,0.7655,0.3236,0.7837,0.0781,1.0032,3.3811,3.4442,10.5602,0.7712,3.8351,0.6047,0.1309,0.1104,0.2117,0.1855,0.0069,0.1024,0.1467,0.0011,0.1863,0.0032,0.2395,0.0574,0.0064,0,0.0997,0.0459,0,0.085],
[0.569,8.0266,483.2454,4.7743,3.1345,1.3745,0.8885,1.2398,0.1371,0.8553,2.7691,3.0322,4.6826,0.6622,2.2341,0.5916,0.0555,0.0744,0.0176,0.0499,0.0174,0.0373,0.1298,0,0.0499,0.0213,0.1104,0.0049,0.002,0,0.026,0.0023,0,0.0422],
[3.289,86.379,33.8738,444.9862,2.6781,3.4257,0.4676,3.8752,0.1591,2.1728,1.5282,6.6099,20.8919,2.9169,16.0088,0.5944,0.1044,0.4932,0.1562,0.3754,0.0324,0.1098,0.0536,0.0154,0.077,0.0873,1.4808,0.0871,0,0,0.0084,0,0.0165,0.0524],
[0.8074,7.9381,9.0697,2.6874,268.6736,5.6869,0.8954,3.2606,0.1676,0.2016,0.7475,4.6548,22.1405,2.2869,7.6375,0.2732,0.0162,0.0313,0.0246,0.0295,0.1431,0.1066,0.0607,0,0.0537,0.0094,2.0245,0.0166,0,0.0082,0.0409,0,0,0.0046],
[0.636,2.8533,2.7214,0.4697,2.3766,707.6982,2.3868,14.0902,0.5723,0.2522,1.5499,7.9099,29.2904,5.2167,20.752,2.8332,1.1362,0.026,0.1719,0.1119,0.053,0.0293,0.1062,0,0.0696,0.0021,0.8355,0.0154,0.014,0.012,0.0528,0,0,0],
[0.2211,2.4237,2.8339,0.2078,0.7387,7.2309,153.5095,3.8938,0.066,0.0726,0.7231,2.0744,7.584,1.2677,3.5392,0.4341,0.1041,0.0055,0,0.0696,0.0351,0.0078,0.0063,0.0366,0.0161,0.0054,0.0595,0,0,0,0.0309,0,0.0124,0],
[0.2182,2.6711,1.9338,0.3736,0.4378,13.6081,0.9703,674.7214,0.3096,0.0977,2.7429,14.8902,44.7307,8.5108,34.632,6.4287,2.1968,0.0191,0.0469,0.1093,0.0498,0.0622,0.1277,0,0.0552,0.0304,0.7373,0.0169,0.033,0.0152,0.0613,0,0,0.0414],
[0.0489,0.6378,0.298,0.1467,0.3007,5.0706,0.1522,1.7073,117.7602,0.2945,0.7164,1.8597,2.6474,0.3703,2.3731,0.6249,0.2437,0.0905,0.2237,0.3613,0.0116,0.028,0.0065,0.0081,0.0463,0.0082,0.755,0.166,0,0,0.0356,6.00E-04,0.0068,0.0148],
[1.4727,21.6557,11.858,8.4886,1.9694,5.3539,0.4259,1.6103,0.6423,108.7278,1.5522,4.3947,11.2232,1.0018,9.7162,0.1154,0.0592,0.4724,1.9812,0.6938,0.0193,0.2483,0.161,0,0.5264,0.1316,1.6571,0.2959,7.00E-04,0,0.1238,0.0263,0,0],
[2.2544,21.7357,13.6956,2.136,1.4198,6.8755,0.6036,8.3115,3.6599,3.8214,350.6806,76.5274,135.6988,11.9016,37.4812,19.8484,0.8573,1.5442,1.3015,6.0229,0.1945,0.5223,0.6513,0.1487,1.4507,0.141,4.8225,0.4029,0.0936,0.0645,1.5612,0.4681,0.2043,0.1846],
[2.1943,28.4406,18.1062,2.0204,2.041,10.6861,1.4632,10.9248,2.2218,0.7475,159.365,4170.6673,158.0082,18.4939,44.15,17.1345,1.1116,1.8678,1.6639,3.1841,0.4362,0.9573,1.0446,0.3576,1.7733,0.402,3.9356,0.312,0.5512,0,1.2647,0.214,0.0446,0.2461],
[0.5876,2.6138,1.4442,0.8563,0.6658,2.1955,0.6043,3.6086,0.37,0.8579,12.7078,21.5679,3273.7408,15.4711,25.7275,4.0851,0.3823,0.3443,0.2345,1.044,0.7489,0.989,0.8006,0.0808,0.5545,0.1229,0.6808,0.3675,0.1007,0.0739,0.4119,0.0709,0.136,0.5768],
[0.4278,0.9294,0.5829,0.575,0.4391,1.818,0.2777,1.4181,0.2917,0.2975,3.6723,4.8035,26.8662,310.382,7.4999,0.801,0.3578,0.4063,0.5858,0.8103,0.1724,0.5699,0.6079,0.1853,0.1736,0.1287,0.5196,0.2307,0.0471,0.0642,0.2215,0.1139,0.3024,0.5056],
[0.4578,3.2,0.759,1.3617,0.5342,1.7077,0.2077,2.5435,0.1872,0.6976,6.069,9.2783,36.1911,4.6187,3790.3909,1.1951,2.9203,2.13,2.3974,1.4748,1.0529,1.9322,2.9001,0.3153,1.1559,0.5807,2.4731,0.3636,0.3571,0.0813,0.9567,0.1429,0.2197,0.919],
[1.1958,9.6181,5.9154,0.702,0.5065,5.6153,1.0507,12.5726,1.1536,0.4202,62.6632,47.2171,66.0094,8.618,18.4644,944.2784,0.5295,0.9935,0.521,1.8781,0.0505,0.4688,0.2099,0,0.2565,0.2521,1.1475,0.0748,0.1098,0.0696,0.2797,0.1375,0.1105,0.0987],
[0.0403,0.7883,0.2557,0.0647,0.0979,0.204,0.026,0.5617,0.0149,0.1813,1.153,2.742,3.1378,0.5689,24.8279,0.1642,372.0077,2.6199,2.9075,0.1448,0.0585,0.1731,0.1569,0.0035,0.2694,0.1792,0.4643,0.2278,0.0433,0.0177,0.22,0.0117,0,0.1179],
[0.0328,0.2554,0.1113,0.0037,0,0.1076,0,0.0775,1.237,0.3215,0.5127,0,1.2907,0.2561,3.0071,0.1345,2.2089,470.829,1.0792,0.1303,0.0237,0.0944,0.3151,0.0232,0.0401,0.159,0.8862,0.0796,0.0134,0.0185,0.0448,0.0223,0.0389,0.0569],
[0.0164,0.2604,0.2182,0.0386,0.0292,0.0331,0.02,0.0171,0.0044,0.2468,0.2517,0.2912,1.2199,0.196,2.5963,0.0431,0.7574,0.852,493.6152,0.0911,0.0673,0.0133,0.1613,0.0456,0.0664,0.0613,1.8342,0.2323,0.008,0.0186,0.4741,0.0314,0.1246,0.1081],
[0.0751,1.3364,0.4376,0.226,0.0721,0.1827,0.0423,0.3204,0.0763,0.1521,1.0447,3.0441,9.3414,1.2996,8.871,0.4113,0.0769,0.4323,0.5076,448.9217,0.2888,0.2401,0.0671,0.0197,0.0712,0.0261,0.3379,0.0223,0,0.0011,0.0846,0,0,0.0549],
[0.0676,0.9105,0.1231,0.225,0.1414,0.156,0.0655,0.4634,0,0.0417,0.3059,2.6703,14.6108,0.9701,14.9418,0.3606,0.2096,0.8112,0.9906,0.7636,196.2705,12.8805,0.2101,0.0203,0.0675,0.047,0.4173,0,0.0146,0.0434,0.0686,0.021,0.0062,0.054],
[0.1611,0.657,0.2478,0.0686,0.1443,0.1572,0.0473,0.3465,0.0282,0.0272,0.5813,2.6659,9.7435,1.5387,18.9805,0.256,0.4518,0.9099,0.7101,0.3285,5.8939,347.4348,1.9998,0.1379,0.2278,0.1884,3.461,0.081,0.0446,0.53,0.0947,0.0182,0.0107,0.0422],
[0.1414,2.1362,0.335,0.1573,0.1581,0.3167,0.0453,0.7515,0.1328,0.0104,1.0086,3.7404,12.2765,1.5879,36.5121,0.1313,0.8909,2.4299,2.1114,0.2731,0.9748,9.6694,230.2659,2.0683,1.4634,1.2095,25.9133,2.0307,0.2344,2.3487,0.4525,0.0876,0.0396,0.0735],
[0.0079,0.129,0.0605,0.0416,0.0239,0.044,0,0.1264,0.0331,0,0.0876,0.2459,1.1122,0.0699,3.3181,0.0658,0.0493,0.1409,0.7053,0.052,0.0164,0.2117,1.2279,45.0243,0.1436,0.7301,8.8252,0.2501,0.0126,0.3691,0.0202,0.0142,0.0088,0.0012],
[0.0772,0.2163,0.0354,0.1815,0,0.1135,0.0054,0.04,0.0111,0.0754,0.9911,0.5643,1.0612,0.0554,1.9511,0.1025,0.3346,0.0253,0.3269,0.0577,0.0315,0.1484,0.4426,0.0348,222.1785,1.8246,1.8661,0.2225,4.9344,0.0569,0.687,1.4979,0.3349,0.4724],
[0.0236,0.3323,0.1835,0.0545,0.0624,0.0928,0.0022,0.1131,0.0362,0.0028,0.4434,1.0632,2.6804,0.2297,5.457,0.0476,6.4718,1.1234,0.2711,0.0399,0.0399,0.0693,0.4012,0.1377,2.6578,240.7243,17.7242,1.4245,2.8639,1.8982,0.1574,0.1638,0.0555,0.0786],
[0.0517,0.3336,0.0693,0.2153,0.5492,0.3291,0,0.3621,0.1038,0.0676,1.2548,1.5641,3.2531,0.7255,4.3879,0.0738,0.9483,1.323,2.5459,0.1418,0.0533,0.242,1.4126,0.4643,0.5969,1.8745,816.644,3.1655,0.2531,3.5157,0.8773,0.3629,0.3549,1.2132],
[0.0162,0.1014,0.0433,0.0896,0.089,0.0435,0,0.0709,0.0702,0.1747,0.1848,2.4356,2.0718,0.4296,3.0801,0.0241,2.54,0.4482,0.253,0.0038,0.0104,0.0401,0.3972,0.0509,0.2557,1.1027,24.9361,205.1646,0.1029,1.1552,2.7651,0.4341,0.1226,0.3957],
[0,0.0608,0.0576,0,0,0.0229,0,0,0,0,0.1565,0.2009,0.3649,0.0229,1.1109,0.0024,0.0436,0.0071,0.0409,0.0121,0,0.0016,0.0195,0.0014,2.3232,1.0635,0.6569,0.086,106.7222,0.0128,0.056,0.0927,0.0115,0.0079],
[0,0.0077,0.0059,0.0077,0.1589,0.0223,0.0051,0.0175,0,0,0.0976,0.2215,0.883,0.0962,0.6772,0.0117,1.0295,0.2436,0.5447,0.0033,0,0.1334,0.3332,0.0609,0.0936,1.0849,11.1927,0.151,0.0715,110.4711,0.0373,0.0208,0.0057,0.0109],
[0.0376,0.095,0.0703,0.0288,0.0044,0.0288,0.0014,0.0822,0.0063,0.0013,0.4648,0.7567,1.6193,0.1904,2.5157,0.0991,0.0326,0.0777,0.3066,0.0381,0,0.0165,0.0232,0,0.2808,0.0713,1.8501,3.1416,0.0216,0.0376,154.9356,0.9249,0.2445,0.3215],
[0.0126,0.083,0.0926,0.0271,0.0303,0.0533,0,0.0392,0.0021,0.0149,0.1305,0.353,0.8619,0.0385,1.4343,0.0444,0.0159,0.002,0.126,0,0.0025,0.0157,0.0215,0,1.6773,0.3143,1.2269,2.0246,0.2321,0.0544,1.4135,105.3355,0.1641,0.1691],
[0.0228,0.4612,0.0538,0.0471,0,0.0593,0.0148,0.1478,0.0341,0.0091,0.2324,0.7044,3.4308,0.2995,3.926,0.0717,0.0338,0.2011,0.724,0.0231,0.0188,0.0356,0.0586,0.0285,1.1863,0.0546,4.6057,1.9441,0.0785,0.2178,4.8135,0.6822,59.6668,2.972],
[0.0787,1.2334,0.224,0.0769,0.0151,0.0852,0.0033,0.5033,0.0135,0.037,0.5362,1.5912,6.8275,0.4187,9.4084,0.1594,0.148,0.6139,1.6624,0.0687,0.0551,0.0439,0.1423,0.0755,1.6861,0.2669,13.8125,1.6889,0.1364,0.1722,4.0609,0.589,2.595,265.1432]];
/*Sums up to exactly 100*/

var colors = ["#C4C4C4", "#69B40F", "#EC1D25", "#C8125C", "#008FC8", "#10218B", "#134B24", "#737373", "#e2dc2d","#C4C4C4", "#69B40F", "#EC1D25", "#C8125C", "#008FC8", "#10218B", "#134B24", "#737373", "#e2dc2d","#C4C4C4", "#69B40F", "#EC1D25", "#C8125C", "#008FC8", "#10218B", "#134B24", "#737373", "#e2dc2d","#C4C4C4", "#69B40F", "#EC1D25", "#C8125C", "#008FC8", "#10218B", "#134B24"];

/*Initiate the color scale*/
var fill = d3.scale.ordinal()
    .domain(d3.range(NameProvider.length))
    .range(colors);

/*//////////////////////////////////////////////////////////
/////////////// Initiate Chord Diagram /////////////////////
//////////////////////////////////////////////////////////*/
var margin = {
        top: 30,
        right: 100,
        bottom: 20,
        left: 100
    },
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    innerRadius = Math.min(width, height) * 0.39,
    outerRadius = innerRadius * 1.04;

/*Initiate the SVG*/
var svg = d3.select("#chart").append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");


var chord = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending) /*sort the chords inside an arc from high to low*/
    .sortChords(d3.descending) /*which chord should be shown on top when chords cross. Now the biggest chord is at the bottom*/
    .matrix(matrix);


/*//////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
//////////////////////////////////////////////////////////*/

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var g = svg.selectAll("g.group")
    .data(chord.groups)
    .enter().append("svg:g")
    .attr("class", function (d) {
        return "group " + NameProvider[d.index];
    });

g.append("svg:path")
    .attr("class", "arc")
    .style("stroke", function (d) {
        return fill(d.index);
    })
    .style("fill", function (d) {
        return fill(d.index);
    })
    .attr("d", arc)
    .style("opacity", 0)
    .transition().duration(1000)
    .style("opacity", 0.4);

/*//////////////////////////////////////////////////////////
////////////////// Initiate Ticks //////////////////////////
//////////////////////////////////////////////////////////*/

var ticks = svg.selectAll("g.group").append("svg:g")
    .attr("class", function (d) {
        return "ticks " + NameProvider[d.index];
    })
    .selectAll("g.ticks")
    .attr("class", "ticks")
    .data(groupTicks)
    .enter().append("svg:g")
    .attr("transform", function (d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
            "translate(" + outerRadius + 40 + ",0)";
    });

/*Append the tick around the arcs*/
ticks.append("svg:line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .attr("class", "ticks")
    .style("stroke", "#FFF");

/*Add the labels for the %'s*/
ticks.append("svg:text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("class", "tickLabels")
    .attr("transform", function (d) {
        return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
    })
    .style("text-anchor", function (d) {
        return d.angle > Math.PI ? "end" : null;
    })
    .text(function (d) {
        return d.label;
    })
    .attr('opacity', 0);

/*//////////////////////////////////////////////////////////
////////////////// Initiate Names //////////////////////////
//////////////////////////////////////////////////////////*/

g.append("svg:text")
    .each(function (d) {
        d.angle = (d.startAngle + d.endAngle) / 2;
    })
    .attr("dy", ".35em")
    .attr("class", "titles")
    .attr("text-anchor", function (d) {
        return d.angle > Math.PI ? "end" : null;
    })
    .attr("transform", function (d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
            "translate(" + (innerRadius + 55) + ")" +
            (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .attr('opacity', 0)
    .text(function (d, i) {
        return NameProvider[i];
    });

/*//////////////////////////////////////////////////////////
//////////////// Initiate inner chords /////////////////////
//////////////////////////////////////////////////////////*/

var chords = svg.selectAll("path.chord")
    .data(chord.chords)
    .enter().append("svg:path")
    .attr("class", "chord")
    .style("stroke", function (d) {
        return d3.rgb(fill(d.source.index)).darker();
    })
    .style("fill", function (d) {
        return fill(d.source.index);
    })
    .attr("d", d3.svg.chord().radius(innerRadius))
    .attr('opacity', 0);

/*//////////////////////////////////////////////////////////	
///////////// Initiate Progress Bar ////////////////////////
//////////////////////////////////////////////////////////*/
/*Initiate variables for bar*/
var progressColor = ["#D1D1D1", "#949494"],
    progressClass = ["prgsBehind", "prgsFront"],
    prgsWidth = 0.4 * 650,
    prgsHeight = 3;
/*Create SVG to visualize bar in*/
var progressBar = d3.select("#progress").append("svg")
    .attr("width", prgsWidth)
    .attr("height", 3 * prgsHeight);
/*Create two bars of which one has a width of zero*/
progressBar.selectAll("rect")
    .data([prgsWidth, 0])
    .enter()
    .append("rect")
    .attr("class", function (d, i) {
        return progressClass[i];
    })
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", function (d) {
        return d;
    })
    .attr("height", prgsHeight)
    .attr("fill", function (d, i) {
        return progressColor[i];
    });

/*//////////////////////////////////////////////////////////	
/////////// Initiate the Center Texts //////////////////////
//////////////////////////////////////////////////////////*/
/*Create wrapper for center text*/
var textCenter = svg.append("g")
    .attr("class", "explanationWrapper");

/*Starting text middle top*/
var middleTextTop = textCenter.append("text")
    .attr("class", "explanation")
    .attr("text-anchor", "middle")
    .attr("x", 0 + "px")
    .attr("y", -24 * 10 / 2 + "px")
    .attr("dy", "1em")
    .attr("opacity", 1)
    .text("Hallo !!!")
    .call(wrap, 350);

/*Starting text middle bottom*/
var middleTextBottom = textCenter.append("text")
    .attr("class", "explanation")
    .attr("text-anchor", "middle")
    .attr("x", 0 + "px")
    .attr("y", 24 * 3 / 2 + "px")
    .attr("dy", "1em")
    .attr('opacity', 1)
    .text("Pencet Lets start dong !!!")
    .call(wrap, 350);


/*//////////////////////////////////////////////////////////
//////////////// Storyboarding Steps ///////////////////////
//////////////////////////////////////////////////////////*/

var counter = 1,
    buttonTexts = ["Ok", "Go on", "Continue", "Okay", "Go on", "Continue", "Okay", "Continue",
        "Continue", "Continue", "Continue", "Continue", "Continue", "Finish"
    ],
    opacityValueBase = 0.8,
    opacityValue = 0.4;

/*Reload page*/
d3.select("#reset")
    .on("click", function (e) {
        location.reload();
    });

/*Skip to final visual right away*/
d3.select("#skip")
    .on("click", finalChord);

/*Order of steps when clicking button*/
d3.select("#clicker")
    .on("click", function (e) {

        if (counter == 1) Draw1();
        else if (counter == 2) finalChord();

        counter = counter + 1;
    });

/*//////////////////////////////////////////////////////////	
//Introduction
///////////////////////////////////////////////////////////*/
function Draw1() {

    /*First disable click event on clicker button*/
    stopClicker();

    /*Show and run the progressBar*/
    runProgressBar(time = 700 * 11);

    changeTopText(newText = "Pola migrasi di Indonesia saat ini Jawa sentris," +
        " yang artinya masyarakat dari daerah di wilayah Indonesia masih sangat mendambakan hidup di pulau Jawa",
        loc = 4 / 2, delayDisappear = 0, delayAppear = 1);

    changeTopText(newText = "Setuju ?? (Harus Setuju)",
        loc = 8 / 2, delayDisappear = 8, delayAppear = 10, finalText = true);

    changeBottomText(newText = "Yuk lihat faktanya",
        loc = 1 / 2, delayDisappear = 8, delayAppear = 10);

    //Remove arcs again
    d3.selectAll(".arc")
        .transition().delay(9 * 700).duration(2100)
        .style("opacity", 0)
        .each("end", function () {
            d3.selectAll(".arc").remove();
        });

}; /*Draw1*/

/*///////////////////////////////////////////////////////////
//Draw the original Chord diagram
///////////////////////////////////////////////////////////*/
/*Go to the final bit*/
function finalChord() {

    /*Remove button*/
    d3.select("#clicker")
        .style("visibility", "hidden");
    d3.select("#skip")
        .style("visibility", "hidden");
    d3.select("#progress")
        .style("visibility", "hidden");

    /*Remove texts*/
    changeTopText(newText = "",
        loc = 0, delayDisappear = 0, delayAppear = 1);
    changeBottomText(newText = "",
        loc = 0, delayDisappear = 0, delayAppear = 1);

    /*Create arcs or show them, depending on the point in the visual*/
    if (counter <= 4) {
        g.append("svg:path")
            .style("stroke", function (d) {
                return fill(d.index);
            })
            .style("fill", function (d) {
                return fill(d.index);
            })
            .attr("d", arc)
            .style("opacity", 0)
            .transition().duration(1000)
            .style("opacity", 1);

    } else {
        /*Make all arc visible*/
        svg.selectAll("g.group").select("path")
            .transition().duration(1000)
            .style("opacity", 1);
    };

    /*Make mouse over and out possible*/
    d3.selectAll(".group")
        .on("mouseover", fade(.02))
        .on("mouseout", fade(.80));

    /*Show all chords*/
    chords.transition().duration(1000)
        .style("opacity", opacityValueBase);

    /*Show all the text*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(100)
        .style("stroke", "#000");
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(100)
        .selectAll(".tickLabels").style("opacity", 1);
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(100)
        .selectAll(".titles").style("opacity", 1);

}; /*finalChord*/

/*//////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
//////////////////////////////////////////////////////////*/

/*Returns an event handler for fading a given chord group*/
function fade(opacity) {
    return function (d, i) {
        svg.selectAll("path.chord")
            .filter(function (d) {
                return d.source.index != i && d.target.index != i;
            })
            .transition()
            .style("stroke-opacity", opacity)
            .style("fill-opacity", opacity);
    };
}; /*fade*/

/*Returns an array of tick angles and labels, given a group*/
function groupTicks(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1).map(function (v, i) {
        return {
            angle: v * k + d.startAngle,
            label: i % 5 ? null : v + "%"
        };
    });
}; /*groupTicks*/

/*Taken from https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
//Calls a function only after the total transition ends*/
function endall(transition, callback) {
    var n = 0;
    transition
        .each(function () {
            ++n;
        })
        .each("end", function () {
            if (!--n) callback.apply(this, arguments);
        });
}; /*endall*/

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
    var text = d3.select(this)[0][0],
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4,
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        };
    };
};

/*Transition the top circle text*/
function changeTopText(newText, loc, delayDisappear, delayAppear, finalText, xloc, w) {

    /*If finalText is not provided, it is not the last text of the Draw step*/
    if (typeof (finalText) === 'undefined') finalText = false;

    if (typeof (xloc) === 'undefined') xloc = 0;
    if (typeof (w) === 'undefined') w = 350;

    middleTextTop
        /*Current text disappear*/
        .transition().delay(700 * delayDisappear).duration(700)
        .attr('opacity', 0)
        /*New text appear*/
        .call(endall, function () {
            middleTextTop.text(newText)
                .attr("y", -24 * loc + "px")
                .attr("x", xloc + "px")
                .call(wrap, w);
        })
        .transition().delay(700 * delayAppear).duration(700)
        .attr('opacity', 1)
        .call(endall, function () {
            if (finalText == true) {
                d3.select("#clicker")
                    .text(buttonTexts[counter - 2])
                    .style("pointer-events", "auto")
                    .transition().duration(400)
                    .style("border-color", "#363636")
                    .style("color", "#363636");
            };
        });
}; /*changeTopText */

/*Transition the bottom circle text*/
function changeBottomText(newText, loc, delayDisappear, delayAppear) {
    middleTextBottom
        /*Current text disappear*/
        .transition().delay(700 * delayDisappear).duration(700)
        .attr('opacity', 0)
        /*New text appear*/
        .call(endall, function () {
            middleTextBottom.text(newText)
                .attr("y", 24 * loc + "px")
                .call(wrap, 350);
        })
        .transition().delay(700 * delayAppear).duration(700)
        .attr('opacity', 1);;
} /*changeTopText*/

/*Stop clicker from working*/
function stopClicker() {
    d3.select("#clicker")
        .style("pointer-events", "none")
        .transition().duration(400)
        .style("border-color", "#D3D3D3")
        .style("color", "#D3D3D3");
}; /*stopClicker*/

/*Run the progress bar during an animation*/
function runProgressBar(time) {

    /*Make the progress div visible*/
    d3.selectAll("#progress")
        .style("visibility", "visible");

    /*Linearly increase the width of the bar
    //After it is done, hide div again*/
    d3.selectAll(".prgsFront")
        .transition().duration(time).ease("linear")
        .attr("width", prgsWidth)
        .call(endall, function () {
            d3.selectAll("#progress")
                .style("visibility", "hidden");
        });

    /*Reset to zero width*/
    d3.selectAll(".prgsFront")
        .attr("width", 0);

}; /*runProgressBar*/