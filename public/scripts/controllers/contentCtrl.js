var app = angular.module('CMPF');

app.controller('ContentCtrl', ['$http','selector', function ($http, selector) {
        var controller = this;
        $http.get('/api/content?area=' + selector).then(function(response) {
            controller.body = response.data;
        }, function(error) {});
    }]);