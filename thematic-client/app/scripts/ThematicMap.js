var ThematicMapModule = function() {
    
    //var dialog;
    
    var self;
    
    var context = {
        getColour: function(feature) {
            return feature.attributes["COLOUR"];
        }
    };

    var template = {
        fillOpacity: 0.9,
        strokeColor: "#555555",
        strokeWidth: 1,
        fillColor: "${getColour}"
    };

    var style = new OpenLayers.Style(template, {context: context});
    
    var styleMap = new OpenLayers.StyleMap({'default': style});

    var styleObj = {
        format: OpenLayers.Format.GeoJSON,
        styleMap: styleMap,
        isBaseLayer: false,
        projection: new OpenLayers.Projection("EPSG:4326")
    };

    // constructor
    var ThematicMapModule = function() {};

    ThematicMapModule.prototype = {
    
        init: function() {
            self = this;
            self.initializeButtonsListeners();
            self.initializeColorPickerButtons();
        },

        initializeButtonsListeners: function() {
            $("#executeThematicButton").click(function() {
                self.generateGeoJSON();
                var thematicModal = $('#thematicModal');
                thematicModal.modal('hide');
            });
        },

        initializeColorPickerButtons: function() {
            $(function() {
                $('.colorPicker').colorpicker();
            });
        },

        generateGeoJSON: function() {
            var url = 'assets/sp.json';

            var vectors = new OpenLayers.Layer.GML("Municípios São Paulo", url, styleObj);
            
            Map.addGeoJSONFeatures(vectors);
        }
    };
    
    return ThematicMapModule;
}();
var thematicMap = new ThematicMapModule();
thematicMap.init();

