var app = angular.module('CMPF');

app.controller('AdminAreasCtrl', ['$http', 'FileUploader', function ($http, FileUploader) {
    var controller = this;
    controller.areas = [];
    controller.selectedAreas = [];

    controller.uploader = new FileUploader({
        url: '/api/admin/areas'
    });

    // FILTERS

    controller.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    controller.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        controller.areas.push(response);
    };

    this.images = [];

    for (var i = 0; i <= 54; i++) {
        this.images.push("img/fotos_tour_virtual/" + i + ".jpg");
    }


    $http.get('/api/admin/areas').then(function (response) {
        controller.areas = response.data;
    }, function (error) { });

    controller.create = function () {
        controller.uploader.clearQueue();
        $('.areas-modal').modal({
            backdrop: 'static'
        });
    };

    var deleteArea = function (area, withSelected) {
        $http.delete('/api/admin/areas/' + area.id).then(function (response) {
            var index = controller.areas.indexOf(area);
            controller.areas.splice(index, 1);
            if (withSelected) {
                controller.toggle(area);
            }

        }, function(error) {
            console.log(error);
        });
    }

    controller.delete = function (area) {
        var response = confirm('Seguro que desea borrar?');
        if (response) {
            deleteArea(area);
        }
    };


    controller.deleteAll = function () {
        var textQuestion = 'Seguro que desea borrar todas las imagenes?';
        var arrayAreas = controller.areas;
        var selected = false;
        if (controller.selectedAreas.length > 0) {
            textQuestion = 'Seguro que desea borrar ' + controller.selectedAreas.length + ' imagenes?';
            arrayAreas = controller.selectedAreas;
            selected = true;
        }

        var responseSelected = confirm(textQuestion);
        if (responseSelected) {
            for (var indexSelected = 0; indexSelected < arrayAreas.length; indexSelected++) {
                var selectedArea = arrayAreas[indexSelected];
                deleteArea(selectedArea, selected);
            }
        }
    };

    controller.isSelected = function(area) {
        return controller.selectedAreas.indexOf(area) >= 0;
    }

    controller.toggle = function (area) {
        var index = controller.selectedAreas.indexOf(area);
        if (index >= 0) {
            controller.selectedAreas.splice(index, 1);
        } else {
            controller.selectedAreas.push(area);
        }
    }
}]);