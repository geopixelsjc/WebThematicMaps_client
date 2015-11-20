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

            map = new OpenLayers.Map("map",{
                projection: new OpenLayers.Projection("EPSG:3857")
            });

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

            var ol_osm = new OpenLayers.Layer.OSM("Open StreetMap");

            map.addLayers([ol_osm]);
        },

        createControls: function() {
            map.addControl(new OpenLayers.Control.LayerSwitcher());
        },

        initZoom: function() {
            var zoom = 8;
            var lonlat = new OpenLayers.LonLat(-5191807.75, -2699419.81);
            map.setCenter(lonlat, zoom);
        },

        getMap: function() {
            return map;
        },
       
        addGeoJSONFeatures: function(featurecollection) {      

            map.addLayer(featurecollection);

            self.displayLayerOnTop(featurecollection.name);

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
            
            $('#load-modal').modal('hide');

            alert("Tema " + featurecollection.name + " criado com sucesso!");
        },

        getLayerNameOnTop: function(onlyVisible){
            var indexTop = self.getMaxZIndexLayes(onlyVisible);
            for (var i = map.layers.length - 1; i >= 0; i--) {
                if(map.layers[i].getZIndex() ==  indexTop ){
                    return map.layers[i].name;
                }
            }
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

        getMaxZIndexLayes: function(onlyVisible){
            var index = 0;
            for (var i = map.layers.length - 1; i >= 0; i--) {
                if(onlyVisible){
                    if(map.layers[i].getZIndex() > index && map.layers[i].visibility == true){
                        index = map.layers[i].getZIndex();
                    }    
                }else{
                    if(map.layers[i].getZIndex() > index){
                        index = map.layers[i].getZIndex();
                    }
                }
            };
            return index;
        },

        displayLayerOnTop: function(layerName){
            if(self.existsLayer(layerName)){
                var layer = map.getLayersByName(layerName)[0];
                layer.setZIndex(parseInt(self.getMaxZIndexLayes(false)) + 1);  
                layer.redraw();  
            }
        },

        getNewNameThematic: function(nameThematic){
            var index = 0;
            var newName = false;
            while(newName==false){
                index++;
                newNameThematic = nameThematic + "_" + index;
                var existName = false;
                for (var i = map.layers.length - 1; i >= 0; i--) {
                    if(newNameThematic == map.layers[i].name){
                        existName = true;
                        break;
                    }
                }
                if(!existName){
                    newName = true;
                }
            }
            return newNameThematic;
        }

    };
    return MapModule;
}();

var Map = new MapModule();
Map.init();

