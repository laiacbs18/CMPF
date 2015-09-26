var app = angular.module('CMPF');

app.controller('AboutCtrl', ['$http', function ($http) {
        var controller = this;
        $http.get('/api/content?area=aboutUs').then(function(response) {
            controller.content = response.data;
        }, function(error) {});
    }]);