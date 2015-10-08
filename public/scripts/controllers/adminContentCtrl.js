var app = angular.module('CMPF');

app.controller('AdminContentCtrl', ['$http','$routeParams', function ($http, $routeParams) {

    var controller = this;
    var selector = '';
    switch ($routeParams.section) {
        case 'quienes-somos':
            controller.title = 'Quiénes Somos';
            selector = 'aboutUs';
            break;
        case 'marco-filosofico':
            controller.title = 'Marco Filosófico';
            selector = 'marcoFilosofico';
            break;
        case 'descripcion':
            controller.title = 'Descripción';
            selector = 'descripcion';
            break;
    }

    $http.get('/api/admin/content?area=' + selector).then(function(response) {
        controller.element = response.data;
    }, function(error) {});

    controller.save = function(){
        $http.put('/api/admin/content', controller.element);
    };

}]);
