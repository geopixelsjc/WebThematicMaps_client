var ThematicMapModule = function() {
    
    var self;
   
    // constructor
    var ThematicMapModule = function() {};

    ThematicMapModule.prototype = {
    
        init: function() {
            self = this;
            self.initializeModallisteners();
            self.initializeButtonsListeners();
            self.initializeRadiolisteners();
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

                var url = "http://localhost:8080/WebThematicMaps_server/rest/json/indicators?";
                url += "table="+"tab_indicadores";
                $.getJSON( url, function( data ) {
                    self.tableIndicators = data;
                    
                });
            });
            $("#executeThematicButton").click(function() {
                var validate = true;
                if($("#name-thematic").val().length == 0){
                    validate = false;
                    alert("Entre com o nome para o novo tema.");
                    $("#name-thematic").focus();
                    return;
                }else{
                    if(Map.existsLayer($("#name-thematic").val())){
                        validate = false;
                        alert("Este nome já existe.");
                        $("#name-thematic").focus();
                        return;
                    }
                }
                if(!$("#optC").is(":checked") && !$("#optA").is(":checked")  && !$("#optI").is(":checked") ){
                    validate = false;
                    alert("Selecione o tipo de pesquisa.");
                    return;
                }
                if($("#year-selection").val().length == 0){
                    validate = false;
                    alert("Selecione o ano.");
                    $("#year-selection").focus();
                    return;
                }
                if($("#classes-number").val().length == 0){
                    validate = false;
                    alert("Entre com a quantidade de classes.");
                    $("#classes-number").focus();
                    return;
                }
                if($("#first-color").val().length == 0){
                    validate = false;
                    alert("Selecione a cor inicial.");
                    $("#first-color").focus();
                    return;
                }
                if($("#last-color").val().length == 0){
                    validate = false;
                    alert("Selecione a cor final.");
                    $("#last-color").focus();
                    return;
                }
                if(validate){
                    self.thematicName = $("#name-thematic").val();
                    self.generateGeoJSON();

                    var thematicModal = $('#thematicModal');
                    thematicModal.modal('hide');    
                }
            });
            $("#limparformulario").click(function(){
                self.clearForm();
            });
        },

        initializeRadiolisteners: function(){
            $("#optC").click(function(){
                self.loadComboAttributes("C");
            });
            $("#optA").click(function(){
                self.loadComboAttributes("A");
            });
            $("#optI").click(function(){
                self.loadComboAttributes("I");
            });
        },

        loadComboAttributes: function(opt){
            var optAttributes="";
            for (var i = self.tableIndicators.length - 1; i >= 0; i--) {
                if(self.tableIndicators[i].indicador[0] == opt){
                    optAttributes += '<option value="' + self.tableIndicators[i].id + '">' + self.tableIndicators[i].nome + '</option>';
                }
            };
            $("#attribute-selection").html(optAttributes);
            self.loadDescription();
        },

        initializeTextlisteners: function(){
       
        },

        initializeComboBoxlisteners : function(){
            $("#attribute-selection").change(function(){
                self.loadDescription();
            });
        },

        loadDescription: function(){
            var attribute = self.loadRowAttributeById($("#attribute-selection").val());
            $("#description-font").val(attribute.descricao);
        },

        loadRowAttributeById: function(id){
            for (var i = self.tableIndicators.length - 1; i >= 0; i--) {
                if(self.tableIndicators[i]["id"] == id){
                    return self.tableIndicators[i];
                }
            };
        },
        
        clearForm: function(){
            $("#name-thematic").val("");
            $("#classes-number").val("");
            $("#first-color").val("");
            $("#last-color").val("");
            $("#optC").prop('checked', false);
            $("#optA").prop('checked', false);
            $("#optI").prop('checked', false);
            $("#year-selection").val("");
            $("#description-font").val("");
            $("#attribute-selection").empty();
            $("#type-selection").val("Quantil");
        },

        generateGeoJSON: function() {
            var typeSelecion = "";
            if($("#type-selection").val() == "Quantil"){
                typeSelecion = "quantiles";
            } else {
                typeSelecion = "steps";
            }

            var url = "http://localhost:8080/WebThematicMaps_server/rest/json/choroplethmap?";
            
            url += "table=" + "tab_valores";
            url += "&attribute=" + "nome";
            url += "&geocode=" + "cod_ibge";
            url += "&value=" + "valor";
            url += "&layer=" + "tab_municipios";
            url += "&featurecode=" + "cod_ibge";
            url += "&featurename=" + "municipio";
            url += "&box=" + "x";
            url += "&groupingtype=" + typeSelecion;
            url += "&nclasses=" + $("#classes-number").val();
            url += "&firstcolor=" + String($("#first-color").val()).substring(1, String($("#first-color").val()).length);
            url += "&lastcolor=" + String($("#last-color").val()).substring(1, String($("#last-color").val()).length);;
            url += "&year=" + "ano";
            url += "&targetyear=" + $("#year-selection option:selected").text();
            url += "&targetattribute=" +$("#attribute-selection option:selected").text();


            $.getJSON( url, function( data ) {
                if(data.map != null){
                    var formaterJson = new OpenLayers.Format.GeoJSON()

                    var featuresFromJson = formaterJson.read(
                        data.map
                    );
                    
                    var vectors = new OpenLayers.Layer.Vector(self.thematicName, {
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
                } else {
                    alert("Não retornou nenhum dado deste filtro");
                    return;
                }
            });
            
        }
    };

    return ThematicMapModule;
}();
var thematicMap = new ThematicMapModule();
thematicMap.init();

