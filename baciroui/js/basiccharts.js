// url = https://api.github.com/users/mralexgray/repos
//solr = http://192.168.1.70:8983/solr/jajal22/select?q=*%3A*&wt=json&indent=true


var file=data_ready;
d3.select("svg").remove(); 

if (selector=="bar"){
var margin = {top: 30, right: 20, bottom: 200, left: 150},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x;
var y;
var xAxis;
var yAxis;

var svg = d3.select("#hasil").append("svg")
    .style("background-color", 'white')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(file, function(error, data) {
var col;
var row;
var xSel;
var ySel;
    $.each(data, function(key, value){
  col=Object.keys(value)[arr];
  row=Object.keys(value)[arrr];
  });
    
  data.forEach(function(d) {
  xSel=Object.prototype.toString.call(d[col]);
  ySel=Object.prototype.toString.call(d[row]);
  console.log(xSel+","+ySel);
  if(xSel=='[object String]' && ySel=='[object Number]'){
        d.col = d[col];
        d.row = +d[row];
  }
  else if(xSel=='[object Number]' && ySel=='[object String]'){
   d.col =+d[col];
        d.row = d[row];
  }
    });
  if(xSel=='[object String]' && ySel=='[object Number]'){
      
  x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .05);
      
  y = d3.scale.linear()
    .range([height, 0]);
      
  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
      
  yAxis = d3.svg.axis()
    .scale(y)
    .orient("left").ticks(10);
  
  x.domain(data.map(function(d) { return d.col; }));
  y.domain([0, d3.max(data, function(d) { return d.row; })]);

  svg.append("g")
      .attr("font-size", "12px")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px")
      .attr("shape-rendering", "crispEdges")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("font-size", "12px")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px")
      .attr("shape-rendering", "crispEdges")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .text(row);
      
  svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill","steelblue")
      .attr("x", function(d) { return x(d.col); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.row); })
      .attr("height", function(d) { return height - y(d.row); });
    };
    
  if(xSel=='[object Number]' && ySel=='[object String]'){

  x = d3.scale.linear()
    .range([0, width]);
      
  y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1);
      
  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
      
  yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
  
  x.domain([0, d3.max(data, function(d) { return d.col; })]);
  y.domain( data.map(function(d) { return d.row; }));
  
  
  svg.append("g")
      .attr("font-size", "12px")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px")
      .attr("shape-rendering", "crispEdges")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("font-size", "12px")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px")
      .attr("shape-rendering", "crispEdges")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .text(row);

  svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill","steelblue")
      .attr("y", function(d) { return x(d.col); })
      .attr("width", function(d) { return x(d.col); })
      .attr("y", function(d) { return y(d.row); })
      .attr("height", y.rangeBand());
   };
   
});
}

else if(selector=="line"){
  // Set the dimensions of the canvas / graph

var margin = {top: 30, right: 20, bottom: 200, left: 150},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;


// Set the ranges
var x;
var y;
// Define the axes
var xAxis;
var yAxis;

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.col); })
    .y(function(d) { return y(d.row); });
    
// Adds the svg canvas
var svg = d3.select("#hasil").append("svg")
        .style("background-color", 'white')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json(file, function(error, data) {
var col;
var row;
var xSel;
var ySel;
    $.each(data, function(key, value){
  col=Object.keys(value)[arr];
  row=Object.keys(value)[arrr];
  });
    

  data.forEach(function(d) {
      xSel=Object.prototype.toString.call(d[col]);
      ySel=Object.prototype.toString.call(d[row]);
    if(xSel=='[object String]' && ySel=='[object Number]'){
        d.col = d[col];
        d.row = +d[row];
    }
    else if(xSel=='[object Number]' && ySel=='[object String]'){
        d.col =+d[col];
        d.row = d[row];
    }
  });
  
  if(xSel=='[object String]' && ySel=='[object Number]'){
  x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .80);
      
  y = d3.scale.linear()
    .range([height, 0]);
      
  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);
      
  yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);
  
    // Scale the range of the data
    x.domain(data.map(function(d) { return d.col; }));
    y.domain([0, d3.max(data, function(d) { return d.row; })]);

    // Add the valueline path.
  svg.append("path")
        //.attr("class", "path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width","3px")
        .attr("d", valueline(data));

    // Add the X Axis
  svg.append("g")
      .attr("font-size", "12px")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px")
      .attr("shape-rendering", "crispEdges")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

    // Add the Y Axis
  svg.append("g")
      .attr("font-size", "12px")
      .attr("class", "y axis")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px") 
      .attr("shape-rendering", "crispEdges")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(row);
};

