(function(){
    var _ = require('underscore');

    var getMethod = function (req, res) {
        var Services = Parse.Object.extend("Services");
        var query = new Parse.Query(Services);
        query.limit(1000);
        query.find({
            success: function (results) {
                var values = _.map(results, function (element) {
                    return {
                        type: element.get("type"),
                        serviceNames: element.get("services") || [],
                        id: element.id
                    };
                });
                res.send(200, values);
            },
            error: function (error) {
                res.send(500, 'error');
            }
        });
    };

    var deleteMethod = function (req, res){
        var Services = Parse.Object.extend("Services");
        var query = new Parse.Query(Services);
        query.get(req.params.service_id, {
            success: function(service) {
                service.destroy({
                    success: function() {
                        res.send(200, true);
                    },
                    error: function() {
                        res.send(500, 'error');
                    }
                });
            },
            error: function() {
                res.send(500, 'error');
            }
        });
    };

    var putMethod = function (req, res){
        var Services = Parse.Object.extend("Services");
        var query = new Parse.Query(Services);
        query.get(req.body.id, {
            success: function(service) {
                service.set("type", req.body.type);
                service.set("services", req.body.serviceNames || []);
                service.save(null, {
                    success: function() {
                        res.send(200, true);
                    },
                    error: function() {
                        res.send(500, 'error');
                    }
                });
            },
            error: function() {
                res.send(500, 'error');
            }
        });
    };

    var postMethod = function (req, res){
        var Services = Parse.Object.extend("Services");
        var service = new Services();
        service.set("type", req.body.type);
        service.set("services", req.body.serviceNames || []);
        service.save(null, {
            success: function(savedService) {
                var value = {
                    type: savedService.get('type'),
                    serviceNames: savedService.get('serviceNames') || [],
                    id: savedService.id
                };
                res.send(200, value);
            },
            error: function() {
                res.send(500, 'error');
            }
        });
    };

    module.exports = {
        'get': getMethod,
        'delete': deleteMethod,
        'put': putMethod,
        'post': postMethod
    };
})();
