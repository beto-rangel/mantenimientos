 (function () {
    "use strict";
    angular.module("help.localidades.controllers", [])
		    .controller("LocalidadesReadController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Localidades", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Localidades ) {
                var vm = this;
                vm.order = '';
                vm.orderBy = orderBy;

                $scope.query = {
                    order: '',
                    limit: 12,
                    page: 1
                };

                vm.verPerifericos = function(ev, item) {
                    //console.log('Folio');
                    sessionStorage.setItem('itemPerifericosByLocalidad' , JSON.stringify(item));
                    $mdDialog.show({
                        templateUrl: 'templates/localidades/dl_infoPerifericos.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                };

                vm.verEquipos = function(ev, item) {
                    //console.log('Folio');
                    sessionStorage.setItem('itemEquiposByLocalidad' , JSON.stringify(item));
                    $mdDialog.show({
                        templateUrl: 'templates/localidades/dl_infoEquipos.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                };

                vm.editLocalidad = function(ev, item) {
                    //console.log('Folio');
                    sessionStorage.setItem('editarLocalidad' , JSON.stringify(item));
                    $mdDialog.show({
                        templateUrl: 'templates/localidades/dl_editarLocalidad.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                };

                vm.viewInfoLocalidad = function(ev, item) {
                    //console.log('Folio');
                    sessionStorage.setItem('viewLocalidad' , JSON.stringify(item));
                    $mdDialog.show({
                        templateUrl: 'templates/localidades/dl_viewLocalidad.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                };

                Localidades.getLocalidades(function (response) {
                    vm.localidades = response.data.Localidades;
                }, function (response) {
                    SweetAlert.swal("Ooops!", "No pudimos cargar las Localidades, vuelve a cargar la página", "error");
                });

                $scope.activateMenuItem('mLocalidades');
                $rootScope.icon='business';
                $rootScope.title='Localidades';

                function orderBy(filter) {
                    vm.order = filter;
                }
                
            }])
.controller("InfoPerifericosByLocalidadController", ["$rootScope", "$mdSidenav", "$scope", "SweetAlert", "$mdDialog", "$timeout", "$location", "$route", "Inventarios", "Config", "$http",
    function ($rootScope, $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios, Config, $http) {
        var item = JSON.parse(sessionStorage.getItem('itemPerifericosByLocalidad'));
        var vm = this;
        vm.cantidad = item.length;

        vm.perifericos = item;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };    
    }
])

.controller("InfoEquiposByLocalidadController", ["$rootScope", "$mdSidenav", "$scope", "SweetAlert", "$mdDialog", "$timeout", "$location", "$route", "Inventarios", "Config", "$http",
    function ($rootScope, $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios, Config, $http) {
        var item = JSON.parse(sessionStorage.getItem('itemEquiposByLocalidad'));
        var vm = this;
        vm.cantidad = item.length;

        vm.equipos = item;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };    
    }
])
        .controller("LocalidadesCreateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Localidades", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Localidades ) {
                var vm = this;
				vm.model={};
				
				/*
                vm.saveActionButton = saveLocalidades;

                function saveLocalidades() {
                                       
                    Localidades.save( vm.model, function (response) {
                        console.log('Correcto');
                        SweetAlert.swal({
                            title: "¡Franquicia Creada!",
                            text: "La franquicia fue creada de forma exitosa",
                            type: "success",
                            showConfirmButton: false,
                            timer:2000
                        });
                        console.log(response);


                    }, function (response) {
                        SweetAlert.swal({
                            title: "¡Error!",
                            text: "La franquicia no pudo ser creada, intenta de nuevo",
                            type: "error",
                            showConfirmButton: false,
                            timer:2000
                        });
                        console.log(response);
                    });
                }*/


            }])

.controller("EditarLocalidadController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Localidades", "Data",
    function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Localidades, Data ) {
        var item = JSON.parse(sessionStorage.getItem('editarLocalidad'));
        var vm = this;
        vm.model={};
        vm.paises=Data.paises;
        vm.estados=Data.estados;
        vm.municipios=Data.delegaciones;
        vm.abreviaturasEstados = abreviaturasEstados;

        var id_localidad = item.id_localidad;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        vm.normalizarTexto = function(texto) {
            return texto
                .toUpperCase()
                .normalize("NFD") // Descompone caracteres con acentos
                .replace(/[\u0300-\u036f]/g, ""); // Elimina los caracteres diacríticos
        };

        vm.municipios = vm.municipios.map(del => ({
            est: del.est.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            name: del.name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        }));

        vm.estados = vm.estados.map(vm.normalizarTexto);

        vm.asignarAbreviatura = function() {
            var estado = vm.model.estado; // Obtiene el estado seleccionado
            if (estado) {
                vm.model.edo = vm.abreviaturasEstados[estado] || "N/A"; // Si no hay coincidencia, pone "N/A"
            } else {
                vm.model.edo = ""; // Si no hay estado, deja vacío
            }
        };
		
        vm.saveActionButton = updateLocalidad;
        vm.retrieveLocalidad= retrieveLocalidad;

        function retrieveLocalidad(id_localidad) {
            Localidades.getLocalidad({id: id_localidad}, function (response) {
                vm.model = response.data.Localidad[0]; 
                vm.model.estado = vm.model.estado.toUpperCase()
                                                .normalize("NFD") // Descompone caracteres con acentos
                                                .replace(/[\u0300-\u036f]/g, ""); 

                vm.model.delegacion = vm.model.delegacion.toUpperCase()
                                                .normalize("NFD") // Descompone caracteres con acentos
                                                .replace(/[\u0300-\u036f]/g, "");  



                if(vm.model.fecha_alta == null || vm.model.fecha_alta == ''){
                    delete vm.model.fecha_alta;
                }else{
                    vm.model.fecha_alta = new Date(vm.model.fecha_alta);
                    vm.model.fecha_alta = new Date(
                        vm.model.fecha_alta.getFullYear(),
                        vm.model.fecha_alta.getMonth() ,
                        vm.model.fecha_alta.getDate() + 1,
                    );
                }

                if(vm.model.fecha_baja == null || vm.model.fecha_baja == ''){
                    delete vm.model.fecha_baja;
                }else{
                    vm.model.fecha_baja = new Date(vm.model.fecha_baja);
                    vm.model.fecha_baja = new Date(
                        vm.model.fecha_baja.getFullYear(),
                        vm.model.fecha_baja.getMonth() ,
                        vm.model.fecha_baja.getDate() + 1,
                    );
                }


            }, function (response) {
                console.log('Error');
                SweetAlert.swal("Ooops!", "No pudimos cargar los datos correctos", "error");
            });

        }

        function updateLocalidad(frm) { 
            $mdDialog.hide();                    
            Localidades.updateLocalidad({id: vm.model.id_localidad}, vm.model, function (response) {

                if(!vm.model.fecha_alta){
                    vm.model.fecha_alta = '';
                }
                if(vm.model.fecha_alta){
                    vm.model.fecha_alta   = moment(vm.model.fecha_alta).format("YYYY-MM-DD");
                }

                if(!vm.model.fecha_baja){
                    vm.model.fecha_baja = '';
                }
                if(vm.model.fecha_baja){
                    vm.model.fecha_baja   = moment(vm.model.fecha_baja).format("YYYY-MM-DD");
                }

                if(vm.model.loc_tipo == 'Almacen'){
                    vm.model.loc_tipo_abr = 'A';
                }
                if(vm.model.loc_tipo == 'Botiquin'){
                    vm.model.loc_tipo_abr = 'B';
                }
                if(vm.model.loc_tipo == 'Centro de Datos'){
                    vm.model.loc_tipo_abr = 'D';
                }
                if(vm.model.loc_tipo == 'Corporativo'){
                    vm.model.loc_tipo_abr = 'C';
                }
                if(vm.model.loc_tipo == 'Farmacia'){
                    vm.model.loc_tipo_abr = 'F';
                }
                if(vm.model.loc_tipo == 'Fesalud'){
                    vm.model.loc_tipo_abr = 'FS';
                }
                if(vm.model.loc_tipo == 'Oficina'){
                    vm.model.loc_tipo_abr = 'O';
                }

                SweetAlert.swal({
                    title: "¡Localidad Modificada!",
                    text: "Tus cambios han sido guardados de forma exitosa",
                    type: "success",
                    showConfirmButton: false,
                    timer:2000
                });
                $route.reload();
            }, function (response) {
                SweetAlert.swal({
                    title: "¡Error!",
                    text: "No se han podido guardar los cambios, intenta nuevamente",
                    type: "error",
                    showConfirmButton: false,
                    timer:2000
                });
            });
        }

        retrieveLocalidad(id_localidad);
		
    }])
        .controller("LocalidadesDeleteController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Localidades", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Localidades ) {
                var vm = this;
				/*
                vm.deletePlural = removePlural;

                function removePlural(id, idx) {
                    SweetAlert.swal({
                            title: "¿Estas seguro?",
                            text: "Eliminarás al ITEM ",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "Si, ¡elimínalo!",
                            cancelButtonText: "No, Cancelar!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                Localidades.delete({id: id}, function (response) {
                                    SweetAlert.swal({
                                        title: "¡Eliminado!",
                                        text: "El ITEM fue eliminado de forma exitosa",
                                        type: "success",
                                        showConfirmButton: false,
                                        timer:2000
                                    });
                                    $route.reload();

                                }, function (response) {
                                    SweetAlert.swal({
                                        title: "¡Error!",
                                        text: "El ITEM no pudo ser eliminado, intenta de nuevo",
                                        type: "error",
                                        showConfirmButton: false,
                                        timer:2000
                                    });
                                });

                            } else {
                                SweetAlert.swal({
                                    title: "¡Cancelado!",
                                    text: "El ITEM no fue eliminado, no se ha hecho ningún cambio",
                                    type: "error",
                                    showConfirmButton: false,
                                    timer:2000
                                });
                            }
                        });
                } */


            }])
.controller("LocalidadesViewController",  ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Localidades", 
    function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Localidades ) {
        var item = JSON.parse(sessionStorage.getItem('viewLocalidad'));
        var vm = this;

        var id_localidad = item.id_localidad;

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        vm.generales   = true;
        vm.equipos     = false;
        vm.perifericos = false;

        vm.changue1 = function(){
            vm.generales   = true;
            vm.equipos     = false;
            vm.perifericos = false;
        }

        vm.changue2 = function(){
            vm.generales   = false;
            vm.equipos     = true;
            vm.perifericos = false;
        }

        vm.changue3 = function(){
            vm.generales   = false;
            vm.equipos     = false;
            vm.perifericos = true;
        }
        
        vm.retrieveLocalidad= retrieveLocalidad;        
        function retrieveLocalidad(id_localidad) {
            Localidades.getLocalidad({id: id_localidad}, function (response) {
                vm.localidad = response.data.Localidad[0];
              }, function (response) {
            });
        }

        retrieveLocalidad(id_localidad);  
        
}])
var abreviaturasEstados = {
    "AGUASCALIENTES": "AGS",
    "BAJA CALIFORNIA": "BC",
    "BAJA CALIFORNIA SUR": "BCS",
    "CAMPECHE": "CAMP",
    "CHIAPAS": "CHIS",
    "CHIHUAHUA": "CHIH",
    "CIUDAD DE MEXICO": "CDMX",
    "COAHUILA": "COAH",
    "COLIMA": "COL",
    "DURANGO": "DGO",
    "ESTADO DE MEXICO": "EDOMEX",
    "GUANAJUATO": "GTO",
    "GUERRERO": "GRO",
    "HIDALGO": "HGO",
    "JALISCO": "JAL",
    "MICHOACAN": "MICH",
    "MORELOS": "MOR",
    "NAYARIT": "NAY",
    "NUEVO LEON": "NL",
    "OAXACA": "OAX",
    "PUEBLA": "PUE",
    "QUERETARO": "QRO",
    "QUINTANA ROO": "QROO",
    "SAN LUIS POTOSI": "SLP",
    "SINALOA": "SIN",
    "SONORA": "SON",
    "TABASCO": "TAB",
    "TAMAULIPAS": "TAM",
    "TLAXCALA": "TLAX",
    "VERACRUZ": "VER",
    "YUCATAN": "YUC",
    "ZACATECAS": "ZAC"
};

})();