if(xSel=='[object Number]' && ySel=='[object String]'){
x = d3.scale.linear()
    .range([0, width]);
  y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .05);
  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
  x.domain([0, d3.max(data, function(d) { return d.col; })]);
  y.domain( data.map(function(d) { return d.row; }));
  
   // Add the valueline path.
 svg.append("path")
        //.attr("class", "path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width","3px")
        .attr("d", valueline(data));

    // Add the X Axis
  svg.append("g")
      .attr("font-size", "12px")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px")
      .attr("shape-rendering", "crispEdges")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

    // Add the Y Axis
  svg.append("g")
      .attr("font-size", "12px")
      .attr("class", "y axis")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width","1px") 
      .attr("shape-rendering", "crispEdges")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(row);
}   
});
}
    
 if (selector=="pie"){
  var width = 800,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.row; });

var svg = d3.select("#hasil").append("svg")
    .style("background-color", 'white')
    .attr("font-size", "10px")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.json(file, function(error, data) {
  if (error) throw error;
  var col;
  var row;
  var xSel;
  var ySel;
    $.each(data, function(key, value){
  col=Object.keys(value)[arr];
  row=Object.keys(value)[arrr];
  });

  data.forEach(function(d) {
       xSel=Object.prototype.toString.call(d[col]);
      ySel=Object.prototype.toString.call(d[row]);
      if(xSel=='[object String]' && ySel=='[object Number]'){
        d.col = d[col];
        d.row = +d[row];
      }
      else if(xSel=='[object Number]' && ySel=='[object String]'){
        d.col =d[row];
        d.row = +d[col];
      }
    });

  var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.col); });

  g.append("text")
      .attr("text-size", "10px")
      .style("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.col; });
});
 }
    

d3.select("#save").on("click", function(){
    var svg = document.querySelector("svg");
    var svgData = new XMLSerializer().serializeToString(svg);
    
    //console.log(html);
    var imgsrc = "data:image/svg+xml;base64," + btoa(svgData);
    var img = '<img src="'+imgsrc+'">'; 
    d3.select("#svgdataurl").html(img);
        
    var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d");
    
    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {
    context.drawImage(image, 0, 0);
    
    var a = document.createElement("a");
    a.download = "reportpng.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
};
});
       
 d3.select("#savepdf").on("click", function(){
    var svg = document.querySelector("svg");
    var svgData = new XMLSerializer().serializeToString(svg);
    
  //console.log(html);
    var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svgData);
    var img = '<img src="'+imgsrc+'">'; 
    d3.select("#svgdataurl").html(img);
  
    if(drop=="line"){ 
        var canvas = document.getElementById('canvaspdf'),
            context = canvas.getContext("2d");
    }
    else{
        var canvas = document.getElementById('Canvas'),
        context = canvas.getContext("2d");
    }
     
    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {
        context.drawImage(image, 0, 0);

        // only jpeg is supported by jsPDF
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('l', 'mm', [297, 210]);
        
        pdf.addImage(imgData, 'JPEG', 0, 0);
        var savepdf = document.getElementById('savepdf');
        pdf.save("reportpdf.pdf");
    };
  });  
   

