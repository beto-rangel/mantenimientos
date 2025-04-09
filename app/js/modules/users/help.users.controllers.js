(function () {
    "use strict";
    angular.module("help.users.controllers", [])
	.controller("UsersReadController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert',"Users", "$route", 'Data', "$mdDialog",
            function ($rootScope,  $mdSidenav, $scope, SweetAlert,Users,$route, Data, $mdDialog) {
			var vm = this;
			vm.Usuario=Data.Usuario;
			vm.order = 'nombre';
			vm.orderBy = orderBy;

			vm.editUser = modifyUser;
                
			Users.getUsers(function (response) {
                //console.log('Usuarios:');
					vm.users = response.data.Usuarios;
					$scope.users = response.data.Usuarios;
					$rootScope.users = response.data.Usuarios;
			}, function (response) {
					//console.log('Error');
					//SweetAlert.swal("Ooops!", "No pudimos cargar los datos, asegúrate de tener una sesión activa", "error");
			});

            vm.resetPasswordUser = function(ev, user_id){

                Users.resetPassword({id: user_id}, vm.model, function (response) {
                    //console.log(response);
                    SweetAlert.swal({
                        title: "¡Password Modificado!",
                        text: "El password ha sido reestablecido",
                        type: "success",
                        showConfirmButton: false,
                        timer:5000
                    });
                    $route.reload();
                    $mdDialog.hide();
                }, function (response) {
                    SweetAlert.swal({
                        title: "¡Error!",
                        text: response.data.error.message,
                        type: "error",
                        showConfirmButton: false,
                        timer:3000
                    });
                });

            }

            vm.editPasswordUser = function(ev, id) {
                    //console.log('Id Usaurio Logueado: ');
                    //console.log(id);
                    sessionStorage.setItem('usuarioPassword', id);
                    $mdDialog.show({
                        templateUrl: 'templates/users/dl_editPasswordUser.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                };
			
			$scope.isUpdate = false;
			
			function modifyUser(id, idx) {
					sessionStorage.setItem('user', id);
					sessionStorage.setItem('idx', idx);

					//console.log(id);

					if (!$mdSidenav('create').isOpen()) {
							$scope.isUpdate = false;
					}

					$mdSidenav('update').toggle().then(function () {
							$scope.isUpdate = true;
					});
			}

            $scope.activateMenuItem('mUsuarios');
			$rootScope.icon='person';
			$rootScope.title='Usuarios';
            
			function orderBy(filter) {
				vm.order = filter;
			}
			
        }])
        .controller("UsersCreateController", ["$rootScope",  "$mdSidenav", "$scope", "Users", "SweetAlert", "$route", "Config",
            function ($rootScope,  $mdSidenav, $scope,Users,SweetAlert, $route, Config) {
                var vm = this;
                vm.model = {};
                vm.roles = roles;

                vm.ver=function(){
                    //console.log(vm.model.lideres);
                };

                // Función para seleccionar todas las localidades sin afectar la validación
                vm.selectAll = function () {
                    angular.forEach(vm.locations, function (_, index) {
                        vm.model.localidades[index] = true;
                    });
                };

                // Función para deseleccionar todas las localidades sin afectar la validación
                vm.deselectAll = function () {
                    angular.forEach(vm.locations, function (_, index) {
                        vm.model.localidades[index] = false;
                    });
                };

                Users.getLocalidades(function (response) {
                    vm.locations = response.data.Data;

                    /*vm.model.localidades=[];
                    for(var d=1;vm.locations.length+1>=d;d++){
                        vm.model.localidades.push(true);
                    }
                    delete vm.model.localidades[0];*/
                    //console.log(vm.model);

                    vm.model.localidades = vm.locations.map(() => true);

                }, function (response) {
                    //console.log(response);
                    //console.log('Error');
                    SweetAlert.swal("Ooops!", "No pudimos cargar las Marcas, vuelve a cargar la página", "error");
                });

                vm.saveActionButton = saveUser;
				
                function saveUser() {
                    vm.model.status = 'Activo';

                    /*var divisionesArray = [];
                    angular.forEach(vm.model.localidades, function(value, key){
                        if (value)
                            divisionesArray.push(key);
                    });*/
                    

                    var divisionesArray = [];
                    angular.forEach(vm.model.localidades, function (value, key) {
                        if (value) divisionesArray.push(vm.locations[key].loc_cod_sd); // Asegura que tomas el ID correcto
                    });

                    vm.model.localidades = divisionesArray;
					
                    Users.save( vm.model, function (response) {
                        //console.log('Correcto');
                        SweetAlert.swal({
                            title: "¡Usuario Creado!",
                            text: "El usuario fue creado de forma exitosa",
                            type: "success",
                            showConfirmButton: false,
                            timer:2000
                        });
                        //console.log(response);
                        $route.reload();
                    }, function (response) {
                        vm.respuesta_email_incorrecto = response.data.line;
                        if(vm.respuesta_email_incorrecto == 664){
                            SweetAlert.swal({
                                title: "¡Error!",
                                text: "Email ya registrado en Base de Datos, favor de contactar al Administrador",
                                type: "error",
                                showConfirmButton: false,
                                timer:4000
                            });
                        }else{
                            SweetAlert.swal({
                                title: "¡Error!",
                                text: "El usuario no pudo ser creado, intenta de nuevo",
                                type: "error",
                                showConfirmButton: false,
                                timer:4000
                            });
                        }
                        //console.log(response);
                    });
                }


            }])
        
        .controller("UsersUpdateController", ["$rootScope", "$mdSidenav", "$scope", "Users", 'SweetAlert', '$route', "Config",
    function ($rootScope, $mdSidenav, $scope, Users, SweetAlert, $route, Config) {
        var user_id = sessionStorage.getItem('user');
        var vm = this;
        vm.model = {};
        vm.retrieveUser = retrieveUser;
        vm.saveActionButton = updateUser;
        vm.roles = roles;

        // Cargar las localidades disponibles
        Users.getLocalidades(function (response) {
            vm.locations = response.data.Data;
            // Inicializamos el modelo de localidades en caso de que no haya asignaciones previas
            if (!vm.model.localidades) {
                vm.model.localidades = {};
            }

            // Marcar todas las localidades si el usuario es superadmin (sin localidades asignadas)
            if (vm.model.localidades.length === 0) {
                angular.forEach(vm.locations, function (localidad) {
                    vm.model.localidades[localidad.loc_cod_sd] = true;  // Marcar todas como seleccionadas
                });
            }

        }, function (response) {
            SweetAlert.swal("Ooops!", "No pudimos cargar las Marcas, vuelve a cargar la página", "error");
        });

        // Obtener los datos del usuario y asignar las localidades seleccionadas
        function retrieveUser(userID) {
            Users.get({ id: userID }, function (response) {
                vm.model = response.data;

                // Si el usuario no tiene localidades asignadas, las marcamos todas
                if (vm.model.localidades.length === 0) {
                    angular.forEach(vm.locations, function (localidad) {
                        vm.model.localidades[localidad.loc_cod_sd] = true;  // Marcar todas
                    });
                } else {
                    // Si el usuario tiene localidades asignadas, marcamos las correctas
                    angular.forEach(vm.model.localidades, function (localidad) {
                        vm.model.localidades[localidad.loc_cod_sd] = true;  // Marcar las que corresponden
                    });
                }

            }, function (response) {
                SweetAlert.swal("Ooops!", "No pudimos cargar los datos correctos", "error");
            });
        }

        // Función para seleccionar todas las localidades
        vm.selectAll = function () {
            angular.forEach(vm.locations, function (localidad) {
                vm.model.localidades[localidad.loc_cod_sd] = true;  // Marcar todas
            });
        };

        // Función para deseleccionar todas las localidades
        vm.deselectAll = function () {
            angular.forEach(vm.locations, function (localidad) {
                vm.model.localidades[localidad.loc_cod_sd] = false;  // Desmarcar todas
            });
        };

        function updateUser(frm) {
            var localidadesSeleccionadas = [];

            // Recorremos vm.locations para evitar problemas con índices numéricos
            angular.forEach(vm.locations, function (localidad) {
                // Si la localidad está seleccionada, la agregamos al array
                if (vm.model.localidades[localidad.loc_cod_sd]) {
                    localidadesSeleccionadas.push(localidad.loc_cod_sd);
                }
            });

            // Asignamos el array de localidades seleccionadas
            vm.model.localidades = localidadesSeleccionadas;

            // Enviamos la actualización
            Users.update({ id: vm.model.id }, vm.model, function (response) {
                SweetAlert.swal({
                    title: "¡Usuario Modificado!",
                    text: "Tus cambios han sido guardados de forma exitosa",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                $route.reload();
            }, function (response) {
                SweetAlert.swal({
                    title: "¡Error!",
                    text: "No se han podido guardar los cambios, intenta nuevamente",
                    type: "error",
                    showConfirmButton: false,
                    timer: 2000
                });
            });
        }

        // Cargar los datos del usuario
        retrieveUser(user_id);
    }
])

        .controller("UsersDeleteController", ["$rootScope",  "$scope", 'SweetAlert',"Users", '$route', "$mdDialog",
            function ($rootScope,  $scope, SweetAlert,Users, $route, $mdDialog) {
			
                var vm = this;
                vm.deleteUser = removeUser;

                function removeUser(id) {
                    SweetAlert.swal({
                            title: "¿Estas seguro?",
                            text: "Eliminarás al usuario ",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "Si, ¡elimínalo!",
                            cancelButtonText: "No, ¡Cancelar!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                //console.log("Id");
                                //console.log(id);
                                Users.delete({id: id}, function (response) {
                                    SweetAlert.swal({
                                        title: "¡Eliminado!",
                                        text: "El usuario fue eliminado de forma exitosa",
                                        type: "success",
                                        showConfirmButton: false,
                                        timer:4000
                                    });
                                    $route.reload();
                                }, function (response) {
                                    SweetAlert.swal({
                                        title: "¡Error!",
                                        text: response.data.error.message,
                                        type: "error",
                                        showConfirmButton: false,
                                        timer:4000
                                    });
                                });
                            } else {
                                SweetAlert.swal({
                                        title: "¡Cancelado!",
                                        text: "El usuario no fue eliminado, no se ha hecho ningún cambio",
                                        type: "error",
                                        showConfirmButton: false,
                                        timer:4000
                                    });
                            }
                        });
                }
	
        }])
.controller("UserPasswordController", ["$rootScope",  "$mdSidenav", "$scope", 'SweetAlert','$mdDialog', '$timeout', '$location', '$route', "Users", "Data",
            function ($rootScope,  $mdSidenav, $scope, SweetAlert, $mdDialog, $timeout, $location, $route, Users, Data) {
                var user_id = sessionStorage.getItem('usuarioPassword');
                var vm = this;
                vm.model={};
                vm.user = Data.Usuario;
                //var user_id = Data.Usuario.id;

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                
                vm.saveActionButton = updateUser;
                vm.retrieveUser= retrieveUser;

                function retrieveUser(user_id) {
                    Users.get({id: user_id}, function (response) {
                        //console.log("Info del Usuario logueado:");
                        vm.model = response.data;                        
                    }, function (response) {
                        //console.log('Error');
                        SweetAlert.swal("Ooops!", "No pudimos cargar los datos correctos", "error");
                    });

                }

                function updateUser(frm) {                     
                    Users.updatePassword({id: vm.model.id}, vm.model, function (response) {
                        //console.log(response);
                        SweetAlert.swal({
                            title: "¡Password Modificado!",
                            text: "Tus cambios han sido guardados de forma exitosa",
                            type: "success",
                            showConfirmButton: false,
                            timer:2000
                        });
                        $route.reload();
                        $mdDialog.hide();
                    }, function (response) {
                        //console.log(response);
                        SweetAlert.swal({
                            title: "¡Error!",
                            text: response.data.error.message,
                            type: "error",
                            showConfirmButton: false,
                            timer:3000
                        });
                    });
                }

                retrieveUser(user_id);
                
            }])

var roles = [
	//{"name": "Root"},
    {"name": "Super Administrador"}, //SA
    {"name": "Ingeniero"}, // IN
    
	
];

})();