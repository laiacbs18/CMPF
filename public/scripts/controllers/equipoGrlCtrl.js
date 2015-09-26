var app = angular.module('CMPF');

app.controller('EquipoGrlCtrl', [
    '$http', function($http) {
        var controller = this;
        $http.get('/api/staff').then(function(response) {
            controller.team = response.data;
        }, function(error) {});

    }
]);