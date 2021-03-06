var ThematicMapModule = function() {
    
    var self;
    //Deploy
    //var domain = "http://74.208.229.211:8080/WebThematicMaps_server/rest/json";
    //teste
    var domain = "http://localhost:8080/WebThematicMaps_server/rest/json";

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

            self.thematics = new Array();
        },

        initializeModallisteners: function(){
            $('#thematicModal').on('hidden.bs.modal', function () {
               self.clearForm();
            });
            $('#thematicLegend').on('hidden.bs.modal', function () {
               self.clearForm();
            });
        },

        initializeButtonsListeners: function() {
            $("#file-link").hide();
            $("#finishShowLegend").click(function(){
                var thematicLegend = $('#thematicLegend');
                thematicLegend.modal('hide'); 
            });
            $('#showModal').click(function(){
                $("#thematicModal").modal("show");

                var url = domain + "/indicators?";
                url += "table=" + "tab_indicadores";
                url += "&indicator=" + "nome";
                $.getJSON( url, function( data ) {
                    self.tableIndicators = data;
                    
                });
                self.loadDefaultValues();
            });
            $('#minimizeWindow').click(function(){
                if($('#minimizeWindow').val() == 0){
                    var optAttributes="";
                    for (var i = 0; i <= self.thematics.length - 1; i++) {
                        var name = self.thematics[i].theme;
                        optAttributes += '<option value="' + name + '">' + name + '</option>';                    
                    };
                    $("#thema-selection").html(optAttributes);
                    $("#thema-selection").val(Map.getLayerNameOnTop(true));
                    self.loadLegend($("#thema-selection option:selected").text());
                }
            });
            $("#executeThematicButton").click(function() {
                var validate = true;

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
                    self.thematicName = Map.getNewNameThematic(
                        $("#attribute-selection option:selected").text() + 
                        "_" + 
                        $("#year-selection").val()
                    );
                    self.generateGeoJSON();

                    var thematicModal = $('#thematicModal');
                    thematicModal.modal('hide');    
                }
            });
            $("#limparformulario").click(function(){
                self.clearForm();
            });
        },

        loadDefaultValues: function(){
            $("#classes-number").val("4");
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
            for (var i = 0; i <= self.tableIndicators.length - 1; i++) {
                if(self.tableIndicators[i].indicador[0] == opt){
                    optAttributes += '<option value="' + self.tableIndicators[i].id + '">' + self.tableIndicators[i].nome + '</option>';
                }
            };
            $("#attribute-selection").html(optAttributes);
            self.loadFeaturesAttribute();
        },

        loadLegend: function(theme){
            var table="<table class='table table-striped' border 1>";
            table +="<tr><th>Cores</th><th>Classes</th><th>Menor Valor</th><th>Maior Valor</th></tr>";
            var legend;
            for (var i = 0; i <= self.thematics.length - 1; i++) {
                if(self.thematics[i].theme == theme){
                    legend = JSON.parse(self.thematics[i].legend);
                    break;
                }
            }
            for (var i = 0; i <= legend.length - 1; i++) {
                table += '<tr>'
                table += '<td bgcolor="' + legend[i].Color + '"></td>';
                table += '<td>' + legend[i].Class + '</td>';
                table += '<td>' + legend[i].MinValue + '</td>';
                table += '<td>' + legend[i].MaxValue + '</td>';
                table += '</tr>'
            };
            table += "</table>";
            $("#table-legend").html(table);
        },

        loadComboYear: function(attribute){
            var url = domain + "/years?";
            url += "table=" + "tab_valores";
            url += "&attribute=" + "nome";
            url += "&value=" + "valor";
            url += "&year=" + "ano";
            url += "&targetattribute=" + attribute.nome;
            $.getJSON( url, function( data ) {
                var optAttributes="";
                for (var i = 0; i <= data.length - 1; i++) {
                    optAttributes += '<option value="' + data[i].ano + '">' + data[i].ano + '</option>';
                };
                $("#year-selection").html(optAttributes);
            });
        },

        initializeTextlisteners: function(){
       
        },

        loadFeaturesAttribute: function(){
            var attribute = self.loadRowAttributeById($("#attribute-selection").val());
            if(attribute){
                self.loadDescription(attribute);
                self.loadLinkFile(attribute);    
                self.loadComboYear(attribute);
            }
        },

        initializeComboBoxlisteners : function(){
            $("#attribute-selection").change(function(){
                self.loadFeaturesAttribute();
            });
            $("#thema-selection").change(function(){
                self.loadLegend($("#thema-selection option:selected").text());
            });
            $("#thema-selection").change(function(){
                Map.displayLayerOnTop($("#thema-selection").val());
            });
        },

        loadDescription: function(attribute){
            if(attribute.descricao != "null"){
                $("#description-font").val(attribute.descricao);    
            }
        },

        loadLinkFile: function(attribute){
            if(attribute.arquivo != "null"){
                $("#file-link").show();
                var win = window.open(attribute.arquivo, '_blank');
                if(win){
                    win.focus();
                }else{
                    alert('Por favor permita popup para este site.');
                }  
            } else {
                $("#file-link").hide();
            }
        },

        loadRowAttributeById: function(id){
            for (var i = self.tableIndicators.length - 1; i >= 0; i--) {
                if(self.tableIndicators[i]["id"] == id){
                    return self.tableIndicators[i];
                }
            };
        },
        
        clearForm: function(){
            $("#classes-number").val("");
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
                typeSelecion = "slices";
            }

            var url = domain + "/choroplethmap?";
            
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

            $('#load-modal').modal('show');

            $.getJSON( url, function( data ) {
                if(data.map != null && data.legend != null){

                    self.thematics.push({
                        theme: self.thematicName,
                        legend: data.legend 
                    });

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
                                fillOpacity: 1,
                                cursor: "pointer"
                            })
                        })
                    });

                    vectors.addFeatures(featuresFromJson);
                    
                    Map.addGeoJSONFeatures(vectors);    
                } else {
                    $('#load-modal').modal('hide');
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

