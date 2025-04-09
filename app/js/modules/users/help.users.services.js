(function () {
    'use strict';
    angular.module('help.users.services', ['ngResource', 'help.configs.module'])
        .factory('Users', function ($resource, Config, $http, $timeout,$auth) {
            var baseURL = Config.SERVER_URL;
            return $resource(baseURL + '/usuarios/:id', {id: '@id'}, {
                update: {
                    method: 'POST'
                },
                save: {
                    url: Config.SERVER_URL + '/usuarios',
                    method: 'POST'
                },
                delete: {
                    method: 'DELETE'
                },
                getUsers: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/usuarios',
                    responseType: 'json'
                },
                getLocalidades: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'GET',
                    url: Config.SERVER_URL + '/localidad_user',
                    responseType: 'json'
                },
                reasignUser: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'DELETE',
                    url: Config.SERVER_URL + '/usuarios/:id/reasign/:idToUser',
                    params: {
                        id: '@id',
                        idToUser: '@idToUser'
                    },
                    responseType: 'json'
                },
                updatePassword: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'PUT',
                    url: Config.SERVER_URL + '/usuarios/:id/resetPassword',
                    params: {
                        id: '@id'                    
                    },
                    responseType: 'json'
                },
                resetPassword: {
                    headers: {
                        Authorization: 'Bearer ' + $auth.getToken()
                    },
                    method: 'PUT',
                    url: Config.SERVER_URL + '/usuarios_resetPassword/:id',
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