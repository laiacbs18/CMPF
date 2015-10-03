var app = angular.module('CMPF');

app.controller('AdminLoginCtrl', ['$http', '$location', 'isLoggedIn', function ($http, $location, isLoggedIn) {
    if (isLoggedIn) {
        $location.path('/admin-dashboard');
    } else {
        var controller = this;
        controller.user = {
            username: '',
            password: ''
        };
        controller.submit = function () {
            $http.post('/api/admin', controller.user).
              then(function (response) {
                  $location.path('/admin-dashboard');
              }, function (response) {
                  alert("invalid credentials");
              });
        };
        controller.done = true;
    }
}]);