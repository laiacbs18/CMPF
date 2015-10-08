(function(){
    var _ = require('underscore');

    var getMethod = function (req, res) {
        var Areas = Parse.Object.extend("Areas");
        var query = new Parse.Query(Areas);
        query.limit(1000);
        query.find({
            success: function (results) {
                var values = _.map(results, function (element) {
                    return {
                        url: element.get("image").url(),
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
        var Areas = Parse.Object.extend("Areas");
        var query = new Parse.Query(Areas);
        query.get(req.params.area_id, {
            success: function(area) {
                area.destroy({
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

    module.exports = {
        'get': getMethod,
        'delete': deleteMethod
    };
})();
