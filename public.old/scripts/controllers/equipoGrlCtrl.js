var app = angular.module('CMPF');

app.controller('EquipoGrlCtrl', [
    'team', function(team) {
        var controller = this;
        controller.team = team.data;
    }
]);