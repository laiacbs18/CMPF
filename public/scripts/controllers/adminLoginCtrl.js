var app = angular.module('CMPF');

app.controller('AdminLoginCtrl', ['$http', 'userService', '$location', 'isLoggedIn', function ($http, userService, $location, isLoggedIn) {
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
                  userService.setCurrentUser(response.data);
                  $location.path('/admin-dashboard');
              }, function (response) {
                  alert("invalid credentials");
              });
        };
        controller.done = true;
    }
}]);