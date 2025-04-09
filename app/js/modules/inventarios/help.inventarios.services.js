(function () {
    'use strict';
    angular.module('help.inventarios.services', ['ngResource', 'help.configs.module'])
        .factory('Inventarios', function ($resource, Config, Data, $http, $timeout, $auth) {
            var baseURL = Config.SERVER_URL;

            // Recurso principal
            var resource = $resource(baseURL + '/inventarios/:id', { id: '@id' }, {
                update: {
                    method: 'PUT'
                },
                save: {
                    url: Config.SERVER_URL + '/inventarios',
                    method: 'POST'
                },
                delete: {
                    method: 'DELETE'
                },
                getInventarios: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/inventarios',
                    responseType: 'json'
                },
                findByKey: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/inventarios/:id',
                    params: {
                        id: '@id'
                    },
                    responseType: 'json'
                },
                upFotoInventario: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'PUT',
                    url: Config.SERVER_URL + '/agregar/photo/:id',
                    params: {
                        id: '@id'
                    },
                    responseType: 'json'
                },
                getInfoInventario: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/infoInventario/:id',
                    params: {
                        id: '@id'
                    },
                    responseType: 'json'
                },
            }, {
                stripTrailingSlashes: false
            });

            // 👉 Agrega aquí tu función especial para el ZIP
            resource.getFotosZip = function () {
                return $http({
                    method: 'GET',
                    url: Config.SERVER_URL + '/descargar-fotos',
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    responseType: 'blob'
                });
            };

            return resource;
        });
})();
