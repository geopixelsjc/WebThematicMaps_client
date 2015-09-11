var mapModule = function() {
    // constructor
    var mapModule = function() {},
        self,
        map,
        vector_layer,
        geojson_format;

    mapModule.prototype = {
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
            var zoom = 3;
            var lonlat = new OpenLayers.LonLat(-46.03502, -23.412864);
            map.setCenter(lonlat, zoom);
        },

        getMap: function() {
            return map;
        },

        addGeoJSONFeatures: function(featurecollection) {
            var convertedFeatures = geojson_format.read(featurecollection);
            vector_layer.addFeatures(convertedFeatures);
            map.zoomToExtent(vector_layer.getDataExtent());
        },

        removeAllGeoJSONFeatures: function() {
            vector_layer.removeFeatures();
        }
    };
    return mapModule;
}();

var Map = new mapModule();
Map.init();
