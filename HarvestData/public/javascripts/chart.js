var N_data=300;

var obj_csv = {
    size:0,
    dataFile:[]
};

function readImage(input) {
    var parsedCSV;
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
        reader.onload = function (e) {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            parsedCSV = csvJSON(obj_csv.dataFile)
            generate(parsedCSV)
        }
    }
}

function csvJSON(csv) {
    var lines=csv.split("\n");
    //make array of headers from line 3
    var headers=lines[3].split(",").map( function(h)
      {return h.split(" ").shift().trim()});

    // split lines 4 to 4+N_data as dictionaries indexed by elements of headers
    var output=lines.slice(4,4+N_data).map(function(line) {
      lineDictionary=line.split(",").reduce(function(accumulator,currentValue,index) {
          accumulator[headers[index]]=parseFloat(currentValue.trim());
          return accumulator
        },{});
      return lineDictionary;
    })
    //console.log("output="+JSON.stringify(output));
    return output
}

/*columnData*/
function normalize(columnData) {
  var initialValue = {"DISTANCE":0,"SWATHWIDTH":0,"VRYIELDVOL":0,"WetMass":0, "Moisture":0};
  var sums = columnData.reduce(function(accumulator,currentValue) {
    for(var key of Object.keys(currentValue)) {
      if(key != "Time") {
        accumulator[key] += currentValue[key];
      }
    }
    return accumulator;
  },initialValue);
  
  var normalized = columnData.map(function(instance) {
    for (var key of Object.keys(sums)) {
      instance[key] = instance[key]/sums[key];
    }
    return instance;
  });
  
  return normalized;
}

function generate(parsedCSV){
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.paddingRight = 20;

  var data;
  parsedCSV = normalize(parsedCSV);
  chart.data = parsedCSV;
  console.log(parsedCSV);

  /*
  ** Axis definition
  */
  var timeAxis = chart.xAxes.push(new am4charts.ValueAxis());
  timeAxis.title.text = "Time";
  timeAxis.title.fill = am4core.color("#FFFFFF");
  timeAxis.renderer.labels.template.fill = am4core.color("#FFFFFF");
  timeAxis.renderer.grid.template.strokeOpacity = 0.5;
  timeAxis.renderer.grid.template.stroke = am4core.color("#FFFFFF");
  timeAxis.renderer.grid.template.strokeWidth = 0.7;


  var dataAxis = chart.yAxes.push(new am4charts.ValueAxis());
  dataAxis.title.text = "Data (Normalized)";
  dataAxis.title.fill = am4core.color("#FFFFFF");
  dataAxis.tooltip.disabled = true;
  dataAxis.renderer.labels.template.fill = am4core.color("#FFFFFF");
  dataAxis.renderer.grid.template.strokeOpacity = 0.5;
  dataAxis.renderer.grid.template.stroke = am4core.color("#FFFFFF");
  dataAxis.renderer.grid.template.strokeWidth = 0.7;
  


  /*
  **Series definition
  */
  var seriesD = chart.series.push(new am4charts.LineSeries());
  seriesD.dataFields.valueX = "Time";
  seriesD.dataFields.valueY = "DISTANCE";
  seriesD.name = "Distance"
  seriesD.tooltipText = "DISTANCE: [bold]{valueY}[/]";
  //seriesD.fillOpacity = 0.3;
  
  /*var seriesS = chart.series.push(new am4charts.LineSeries());
  seriesS.dataFields.valueX = "Time";
  seriesS.dataFields.valueY = "SWATHWIDTH";
  seriesS.name = "Swathwidth";
  seriesS.tooltipText = "SWATHWIDTH: [bold]{valueY}[/]";
  //seriesS.fillOpacity = 0.3;*/

  var seriesV = chart.series.push(new am4charts.LineSeries());
  seriesV.stroke = am4core.color("#ffff00");
  seriesV.dataFields.valueX = "Time";
  seriesV.dataFields.valueY = "VRYIELDVOL";
  seriesV.name = "VRYieldVolume";
  seriesV.tooltipText = "VRYIELDVOL: [bold]{valueY}[/]";
  //seriesV.fillOpacity = 0.3;

  var seriesW = chart.series.push(new am4charts.LineSeries());
  seriesW.stroke = am4core.color("#ff0000");
  seriesW.dataFields.valueX = "Time";
  seriesW.dataFields.valueY = "WetMass";
  seriesW.name = "WetMass";
  seriesW.tooltipText = "WetMass: [bold]{valueY}[/]";
  //seriesW.fillOpacity = 0.3;

  var seriesM = chart.series.push(new am4charts.LineSeries());
  seriesM.stroke = am4core.color("#00ff00");
  seriesM.dataFields.valueX = "Time";
  seriesM.dataFields.valueY = "Moisture";
  seriesM.name = "Moisture";
  seriesM.tooltipText = "Moisture: [bold]{valueY}[/]";
  //seriesM.fillOpacity = 0.3;



  /*
  **configure tooltip
  */
  var axisTooltip = timeAxis.tooltip;
  axisTooltip.background.fill = am4core.color("#07BEB8");
  axisTooltip.background.strokeWidth = 0;
  axisTooltip.background.cornerRadius = 3;
  axisTooltip.background.pointerLength = 0;
  axisTooltip.dy = 5;

  var dropShadow = new am4core.DropShadowFilter();
  dropShadow.dy = 1;
  dropShadow.dx = 1;
  dropShadow.opacity = 0.5;
  axisTooltip.filters.push(dropShadow);

  /* Decorate axis tooltip content */
  timeAxis.adapter.add("getTooltipText", function(text, target) {
    return "Time: " + text + "[/]";
  });


   /*
  **cursor configuration
  */
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.lineY.opacity = 0.3;
  chart.cursor.lineY.stroke = am4core.color("#FFFFFF");
  
  /*
  **legend configuration
  */
  chart.legend = new am4charts.Legend();
  chart.legend.labels.template.text = "{name}[/]";
  chart.legend.labels.template.fill = new am4core.color("#FFFFFF");

}
