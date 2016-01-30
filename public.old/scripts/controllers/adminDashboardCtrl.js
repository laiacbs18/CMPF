var app = angular.module('CMPF');

app.controller('AdminDashboardCtrl', [
    "user", function(user) {
        this.user = user;
    }
]);