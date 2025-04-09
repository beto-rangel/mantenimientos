(function () {
    'use strict';
		angular.module('help.localidades.services', ['ngResource', 'help.configs.module'])
        .factory('Localidades', function ($resource, Config,Data, $http, $timeout,$auth) {
            var baseURL = Config.SERVER_URL;
            //var franchID = Data.franchID;
            return $resource(baseURL + '/localidades/:id', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                save: {
                    url: Config.SERVER_URL + '/localidades',
                    method: 'POST'
                },
                delete: {
                    method: 'DELETE'
                },
                getLocalidades: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/localidades',
                    responseType: 'json'
                },
                getLocalidad: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/localidad/:id',
                    params: {
                        id: '@id'
                    },
                    responseType: 'json'
                },
                updateLocalidad: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'PUT',
                    url: Config.SERVER_URL + '/localidad/:id',
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