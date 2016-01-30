var app = angular.module('CMPF');

app.controller("NavigationBarCtrl", [
        "$location", function($location) {
            this.isActive = function(routeName) {
                if (Array.isArray(routeName)) {
                    for (var i = 0; i < routeName.length; i++) {
                        if ($location.path() === routeName[i]) {
                            return true;
                        }
                    }
                    return false;
                }
                return $location.path() === routeName;
            }
        }
    ]);
