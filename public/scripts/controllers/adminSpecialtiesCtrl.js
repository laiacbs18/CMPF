var app = angular.module('CMPF');

app.controller('AdminSpecialtiesCtrl', [
    '$http', function($http) {
        var controller = this;
        $http.get('/api/admin/specialties').then(function(response) {
            controller.specialties = response.data;
        }, function(error) {});

        controller.delete = function(specialty) {
            var response = confirm('Seguro que desea borrar "' + specialty.name + '"?');
            if (response) {
                $http.delete('/api/admin/specialties/' + specialty.id).then(function(response) {
                    var index = controller.specialties.indexOf(specialty);
                    controller.specialties.splice(index, 1);
                }, function(error) {});
            }
        };
        controller.edit = function(specialty) {
            controller.reference = specialty;

            controller.selectedSpecialty = angular.copy(specialty);

            $('.specialty-modal').modal({
                backdrop: 'static'
            });

        };

        controller.create = function() {
            controller.reference = null;

            controller.selectedService = {
                area: '',
                contactNum: '',
                name: '',
                specialty: ''
            };

            $('.specialty-modal').modal({
                backdrop: 'static'
            });

        };

        controller.save = function() {
            if (controller.reference != null) {
                $http.put('/api/admin/specialties', controller.selectedSpecialty).then(function(response) {
                    var index = controller.specialties.indexOf(controller.reference);
                    controller.specialties.splice(index, 1);
                    controller.specialties.push(angular.copy(controller.selectedSpecialty));
                    controller.reference = null;

                    controller.selectedSpecialty = null;
                    $('.specialty-modal').modal('toggle');
                }, function(error) {});
            } else {
                $http.post('/api/admin/specialties', controller.selectedSpecialty).then(function(response) {
                    var savedSpecialty = response.data;
                    controller.specialties.push(savedSpecialty);
                    controller.reference = null;

                    controller.selectedSpecialty = null;
                    $('.specialty-modal').modal('toggle');
                }, function(error) {});
            }
        };
    }
]);