var thematicMapModule = function() {
    var dialog;
    // constructor
    var thematicMapModule = function() {};
    var self;
    thematicMapModule.prototype = {
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
            var url = 'assets/sp.geojson';
            $.getJSON(url, function(geojson, status) {
                Map.addGeoJSONFeatures(geojson);
            });
        }
    };
    return thematicMapModule;
}();
var thematicMap = new thematicMapModule();
thematicMap.init();
