(function(){
    var _ = require('underscore');

    var getMethod = function (req, res) {
        var Specialties = Parse.Object.extend("Specialties");
        var query = new Parse.Query(Specialties);
        query.limit(1000);
        query.find({
            success: function (results) {
                var values = _.map(results, function (element) {
                    return {
                        area: element.get("area"),
                        contactNum: element.get("contactNum"),
                        name: element.get("name"),
                        specialty: element.get("specialty"),
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
        var Specialties = Parse.Object.extend("Specialties");
        var query = new Parse.Query(Specialties);
        query.get(req.params.specialty_id, {
            success: function(specialty) {
                specialty.destroy({
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
        var Specialties = Parse.Object.extend("Specialties");
        var query = new Parse.Query(Specialties);
        query.get(req.body.id, {
            success: function(specialty) {
                specialty.set("area", req.body.area);
                specialty.set("contactNum", req.body.contactNum);
                specialty.set("name", req.body.name);
                specialty.set("specialty", req.body.specialty);
                specialty.save(null, {
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
        var Specialties = Parse.Object.extend("Specialties");
        var specialty = new Specialties();
        specialty.set("area", req.body.area);
        specialty.set("contactNum", req.body.contactNum);
        specialty.set("name", req.body.name);
        specialty.set("specialty", req.body.specialty);
        specialty.save(null, {
            success: function(savedSpecialty) {
                var value = {
                    area: savedSpecialty.get('area'),
                    contactNum: savedSpecialty.get('contactNum'),
                    name: savedSpecialty.get('name'),
                    specialty: savedSpecialty.get('specialty'),
                    id: savedSpecialty.id
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
