(function() {
    var app = angular.module('CMPF', ['ngRoute', 'angularFileUpload', 'textAngular']);

    app.config([
        '$locationProvider', function($locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix('!');
        }
    ]);

    app.config([
        '$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/admin-dashboard', {
                    templateUrl: 'partials/admin_dashboard.html',
                    controller: 'AdminDashboardCtrl',
                    controllerAs: 'adminDashboard',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }
                        ]
                    }
                }).
                when('/admin/quienes-somos', {
                    templateUrl: 'partials/admin_quienes_somos.html',
                    controller: 'AdminQuienesSomosCtrl',
                    controllerAs: 'adminQuienesSomos',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }
                        ]
                    }
                }).
                when('/admin/servicios', {
                    templateUrl: 'partials/admin_services.html',
                    controller: 'AdminServicesCtrl',
                    controllerAs: 'adminServices',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }
                        ]
                    }
                }).
                when('/admin/especialidades', {
                    templateUrl: 'partials/admin_specialties.html',
                    controller: 'AdminSpecialtiesCtrl',
                    controllerAs: 'adminSpecialties',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }
                        ]
                    }
                }).
                when('/admin/areas', {
                    templateUrl: 'partials/admin_areas.html',
                    controller: 'AdminAreasCtrl',
                    controllerAs: 'adminAreas',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }
                        ]
                    }
                }).
                when('/admin-login', {
                    templateUrl: 'partials/admin_login.html',
                    controller: 'AdminLoginCtrl',
                    controllerAs: 'adminLogin',
                    resolve: {
                        isLoggedIn: ['userService', '$q', function (userService, $q) {
                            var defer = $q.defer();

                            userService.getCurrentUser().then(function () {
                                defer.reject({ status: 202 });
                            }, function () {
                                defer.resolve(false);
                            });

                            return defer.promise;
                            
                        }
                        ]
                    }
                }).
                when('/contacto', {
                    templateUrl: 'partials/contact.html',
                    controller: 'ContactCtrl',
                    controllerAs: 'contact'
                }).
                when('/noticiasyactividades', {
                    templateUrl: 'partials/news_and_activities.html',
                    controller: 'NewsAndActivitiesCtrl',
                    controllerAs: 'newsandactivities'
                }).
                when('/areas', {
                    templateUrl: 'partials/areas.html',
                    controller: 'AreaCtrl',
                    controllerAs: 'areas'
                }).
                when('/especialidades', {
                    templateUrl: 'partials/specialties.html',
                    controller: 'SpecialtiesCtrl',
                    controllerAs: 'specialty'
                }).
                when('/servicios', {
                    templateUrl: 'partials/services.html',
                    controller: 'ServicesCtrl',
                    controllerAs: 'service'
                }).
                when('/descripcion', {
                    templateUrl: 'partials/description.html',
                    controller: 'DescriptionCtrl',
                    controllerAs: 'description'
                }).
                when('/equipoGerencial', {
                    templateUrl: 'partials/managementTeam.html',
                    controller: 'EquipoGrlCtrl',
                    controllerAs: 'management'
                }).
                when('/marcoFilosofico', {
                    templateUrl: 'partials/context.html',
                    controller: 'ContextCtrl',
                    controllerAs: 'philosophicalFramework'
                }).
                when('/acercaDeNosotros', {
                    templateUrl: 'partials/about_us.html',
                    controller: 'AboutCtrl',
                    controllerAs: 'aboutUs'
                }).
                when('/', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: "home"
                }).
                otherwise({
                    redirectTo: "/"
                });
        }
    ]);

    app.run([
        '$rootScope', '$location', function($rootScope, $location) {
            $rootScope.$on("$routeChangeError", function (ev, route, other, error) {
                if (error.status === 401) {
                    $location.path('/admin-login');
                } else if (error.status === 202) {
                    $location.path('/admin-dashboard');
                }
            });
        }
    ]);

    app.directive('metisMenu', function() {
        return {
            restrict: 'A',
            link: function(s, element) {
                $(element).metisMenu();
            }
        };
    });

    app.directive('ngThumb', ['$window', function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);

    app.service("userService", ['$http', function ($http) {
        var sessionToken;

        this.setCurrentUser = function (token) {
            sessionToken = token;
        }

        this.getCurrentUser = function() {
            return $http.get('/api/admin', { headers: { "X-Session-Token": sessionToken } }).then(function (response) {
                return response.data;
            });
        }
    }]);

    
    app.controller('GlobalCtrl', ['$location', function ($location) {
        this.isAdmin = function () {
            return $location.path().indexOf('/admin') === 0;
        }

        this.isLogin = function () {
            return $location.path().indexOf('/admin-login') === 0;
        }
    }]);


    

    app.controller('HomeCtrl', function() {

    });

    

    app.controller('ContextCtrl', function() {

    });


    app.controller('DescriptionCtrl', function() {

    });

    app.controller('AdminQuienesSomosCtrl', function () {

    });



    app.controller('AdminAreasCtrl', ['$http', 'FileUploader', function ($http, FileUploader) {
        var controller = this;
        controller.areas = [];
        controller.selectedAreas = [];

        controller.uploader = new FileUploader({
            url: '/api/areasadmin'
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


        $http.get('/api/areasadmin').then(function (response) {
            controller.areas = response.data;
        }, function (error) { });

        controller.create = function () {
            controller.uploader.clearQueue();
            $('.areas-modal').modal({
                backdrop: 'static'
            });
        };

        var deleteArea = function (area, withSelected) {
            $http.delete('/api/areasadmin/' + area.id).then(function (response) {
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

    //from here up
    
    app.controller('SpecialtiesCtrl', ['$http', function($http) {
        var controller = this;
        $http.get('/api/specialties').then(function (response) {
            controller.specialties = response.data;
        }, function (error) { });
    }]);

    app.controller('AreaCtrl', ['$http', function ($http) {
        var controller = this;
        controller.images = [];

        controller.selectImage = function (image) {
            controller.selectedImage = image;
            document.body.scrollTop = 63;
        }

        $http.get('/api/areas').then(function(response) {
            controller.images = response.data;
            if (controller.images.length > 0) {
                controller.selectedImage = controller.images[0];
            } else {
                controller.selectedImage = '';
            }
        });
    }]);

    app.controller('NewsAndActivitiesCtrl', function () {

    });

    app.controller('SpecialtiesCtrl', ['$http', function($http) {

        var controller = this;
        $http.get('/api/specialties').then(function (response) {
            controller.specialties = response.data;
        }, function (error) { });
    }]);

    app.controller('ContactCtrl', ['$http', function($http) {
        var controller = this;

        this.form = {
        
        };
        this.submitForm = function() {
            if (this.formValidator.$invalid) {
                return;
            }

            $http.post('/api/email', controller.form).
              then(function (response) {
                    alert("Correo enviado.");
                }, function (response) {
                    alert("Se a producido un error en la peticion.");
              });
        };


        function initialize() {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'placeId': 'ChIJb-p0f50ssI4RNzIJuGD6Rq4' }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var mapOptions = {
                        center: results[0].geometry.location,
                        zoom: 18
                    };
                    var map = new google.maps.Map(document.getElementById('map-canvas'),
                        mapOptions);

                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });

        }

        initialize();
    }]);
})();
