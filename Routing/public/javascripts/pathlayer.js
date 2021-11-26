
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
            console.log(parsedCSV);
            App(parsedCSV);
        }
    }
}

function csvJSON(csv) {
    var lines=csv.split("\n");
    var output=lines.slice(1,lines.length).map(function(line) {
        var datapoint = line.split(',');
        var object = {};
        var path = [];
        path[0] = [parseFloat(datapoint[2]),parseFloat(datapoint[1])];
        path[1] = [parseFloat(datapoint[4]),parseFloat(datapoint[3])];
        object["path"] = path;
        object["name"] = datapoint[0];
        colorR = Math.random() * 250 + 1;
        colorG = Math.random() * 250 + 1;
        colorB = Math.random() * 250 + 1;
        object["color"] = [colorR, colorG, colorB];
      return object;
    })
    //console.log("output="+JSON.stringify(output));
    return output
}

function App(input) {
    const inputdata = input;
    const layer = new deck.PathLayer({
        id: 'path-layer',
        data: inputdata,
        pickable: true,
        widthScale: 20,
        widthMinPixels: 2,
        getPath: d => d.path,
        getColor: d => d.color,
        getWidth: d => 5
    });

    new deck.DeckGL({
        views: new deck.MapView({
          repeat: true,
          nearZMultiplier: 0.1,
          farZMultiplier: 1.01,
          orthographic: false,
        }),
        initialViewState: {
          longitude:-90,
          latitude: 42.2,
          zoom: 10.5,
          pitch: 0,
          bearing: 0,
          minZoom: 0,
          maxZoom: 20,
          minPitch: 0,
          maxPitch: 60
        },
        getTooltip: ({object}) => object && object.name,
        controller: true,
        mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        layers: [layer]
    });
}