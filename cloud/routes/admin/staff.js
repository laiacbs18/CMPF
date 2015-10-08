(function(){
    var _ = require('underscore');

    var getMethod = function (req, res) {
        var Staff = Parse.Object.extend("Staff");
        var query = new Parse.Query(Staff);
        query.limit(1000);
        query.find({
            success: function (results) {
                var values = _.map(results, function (element) {
                    return {
                        name: element.get("name"),
                        area: element.get("area"),
                        position: element.get("position"),
                        order: element.get("order"),
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
        var Staff = Parse.Object.extend("Staff");
        var query = new Parse.Query(Staff);
        query.get(req.params.staff_id, {
            success: function(staff) {
                staff.destroy({
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
        var Staff = Parse.Object.extend("Staff");
        var query = new Parse.Query(Staff);
        query.get(req.body.id, {
            success: function(staff) {
                staff.set("name", req.body.name);
                staff.set("area", req.body.area);
                staff.set("position", req.body.position);
                staff.set("order", req.body.order);
                staff.save(null, {
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
        var Staff = Parse.Object.extend("Staff");
        var staff = new Staff();
        staff.set("name", req.body.name);
        staff.set("area", req.body.area);
        staff.set("position", req.body.position);
        staff.set("order", req.body.order);
        staff.save(null, {
            success: function(savedStaff) {
                var value = {
                    name: savedStaff.get('name'),
                    area: savedStaff.get('area'),
                    position: savedStaff.get('position'),
                    order: savedStaff.get('order'),
                    id: savedStaff.id
                };
                res.send(200, value);
            },
            error: function(error) {
                console.log(error);
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
