var ThematicMapModule = function() {
    
    var self;
   
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
            var url = "http://localhost:8080/WebThematicMaps_server/rest/json/choroplethmap?"
            url += "table=tab_valores&attribute=nome&geocode=cod_ibge&value=valor&layer=tab_municipios";
            url += "&featurecode=cod_ibge&featurename=municipio&box=a&groupingtype=quantiles&nclasses=4&f";
            url += "irstcolor=ff0000&lastcolor=00ff00&year=ano&targetyear=2013&targetattribute=abamectina";

            $.getJSON( url, function( data ) {
                var formaterJson = new OpenLayers.Format.GeoJSON()

                var featuresFromJson = formaterJson.read(
                    data.map
                );

                var featuresStylized = new Array();

                for (var i = featuresFromJson.length - 1; i >= 0; i--) {
                    featuresStylized.push(new OpenLayers.Feature.Vector(
                        featuresFromJson[i].geometry,
                        featuresFromJson[i].attributes,
                        {fillColor: featuresFromJson[i].attributes.color}
                    ));
                };

                var vectors = new OpenLayers.Layer.Vector("Municípios São Paulo");
                
                vectors.addFeatures(featuresStylized);

                Map.addGeoJSONFeatures(vectors);
            });
            
        }
    };

    return ThematicMapModule;
}();
var thematicMap = new ThematicMapModule();
thematicMap.init();

