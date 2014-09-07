require([
    "esri/map",
    "esri/dijit/Geocoder",

    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/geometry/screenUtils",

    "dojo/dom",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/_base/Color",

    "dojo/domReady!"
  ], function(
    Map, Geocoder,
    Graphic, SimpleMarkerSymbol, screenUtils,
    dom, domConstruct, query, Color
    ) { 
      var map = new Map("map", {
        basemap: "topo", 
        center: [ -100, 40 ], 
        zoom: 10
      });
      var geocoder = new Geocoder({
        arcgisGeocoder: {
          placeholder: "Where do you want to jam?"
        }, 
        autoComplete: true,
        map: map,
      }, dom.byId("search"));
      geocoder.startup();
      
      geocoder.on("select", showLocation);

        function showLocation(evt) {
          map.graphics.clear();
          var point = evt.result.feature.geometry;
          var symbol = new SimpleMarkerSymbol()
            .setStyle("square")
            .setColor(new Color([255,0,0,0.5]));
          var graphic = new Graphic(point, symbol);
          map.graphics.add(graphic);

          map.infoWindow.setTitle("Search Result");
          map.infoWindow.setContent(evt.result.name);
          map.infoWindow.show(evt.result.feature.geometry);
        };
    }
);
