var app = angular.module('CMPF');

app.controller('AdminEquipoGerencialCtrl', ['$http', function($http){
    var controller = this;
    $http.get('/api/admin/staff').then(function(response) {
        controller.staff = response.data;
    }, function(error) {});

    controller.delete = function(person) {
        var response = confirm('Seguro que desea borrar "' + person.name + '"?');
        if (response) {
            $http.delete('/api/admin/staff/' + person.id).then(function(response) {
                var index = controller.staff.indexOf(person);
                controller.staff.splice(index, 1);
            }, function(error) {});
        }
    };
    controller.edit = function(person) {
        controller.reference = person;

        controller.selectedStaff = angular.copy(person);

        $('.staff').modal({
            backdrop: 'static'
        });

    };

    controller.create = function() {
        controller.reference = null;

        controller.selectedStaff = {
            name: '',
            area: '',
            position: '',
            order: ''
        };

        $('.staff').modal({
            backdrop: 'static'
        });

    };

    controller.save = function() {
        if (controller.reference != null) {
            $http.put('/api/admin/staff', controller.selectedStaff).then(function(response) {
                var index = controller.staff.indexOf(controller.reference);
                controller.staff.splice(index, 1);
                controller.staff.push(angular.copy(controller.selectedStaff));
                controller.reference = null;

                controller.selectedStaff = null;
                $('.staff').modal('toggle');
            }, function(error) {});
        } else {
            $http.post('/api/admin/staff', controller.selectedStaff).then(function(response) {
                var savedStaff = response.data;
                controller.staff.push(savedStaff);
                controller.reference = null;

                controller.selectedStaff = null;
                $('.staff').modal('toggle');
            }, function(error) {});
        }
    };
}]);