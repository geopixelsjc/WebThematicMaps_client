var ThematicMapModule = function() {
    
    var self;
   
    // constructor
    var ThematicMapModule = function() {};

    ThematicMapModule.prototype = {
    
        init: function() {
            self = this;
            self.initializeModallisteners();
            self.initializeButtonsListeners();
            self.initializeTextlisteners();
            self.initializeComboBoxlisteners();
        },

        initializeModallisteners: function(){
            $('#thematicModal').on('hidden.bs.modal', function () {
               self.clearForm();
            });
        },

        initializeButtonsListeners: function() {
            $('#showModal').click(function(){
                $("#thematicModal").modal("show");
                /*
                var url = "http://localhost:8080/WebThematicMaps_server/rest/json/indicators?";
                url += "table=" + "tab_indicadores";
                $.getJSON( url, function( data ) {
                    var optAttributes="";
                    var optYears="";
                    //for (var i = data.length - 1; i >= 0; i--) {
                        
                    //};
                    $("#attribute-selection").html(optAttributes);
                });
                */
                var url = "http://localhost:8080/WebThematicMaps_server/rest/json/indicators?";
                url += "table=" + "tab_valores";
                $.getJSON( url, function( data ) {
                    var optAttributes="";
                    var optYears="";
                    //for (var i = data.length - 1; i >= 0; i--) {
                        optAttributes += '<option value="' + data.id + '">' + data.nome + '</option>';
                        optYears += '<option value="' + data.id + '">' + data.ano + '</option>';
                    //};
                    $("#attribute-selection").html(optAttributes);
                    $("#year-selection").html(optYears);
                });
            });
            $("#executeThematicButton").click(function() {
                var validate = true;
                if($("#name-thematic").val().length == 0){
                    validate = false;
                    alert("Entre com o nome para o novo tema.");
                    $("#name-thematic").focus();
                }else{
                    if(Map.existsLayer($("#name-thematic").val())){
                        validate = false;
                        alert("Este nome já existe.");
                        $("#name-thematic").focus();
                    }
                }
                if($("#classes-number").val().length == 0){
                    validate = false;
                    alert("Entre com a quantidade de classes.");
                    $("#classes-number").focus();
                }
                if($("#first-color").val().length == 0){
                    validate = false;
                    alert("Selecione a cor inicial.");
                    $("#first-color").focus();
                }
                if($("#last-color").val().length == 0){
                    validate = false;
                    alert("Selecione a cor final.");
                    $("#last-color").focus();
                }
                if(validate){
                    self.nameThematic = $("#name-thematic").val();
                    self.classesNumber = $("#classes-number").val();
                    self.firstColor = String($("#first-color").val());
                    self.lastColor = String($("#last-color").val());

                    self.generateGeoJSON();

                    var thematicModal = $('#thematicModal');
                    thematicModal.modal('hide');    
                }
            });
            $("#limparformulario").click(function(){
                self.clearForm();
            });
        },

        initializeTextlisteners: function(){
       
        },

        initializeComboBoxlisteners : function(){
            /*
            $("#attribute-selection").click(function(){
                var url = "";
                $.getJSON( url, function( data ) {
                    var options="";
                    $.each(data.opts, function (key, val) {
                        options += '<option value="' + val + '">' + val + '</option>';
                    });
                    $("#attribute-selection").html(options);
                };
            });
            */
            $("#attribute-selection").change(function(){
                alert($("#attribute-selection").val());
            });
            /*
            $("#year-selection").click(function(){
                var url = "";
                $.getJSON( url, function( data ) {
                    var options="";
                    $.each(data.opts, function (key, val) {
                        options += '<option value="' + val + '">' + val + '</option>';
                    });
                    $("#attribute-selection").html(options);
                };
            });
            */
            $("#year-selection").change(function(){
                alert($("#year-selection").val());
            });
            /*
            $("#type-selection").click(function(){
                var url = "";
                $.getJSON( url, function( data ) {
                    var options="";
                    $.each(data.opts, function (key, val) {
                        options += '<option value="' + val + '">' + val + '</option>';
                    });
                    $("#attribute-selection").html(options);
                };
            });
            */
            $("#type-selection").change(function(){
                alert($("#year-selection").val());
            });
            /*
            $("#type-selection").click(function(){
                var url = "";
                $.getJSON( url, function( data ) {
                    var options="";
                    $.each(data.opts, function (key, val) {
                        options += '<option value="' + val + '">' + val + '</option>';
                    });
                    $("#attribute-selection").html(options);
                };
            });
            */
            $("#type-selection").change(function(){
                alert($("#year-selection").val());
            });
        },
        
        clearForm: function(){
            $("#name-thematic").val("");
            $("#classes-number").val("");
            $("#first-color").val("");
            $("#last-color").val("");
            //$("#first-color").removeClass("color").addClass("color");
            //$("#last-color").removeClass("color").addClass("color");
        },

        generateGeoJSON: function() {
            var url = "http://localhost:8080/WebThematicMaps_server/rest/json/choroplethmap?";
            
            url += "table=" + "tab_valores";
            url += "&attribute=" + "nome";
            url += "&geocode=" + "cod_ibge";
            url += "&value=" + "valor";
            url += "&layer=" + "tab_municipios";
            url += "&featurecode=" + "cod_ibge";
            url += "&featurename=" + "municipio";
            url += "&box=" + "x";
            url += "&groupingtype=" + "quantiles";
            url += "&nclasses=" + self.classesNumber;
            url += "&firstcolor=" + self.firstColor.substring(1, self.firstColor.length);
            url += "&lastcolor=" + self.lastColor.substring(1, self.lastColor.length);;
            url += "&year=" + "ano";
            url += "&targetyear=" + "2013";
            url += "&targetattribute=" + "abamectina";


            $.getJSON( url, function( data ) {
                var formaterJson = new OpenLayers.Format.GeoJSON()

                var featuresFromJson = formaterJson.read(
                    data.map
                );
                
                var vectors = new OpenLayers.Layer.Vector(self.nameThematic, {
                    styleMap : new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            strokeColor: "#000000",
                            strokeOpacity: .7,
                            strokeWidth: 1,
                            fillColor: "${color}",
                            fillOpacity: 0.8,
                            cursor: "pointer"
                        })
                    })
                });
                
                vectors.addFeatures(featuresFromJson);
                
                Map.addGeoJSONFeatures(vectors);
            });
            
        }
    };

    return ThematicMapModule;
}();
var thematicMap = new ThematicMapModule();
thematicMap.init();

