 (function () {
    "use strict";
    angular.module("help.empleados.controllers", [])
.controller("EmpleadosReadController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Empleados", 
function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Empleados ) {
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

    vm.editEmpleado = function(ev, item) {
        //console.log('Folio');
        sessionStorage.setItem('editarEmpleado' , JSON.stringify(item));
        $mdDialog.show({
        templateUrl: 'templates/empleados/dl_editarEmpleado.html',
        parent: angular.element(document.body),
        targetEvent: ev,
            clickOutsideToClose:true
        })
    };

    vm.viewInfoEmpleado = function(ev, item) {
        //console.log('Folio');
        sessionStorage.setItem('viewEmpleado' , JSON.stringify(item));
        $mdDialog.show({
            templateUrl: 'templates/empleados/dl_viewEmpleado.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
    };

    Empleados.getEmpleados(function (response) {
        vm.empleados = response.data.Empleados;
    }, function (response) {
        SweetAlert.swal("Ooops!", "No pudimos cargar los Empleados, vuelve a cargar la página", "error");
    });

    $scope.activateMenuItem('mEmpleados');
    $rootScope.icon='group';
    $rootScope.title='Empleados';

    function orderBy(filter) {
        vm.order = filter;
    }
    
}])
        .controller("EmpleadosCreateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Empleados", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Empleados ) {
                var vm = this;
				vm.model={};
				
				/*
                vm.saveActionButton = saveEmpleados;

                function saveEmpleados() {
                                       
                    Empleados.save( vm.model, function (response) {
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

        .controller("EmpleadosUpdateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Empleados", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Empleados ) {
                var plural_id = sessionStorage.getItem('plural');
                var vm = this;
                vm.model={};
				/*
                vm.saveActionButton = updatePlural;
                vm.retrievePlural= retrievePlural;

                function retrievePlural(pluralID) {
                    Empleados.get({id: pluralID}, function (response) {
                        vm.model = response.data;                        
                    }, function (response) {
                        console.log('Error');
                        SweetAlert.swal("Ooops!", "No pudimos cargar los datos correctos", "error");
                    });

                }

                function updatePlural(frm) {                     
                    Empleados.update({id: vm.model.id}, vm.model, function (response) {
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
        .controller("EmpleadosDeleteController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Empleados", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Empleados ) {
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
                                Empleados.delete({id: id}, function (response) {
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
.controller("EmpleadoViewController",  ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Empleados", 
    function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Empleados ) {
        var item = JSON.parse(sessionStorage.getItem('viewEmpleado'));
        var vm = this;

        var empleado_id = item.id;

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
        
        vm.retrieveEmpleado= retrieveEmpleado;        
        function retrieveEmpleado(empleado_id) {
            Empleados.getEmpleado({id: empleado_id}, function (response) {
                vm.empleado = response.data.Empleado[0];
              }, function (response) {
            });
        }

        retrieveEmpleado(empleado_id);  
        
}])

})();