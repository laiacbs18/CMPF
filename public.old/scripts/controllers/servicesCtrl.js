var app = angular.module('CMPF');

app.controller('ServicesCtrl', ['services', function (services) {
    var controller = this;
    controller.services = services.data;
}]);