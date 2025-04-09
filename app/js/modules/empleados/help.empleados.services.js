(function () {
    'use strict';
		angular.module('help.empleados.services', ['ngResource', 'help.configs.module'])
        .factory('Empleados', function ($resource, Config,Data, $http, $timeout,$auth) {
            var baseURL = Config.SERVER_URL;
            //var franchID = Data.franchID;
            return $resource(baseURL + '/empleados/:id', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                save: {
                    url: Config.SERVER_URL + '/empleados',
                    method: 'POST'
                },
                delete: {
                    method: 'DELETE'
                },
                getEmpleados: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/empleados',
                    responseType: 'json'
                },
                getEmpleado: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/empleado/:id',
                    params: {
                        id: '@id'
                    },
                    responseType: 'json'
                },
            }, {
                stripTrailingSlashes: false
            });


        })
})();