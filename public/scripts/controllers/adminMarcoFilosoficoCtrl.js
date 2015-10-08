var app = angular.module('CMPF');

app.controller('AdminMarcoFilosoficoCtrl', ['$http', function ($http) {

    var controller = this;

    $http.get('/api/admin/content?area=marcoFilosofico').then(function(response) {
        controller.content = response.data;
    }, function(error) {});

    controller.save = function(){
        $http.put('/api/admin/content', controller.content);
    };

}]);