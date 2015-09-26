var app = angular.module('CMPF');

app.controller('AdminServicesCtrl', [
    '$http', function($http) {
        var controller = this;
        $http.get('/api/servicesadmin').then(function(response) {
            controller.services = response.data;
        }, function(error) {});

        controller.delete = function(service) {
            var response = confirm('Seguro que desea borrar "' + service.type + '"?');
            if (response) {
                $http.delete('/api/servicesadmin/' + service.id).then(function(response) {
                    var index = controller.services.indexOf(service);
                    controller.services.splice(index, 1);
                }, function(error) {});
            }
        };
        controller.edit = function(service) {
            controller.reference = service;

            controller.selectedService = angular.copy(service);

            $('.service-modal').modal({
                backdrop: 'static'
            });

        };

        controller.create = function() {
            controller.reference = null;

            controller.selectedService = {
                type: '',
                serviceNames: []
            };

            $('.service-modal').modal({
                backdrop: 'static'
            });

        };

        controller.save = function() {
            if (controller.reference != null) {
                $http.put('/api/servicesadmin', controller.selectedService).then(function(response) {
                    var index = controller.services.indexOf(controller.reference);
                    controller.services.splice(index, 1);
                    controller.services.push(angular.copy(controller.selectedService));
                    controller.reference = null;

                    controller.selectedService = null;
                    $('.service-modal').modal('toggle');
                }, function(error) {});
            } else {
                $http.post('/api/servicesadmin', controller.selectedService).then(function(response) {
                    var savedService = response.data;
                    controller.services.push(savedService);
                    controller.reference = null;

                    controller.selectedService = null;
                    $('.service-modal').modal('toggle');
                }, function(error) {});
            }
        };
        controller.addServiceName = function() {
            controller.selectedService.serviceNames.push(controller.serviceName);
            controller.serviceName = '';
        };
        controller.removeServiceName = function(serviceName) {
            var index = controller.selectedService.serviceNames.indexOf(serviceName);
            controller.selectedService.serviceNames.splice(index, 1);
        }
    }
]);