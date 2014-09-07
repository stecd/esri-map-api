////// ARCGIS

require([
    "esri/map",
    "esri/dijit/Geocoder",

    "esri/graphic",
    "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/screenUtils",

    "dojo/dom",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/_base/Color",
    "esri/geometry/Point",
    "esri/InfoTemplate",

    "dojo/domReady!"
  ], function(
    Map, Geocoder,
    Graphic, PictureMarkerSymbol, screenUtils,
    dom, domConstruct, query, Color, Point, InfoTemplate
    ) { 

      var map = new Map("map", {
        basemap: "topo", 
        center: [ -122.422666, 37.7621 ], 
        zoom: 13
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
        var symbol = new SimpleMarkerSymbol().setSize(10).setColor(new Color([255,0,0]));

        var graphic = new Graphic(point, symbol);
        map.graphics.add(graphic);
        
        map.infoWindow.setTitle("Search Result");
        map.infoWindow.setContent(evt.result.name);
        map.infoWindow.show(evt.result.feature.geometry);
      };
      

      //////////////////////////// PARSE
      Parse.initialize("aGteGk8MEwD1hXG8F2HkqNGxWSVIgDFf88VklyvZ", "GbiQBUcrtizLDGhfEd623qKNYxzkVhX5RC05wqj2");

      var JamSessions = Parse.Object.extend("JFJamSession");
      var query = new Parse.Query(JamSessions);
      var allJamSessions = [];

      query.include("jamMembers");
       
      query.find({
        success: function(query) {
          for (var i = 0; i < query.length; ++i) {
            allJamSessions.push({
              'jamAddress': query[i].get('jamAddress'),
              'jamCity': query[i].get('jamCity'),
              'jamDate': query[i].get('jamDate'),
              'latitude': query[i].get('latitude'),
              'longitude': query[i].get('longitude'),
              'members': query[i].get('jamMembers')
            });
          }   
        },
          error: function(error) {
          }
        }).then(function(){
        
            for (var i = 0; i < allJamSessions.length; ++i) {
              //build point
              var point = new Point(allJamSessions[i].longitude, allJamSessions[i].latitude);

              //add to map
              var symbol = new PictureMarkerSymbol('location-icon.png', 36, 51);
              var infoGraphic = new InfoTemplate(allJamSessions[i].jamAddress, "#rock, #punk, #disco")
              console.log(allJamSessions[i].jamDate)
              console.log(allJamSessions[i].members[0].username)
              var graphic = new Graphic(point, symbol, null, infoGraphic);
              map.graphics.add(graphic);
            }
              
        });
        //////////////////////////// PARSE

       

    }
);
