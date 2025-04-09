 (function () {
    "use strict";
    angular.module("help.basemodulos.controllers", [])
		    .controller("PluralsReadController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Plurals", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Plurals ) {
                var vm = this;
                vm.order = '';
                vm.orderBy = orderBy;

                Plurals.getPlurals(function (response) {
                    console.log(response.items);
                    vm.plural = response.items.data;

                }, function (response) {
                    console.log(response);
                    console.log('Error');
                    SweetAlert.swal("Ooops!", "No pudimos cargar los CAMBIAR NOMBRE, vuelve a cargar la página", "error");
                });

                $scope.activateMenuItem('mMódulo');
                $rootScope.icon='iconoDelMenu';
                $rootScope.title='NombredelMódulo';

                function orderBy(filter) {
                    vm.order = filter;
                }
                
            }])
        .controller("PluralsCreateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Plurals", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Plurals ) {
                var vm = this;
				vm.model={};
				
				/*
                vm.saveActionButton = savePlurals;

                function savePlurals() {
                                       
                    Plurals.save( vm.model, function (response) {
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

        .controller("PluralsUpdateController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Plurals", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Plurals ) {
                var plural_id = sessionStorage.getItem('plural');
                var vm = this;
                vm.model={};
				/*
                vm.saveActionButton = updatePlural;
                vm.retrievePlural= retrievePlural;

                function retrievePlural(pluralID) {
                    Plurals.get({id: pluralID}, function (response) {
                        vm.model = response.data;                        
                    }, function (response) {
                        console.log('Error');
                        SweetAlert.swal("Ooops!", "No pudimos cargar los datos correctos", "error");
                    });

                }

                function updatePlural(frm) {                     
                    Plurals.update({id: vm.model.id}, vm.model, function (response) {
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
        .controller("PluralsDeleteController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Plurals", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Plurals ) {
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
                                Plurals.delete({id: id}, function (response) {
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
 .controller("PluralsViewController",  ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Plurals", 
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Plurals ) {
                var plural_id = sessionStorage.getItem('plural');
                var vm = this;
                /*vm.retrievePlural= retrievePlural;
                
                
                function retrievePlural(pluralID) {

                    Plurals.get({id: pluralID}, function (response) {
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