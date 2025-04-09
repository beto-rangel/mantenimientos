 (function () {
    "use strict";
    angular.module("help.inventarios.controllers", [])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(){
            scope.$apply(function(){
              var files = element[0].files;
              var fileArray = [];
              for (var i = 0; i < files.length; i++){
                fileArray.push(files[i]);
              }
              modelSetter(scope, fileArray);
            });
          });
        }
      };
    }])
.controller("InventariosReadController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", "$filter", "$http",
function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios, $filter, $http ) {
    var vm = this;
    vm.order = '';
    vm.orderBy = orderBy;

    $scope.query = {
        order: '',
        limit: 12,
        page: 1
    };

    vm.upPhotoFolio = function(ev, item) {
        //console.log('Folio');
        //console.log(folio);
        sessionStorage.setItem('itemInventario' , JSON.stringify(item));
        $mdDialog.show({
            templateUrl: 'templates/inventarios/dl_upPhotoFolio.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
    };

    vm.downloadZip = function(ev) {
        Inventarios.getFotosZip().then(function (response) {
            const blob = response.data;
    
            const urlBlob = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = 'evidencias.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(urlBlob);
        }).catch(function () {
            SweetAlert.swal("Ooops!", "No pudimos descargar el archivo, vuelve a intentarlo", "error");
        });
    };

    Inventarios.getInventarios(function (response) {
        vm.inventarios = response.data.Inventarios; 
    }, function (response) {
        SweetAlert.swal("Ooops!", "No pudimos cargar el Inventario, vuelve a cargar la página", "error");
    });

    $scope.activateMenuItem('mInventarios');
    $rootScope.icon='inventory';
    $rootScope.title='Inventarios';

    function orderBy(filter) {
        vm.order = filter;
    }

    $scope.isViewInfo = false;
    vm.viewInfo = viewInfo; 

    function viewInfo(item, idx) {
        sessionStorage.setItem('itemInventarioViewInfo' , JSON.stringify(item));

        if (!$mdSidenav('slow').isOpen()) {
                $scope.isViewInfo = false;
        }

        $mdSidenav('fast').toggle().then(function () {
                $scope.isViewInfo = true;
        });
    };

    vm.verPerifericos = function(ev, item) {
        //console.log('Folio');
        sessionStorage.setItem('itemPerifericos' , JSON.stringify(item));
        $mdDialog.show({
            templateUrl: 'templates/inventarios/dl_infoPerifericos.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
    };

    vm.verMantenimientos = function(ev, item, index) {
        //console.log('Folio');
        sessionStorage.setItem('itemMantenimiento' , JSON.stringify(item));
        $mdDialog.show({
            templateUrl: 'templates/inventarios/dl_infoMantenimientos.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
    };

    
}])
.controller("UpPhotoFolioController", ["$rootScope", "$mdSidenav", "$scope", "SweetAlert", "$mdDialog", "$timeout", "$location", "$route", "Inventarios", "Config", "$http",
    function ($rootScope, $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios, Config, $http) {
        var item = JSON.parse(sessionStorage.getItem('itemInventario'));
        var vm = this;
        vm.model = item;
        vm.photosAntes = [];
        vm.photosDespues = [];

        vm.model.estado_inventario = 1;

        vm.model.perifericos.forEach(function(periferico) {
          // Si no tiene estado, se le asigna "1" por defecto
          if (periferico.estado === null) {
            periferico.estado = 1;
          }
        });

        $scope.validateFiles = function() {
            $scope.$apply(); // Forzar actualización de AngularJS
        };

        var year = new Date().getFullYear();
        vm.year = year;

        var today = new Date();
        var formattedDate = today.toISOString().split('T')[0];
        vm.model.fecha_mantenimiento = formattedDate;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        var inputs = document.querySelectorAll('.inputfile');
        Array.prototype.forEach.call(inputs, function(input) {
            input.addEventListener('change', function(e) {
                angular.forEach(this.files, function(file) {
                    vm.photosAntes.push(file);
                    vm.photosDespues.push(file);
                });
            });
        });

        vm.saveActionButton = savePhotoFolio;
        vm.model.hola = 'hola';

        function savePhotoFolio() {
            if (!vm.model.hola) {
                SweetAlert.swal({
                    title: "¡Datos incompletos!",
                    text: "Debes llenar todos los campos marcados con *",
                    type: "warning",
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            vm.model.photosAntes   = vm.photosAntes.map(file => file.name);
            vm.model.photosDespues = vm.photosDespues.map(file => file.name);

            Inventarios.upFotoInventario({ id: vm.model.id }, vm.model, function (response) {

                if(vm.photosAntes.length > 0){
                    vm.model.tiempo_fotos = 'ANTES';
                }
                if(vm.photosDespues.length > 0){
                    vm.model.tiempo_fotos = 'DESPUES';
                }

                if (vm.photosAntes.length > 0) {
                    var fd = new FormData();
                    fd.append('localidad', vm.model.loc_cod_sd);
                    fd.append('empleado', vm.model.nombre_empleado);
                    fd.append('serie_principal', vm.model.serie1);
                    fd.append('seccion', 'ANTES');
                    fd.append('carpeta', 'imagen');

                    angular.forEach(vm.photosAntes, function(file) {
                        fd.append('file[]', file);
                    });

                    $http.post(Config.SERVER_URL_UPLOAD, fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .then(function(response) {
                    })
                    .catch(function(error) {
                    });
                }

                if (vm.photosDespues.length > 0) {
                    var fd = new FormData();
                    fd.append('localidad', vm.model.loc_cod_sd);
                    fd.append('empleado', vm.model.nombre_empleado);
                    fd.append('serie_principal', vm.model.serie1);
                    fd.append('seccion', 'DESPUES');
                    fd.append('carpeta', 'imagen');

                    angular.forEach(vm.photosDespues, function(file) {
                        fd.append('file[]', file);
                    });

                    $http.post(Config.SERVER_URL_UPLOAD, fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .then(function(response) {
                    })
                    .catch(function(error) {
                    });
                }
                SweetAlert.swal({
                    title: "¡Foto Creada!",
                    text: "La(s) foto(s) fueron creadas de forma exitosa",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                $route.reload();
                $mdDialog.hide();
            }, function (errorResponse) {
                SweetAlert.swal({
                    title: "¡Error!",
                    text: "No se pudo crear la foto, intenta de nuevo.",
                    type: "error",
                    showConfirmButton: false,
                    timer: 2000
                });
            });
        }
    }
])
.controller("InfoInventarioController",  ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", "Config",
    function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios, Config ) {
        var item = JSON.parse(sessionStorage.getItem('itemInventarioViewInfo'));
        var vm = this;

        vm.item = item;
        var id_inventario = item.id;

        //vm.rutaFotosInventarios = '../instalaciones_back/storage/app/Inventarios/';
        //vm.rutaFotosInventarios = 'https://demosantander.kenos-atom.com/storage/Inventarios/';

        vm.retrieveInfo= retrieveInfo;
        
        function retrieveInfo(id_inventario) {
            Inventarios.getInfoInventario({id: id_inventario}, function (response) {
                //console.log('Informacion del Folio')
                vm.info        = response.data.General;
                vm.fotos       = response.data.Fotos;
            }, function (response) {
                //console.log('Error');
            });

        }

        retrieveInfo(id_inventario);   
                
}])

.controller("InfoPerifericosController", ["$rootScope", "$mdSidenav", "$scope", "SweetAlert", "$mdDialog", "$timeout", "$location", "$route", "Inventarios", "Config", "$http",
    function ($rootScope, $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios, Config, $http) {
        var item = JSON.parse(sessionStorage.getItem('itemPerifericos'));
        var vm = this;
        vm.perifericos = item;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };    
    }
])
.controller("InventarioViewMantenimientoController",  ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", 
    function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios ) {
        var item = JSON.parse(sessionStorage.getItem('itemMantenimiento'));
        var vm = this;

        console.log(item);

        var id_inventario = item.id;

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        vm.antes = 'ANTES';
        vm.despues = 'DESPUES';

        //vm.rutaFotos = '../fanafesa_back/storage/app/';
        vm.rutaFotos = 'http://158.23.137.150:8082/mantenimientos/fanafesa/fanafesa_back/storage/app/';

        vm.equipo      = true;
        vm.perifericos = false;
        vm.antes       = false;
        vm.despues     = false;
        vm.software    = false;

        vm.changue1 = function(){
            vm.equipo      = true;
            vm.perifericos = false;
            vm.antes       = false;
            vm.despues     = false;
            vm.software    = false;
        }

        vm.changue2 = function(){
            vm.equipo      = false;
            vm.perifericos = true;
            vm.antes       = false;
            vm.despues     = false;
            vm.software    = false;
        }

        vm.changue3 = function(){
            vm.equipo      = false;
            vm.perifericos = false;
            vm.antes       = true;
            vm.despues     = false;
            vm.software    = false;
        }

        vm.changue4 = function(){
            vm.equipo      = false;
            vm.perifericos = false;
            vm.antes       = false;
            vm.despues     = true;
            vm.software    = false;
        }

        vm.changue5 = function(){
            vm.equipo      = false;
            vm.perifericos = false;
            vm.antes       = false;
            vm.despues     = false;
            vm.software    = true;
        }
        
        vm.retrieveInfo= retrieveInfo;        
        function retrieveInfo(id_inventario) {
            Inventarios.getInfoInventario({id: id_inventario}, function (response) {
                //console.log('Informacion del Folio')
                vm.info = response.data.Data[0];
            }, function (response) {
                //console.log('Error');
            });

        }

        retrieveInfo(id_inventario);  
        
}])
        .controller("InventariosCreateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios ) {
                var vm = this;
				vm.model={};
				
				/*
                vm.saveActionButton = saveInventarios;

                function saveInventarios() {
                                       
                    Inventarios.save( vm.model, function (response) {
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

        .controller("InventariosUpdateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios ) {
                var plural_id = sessionStorage.getItem('plural');
                var vm = this;
                vm.model={};
				/*
                vm.saveActionButton = updatePlural;
                vm.retrievePlural= retrievePlural;

                function retrievePlural(pluralID) {
                    Inventarios.get({id: pluralID}, function (response) {
                        vm.model = response.data;                        
                    }, function (response) {
                        console.log('Error');
                        SweetAlert.swal("Ooops!", "No pudimos cargar los datos correctos", "error");
                    });

                }

                function updatePlural(frm) {                     
                    Inventarios.update({id: vm.model.id}, vm.model, function (response) {
                        console.log(response);
                        SweetAlert.swal({
                            title: "¡ITEM Modificado!",
                            text: "Tus cambios han sido guardados de forma exitosa",
                            type: "success",
                            showConfirmButton: false,
                            timer:2000
                        });
                        $route.reload();
                    }, function (response) {
                        console.log(response);
                        SweetAlert.swal({
                            title: "¡Error!",
                            text: "No se han podido guardar los cambios, intenta nuevamente",
                            type: "error",
                            showConfirmButton: false,
                            timer:2000
                        });
                    });
                }

                retrievePlural(plural_id);
				*/
            }])
        .controller("InventariosDeleteController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios ) {
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
                                Inventarios.delete({id: id}, function (response) {
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
 .controller("InventariosViewController",  ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Inventarios", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Inventarios ) {
                var plural_id = sessionStorage.getItem('plural');
                var vm = this;
                /*vm.retrievePlural= retrievePlural;
                
                
                function retrievePlural(pluralID) {

                    Inventarios.get({id: pluralID}, function (response) {
                        console.log(response);
                        vm.plural = response.data;
                    }, function (response) {
                        console.log('Error');
                    });

                }

                retrievePlural(plural_id);   
                */
           }])

})();