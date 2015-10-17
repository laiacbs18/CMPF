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
                when('/admin/content/:section', {
                    templateUrl: 'partials/admin_content.html',
                    controller: 'AdminContentCtrl',
                    controllerAs: 'content',
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
                })
                .when('/admin/equipo-gerencial', {
                    templateUrl: 'partials/admin_equipo_gerencial.html',
                    controller: 'AdminEquipoGerencialCtrl',
                    controllerAs: 'adminEquipoGerencial',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }
                        ]
                    }
                })
                .when('/admin/news', {
                    templateUrl: 'partials/admin_news.html',
                    controller: 'AdminNewsCtrl',
                    controllerAs: 'adminNews',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }]
                    }
                })
                .when('/admin/news/:entryId', {
                    templateUrl: 'partials/admin_news_edit.html',
                    controller: 'AdminNewsEditCtrl',
                    controllerAs: 'adminNews',
                    resolve: {
                        user: ['userService', function (userService) {
                            return userService.getCurrentUser();
                        }]
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
                    controllerAs: 'news'
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
                    templateUrl: 'partials/content.html',
                    controller: 'ContentCtrl',
                    controllerAs: 'content',
                    resolve: {
                        selector: function(){
                            return 'descripcion';
                        }
                    }
                }).
                when('/equipoGerencial', {
                    templateUrl: 'partials/managementTeam.html',
                    controller: 'EquipoGrlCtrl',
                    controllerAs: 'management'
                }).
                when('/marcoFilosofico', {
                    templateUrl: 'partials/content.html',
                    controller: 'ContentCtrl',
                    controllerAs: 'content',
                    resolve: {
                        selector: function(){
                            return 'marcoFilosofico';
                        }
                    }
                }).
                when('/acercaDeNosotros', {
                    templateUrl: 'partials/content.html',
                    controller: 'ContentCtrl',
                    controllerAs: 'content',
                    resolve: {
                        selector: function(){
                            return 'aboutUs';
                        }
                    }
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

    app.config(function($provide){
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', 'fileUploader', function(taRegisterTool, taOptions, fileUploader){
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('fileUpload', {
                iconclass: "fa fa-file-image-o",
                action: function($deferred, restoreSelection){
                    var action = this;
                    fileUploader.onFileSelected = function(){
                        restoreSelection()
                        var imageLink = fileUploader.file;

                        if(imageLink && imageLink !== '' && imageLink !== 'http://'){
                            return action.$editor().wrapSelection('insertImage', imageLink, true);
                        }
                        $deferred.resolve();
                    };

                    fileUploader.showDialog();
                    return false;
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('fileUpload');
            return taOptions;
        }]);
    });

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

    app.service('fileUploader', function(){
        var service = this;
        service.file = undefined;
        service.displayed = false;

        service.onFileSelected = function(){};

        service.showDialog = function(){
            service.displayed = true;
        };

        service.hideDialog = function(){
            service.displayed = false;
        };
    });

    app.directive('fileUploadSelect', ['fileUploader', function(fileUploader){
       return {
           restrict: 'A',
           link: function(scope, element, attrs){
               element.bind("change", function (changeEvent) {
                   if (this.files.length > 0) {
                       var file = this.files[0];
                       var parseFile = new Parse.File(file.name, file);
                       parseFile.save().then(function() {
                           var contentImage = new Parse.Object("ContentImages");
                           contentImage.set("image", parseFile);
                           contentImage.save().then(function(){
                               scope.$apply(function(){
                                   fileUploader.file = parseFile.url();
                                   fileUploader.hideDialog();
                                   fileUploader.onFileSelected();
                               });
                           },function(error){
                           });
                       }, function(error) {
                       });
                   }
               });
           }
       }
    }]);
    app.directive('fileUploaderDialog', ['fileUploader', function(fileUploader) {
        return {
            restrict: 'A',
            templateUrl: 'partials/fileUploadDialog.html',
            link: function(scope, element, attrs){

                scope.$watch(function(){
                    return fileUploader.displayed;
                }, function(){
                    if(fileUploader.displayed) {
                        $('.file-upload-dialog').modal({
                            backdrop: 'static'
                        });
                        $('.file-upload-dialog').on('hide.bs.modal', function (e) {
                            fileUploader.hideDialog();
                        })
                    }else{
                        $('.file-upload-dialog').modal('hide');
                    }
                })

            }
        };
    }]);

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
        this.getCurrentUser = function() {
            return $http.get('/api/admin').then(function (response) {
                Parse.initialize(response.data.parseKeys.appId,response.data.parseKeys.jsKey);
                return response.data;
            });
        }
    }]);

    
    app.controller('GlobalCtrl', ['$location', '$http', function ($location, $http) {
        this.sidebarOpen = false;
        this.isAdmin = function () {
            return $location.path().indexOf('/admin') === 0;
        };

        this.isLogin = function () {
            return $location.path().indexOf('/admin-login') === 0;
        };
        this.logout = function () {
            $http.get('/api/admin/logout').finally(function(){
                $location.path('/');
            });
        };
    }]);


    

    app.controller('HomeCtrl', function() {

    });

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

    app.controller('NewsAndActivitiesCtrl', ['$http','$location', function ($http, $location) {
        var controller = this;
        controller.page = ($location.search().page || 0) * 1;
        $http.get('/api/news?page=' + controller.page).then(function (response) {
            controller.newsList = response.data.list;
            controller.total = response.data.total;
        }, function (error) { });
        controller.next = function(){
            $location.search('page', controller.page + 1);
        };
        controller.previous = function(){
            $location.search('page', controller.page - 1);
        };
    }]);

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
