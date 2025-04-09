(function () {
    'use strict';
		angular.module('help.nombremodulo.services', ['ngResource', 'help.configs.module'])
        .factory('Plurals', function ($resource, Config,Data, $http, $timeout,$auth) {
            var baseURL = Config.SERVER_URL;
            //var franchID = Data.franchID;
            return $resource(baseURL + '/nombreruta/:id', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                save: {
                    url: Config.SERVER_URL + '/nombreruta',
                    method: 'POST'
                },
                delete: {
                    method: 'DELETE'
                },
                getPlurals: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/nombreruta',
                    responseType: 'json'
                },
                findByKey: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/nombreruta/:id',
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