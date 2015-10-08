var MapModule = function() {
    // constructor
    var MapModule = function() {},
        self,
        map,
        vector_layer,
        geojson_format;

    MapModule.prototype = {
        init: function() {
            self = this;

            map = new OpenLayers.Map("map");
            geojson_format = new OpenLayers.Format.GeoJSON();
            
            self.createLayers();
            self.createControls();
            self.initZoom();
        },

        createLayers: function() {
            var ol_wms = new OpenLayers.Layer.WMS(
                "OpenLayers WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0", {
                    layers: "basic"
                }
            );
            map.addLayers([ol_wms]);

            vector_layer = new OpenLayers.Layer.Vector();
            map.addLayer(vector_layer);
        },

        createControls: function() {
            map.addControl(new OpenLayers.Control.LayerSwitcher());
        },

        initZoom: function() {
            /*var zoom = 3;
            var lonlat = new OpenLayers.LonLat(-46.03502, -23.412864);
            map.setCenter(lonlat, zoom);*/
            var bounds = new OpenLayers.Bounds(-53.110266333096, -25.300627623906, -44.158735820765, -19.78018433391);
            map.zoomToExtent(bounds);
        },

        getMap: function() {
            return map;
        },
       
        addGeoJSONFeatures: function(featurecollection) {            
            map.addLayer(featurecollection);

            var selectFeature = new OpenLayers.Control.SelectFeature(
                featurecollection,
                {
                    hover: true,
                    highlightOnly: true,
                    overFeature: function(feature) {
                        var information = feature.attributes["name"] + ": " + feature.attributes["value"];
                        document.getElementById("info").innerHTML = information;
                        feature.renderIntent = "select";
                        feature.layer.drawFeature(feature)
                    },
                    outFeature: function(feature){
                        feature.renderIntent = "default";
                        feature.layer.drawFeature(feature)
                    }
                }
            );
           
            map.addControl(selectFeature);
           
            selectFeature.activate();
             
            var bounds = new OpenLayers.Bounds();

            for (var i = selectFeature.layer.features.length - 1; i >= 0; i--) {
                bounds.extend(selectFeature.layer.features[i].geometry.bounds);
            };

            map.zoomToExtent(bounds);
        },

        removeAllGeoJSONFeatures: function() {
            vector_layer.removeFeatures();
        },

        displayInformation: function(){
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

            content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
            overlay.setPosition(coordinate);
        },

        existsLayer: function(layer){
            if(map.getLayersByName(layer).length > 0){
                return true;
            }else{
                return false;
            }
        },

        getNewNameThematic: function(){
            var index = 0;
            var newName = false;
            var nameThematic = "";
            while(newName==false){
                index++;
                nameThematic = "Tema_" + index;
                var existName = false;
                for (var i = map.layers.length - 1; i >= 0; i--) {
                    if(nameThematic == map.layers[i].name){
                        existName = true;
                        break;
                    }
                }
                if(!existName){
                    newName = true;
                }
            }
            return nameThematic;
        }

    };
    return MapModule;
}();

var Map = new MapModule();
Map.init();

