
var obj_csv = {
    size:0,
    dataFile:[]
};

const LOOP_LENGTH = 15000;
const ANIMATION_SPEED = 20;

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
    var lineArray=lines.slice(1,lines.length-1);
    var startPoint = lineArray[0].split(",");
    console.log(startPoint);
    var pathArray = [[parseFloat(startPoint[2]),parseFloat(startPoint[1])]];
    var currTime = 0;
    var timestamps = [currTime];
    lineArray.map(function(line) {
      var datapoint = line.split(',');
      pathArray.push([parseFloat(datapoint[4]),parseFloat(datapoint[3])])

      currTime = currTime + 1000;
      timestamps.push(currTime);
    })
    var output = [];
    var object = {};
    object["path"] = pathArray;
    object["vendor"] = 1;
    object["timestamps"] = timestamps
    output.push(object)

    return output
}

function App(input) {
    const inputdata = input;
    
    const deckgl = new deck.DeckGL({
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
        layers: []
    });

    let time = 0;

    function animate() {
        time = (time + ANIMATION_SPEED) % LOOP_LENGTH;
        window.requestAnimationFrame(animate);
    }
    
    setInterval(() => {
        deckgl.setProps({
          layers: [
            new deck.TripsLayer({
                id: 'trips-layer',
                data: inputdata,
                getPath: d => d.path,
                getTimestamps: d => d.timestamps,
                getColor: d => [250, 50, 50],
                //[Math.random()*250 + 1,Math.random()*250 + 1,Math.random()*250 + 1],
                opacity: 0.3,
                widthMinPixels: 12,
                rounded: true,
                trailLength: 100,
                currentTime: time,
                shadowEnabled: false
        
            })
          ]
        });
      }, 50);
    
      window.requestAnimationFrame(animate);
}
