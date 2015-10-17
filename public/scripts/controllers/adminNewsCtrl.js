var app = angular.module('CMPF');

app.controller('AdminNewsEditCtrl',['$http','$location','$routeParams', function($http, $location, $routeParams){
    var controller = this;
    if($routeParams.entryId == 'new'){
        controller.entry = {
            title: '',
            body: ''
        };
    }else {
        $http.get('/api/admin/news/' + $routeParams.entryId).then(function (response) {
            controller.entry = response.data;
        }, function (error) {
        });
    }

    controller.save = function() {
        if (typeof(controller.entry.id) === 'undefined' || controller.entry.id == null  || controller.entry.id === '') {
            $http.post('/api/admin/news', controller.entry).then(function() {
                $location.path('/admin/news')
            }, function(error) {});
        } else {
            $http.put('/api/admin/news', controller.entry).then(function() {
                $location.path('/admin/news')
            }, function(error) {});
        }
    };
    controller.cancel = function() {
        $location.path('/admin/news')
    };
}]);

app.controller('AdminNewsCtrl', [
    '$http', '$location', function($http, $location) {
        var controller = this;
        $http.get('/api/admin/news').then(function(response) {
            controller.news = response.data;
        }, function(error) {});

        controller.delete = function(entry) {
            var response = confirm('Seguro que desea borrar "' + entry.title + '"?');
            if (response) {
                $http.delete('/api/admin/news/' + entry.id).then(function(response) {
                    var index = controller.news.indexOf(entry);
                    controller.news.splice(index, 1);
                }, function(error) {});
            }
        };

        controller.edit = function(entry) {
            $location.path('/admin/news/' + entry.id);
        };

        controller.create = function() {
            $location.path('/admin/news/new');
        };
    }
]);