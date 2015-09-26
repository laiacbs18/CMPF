var app = angular.module('CMPF');

app.controller('ServicesCtrl', ['$http', function ($http) {
        var controller = this;
        $http.get('/api/services').then(function(response) {
            controller.services = response.data;
        }, function(error) {});

    }]);