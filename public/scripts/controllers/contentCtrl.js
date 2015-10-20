var app = angular.module('CMPF');

app.controller('ContentCtrl', ['$http','body', function ($http, body) {
    var controller = this;
    controller.body = '<div class="wow fadeInUp">' + body.data + '</div>';
}]);