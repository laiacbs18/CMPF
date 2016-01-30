(function(){
    var _ = require('underscore');

    var getMethod = function (req, res) {
        if (_.isUndefined(req.query.area) || req.query.area === '') {
            res.send(400, 'error');
        } else {
            var id;
            switch (req.query.area) {
                case 'aboutUs':
                    id = '3Z1EowfgjM';
                    break;
                case 'marcoFilosofico':
                    id = 'BQCSQ9qQPm';
                    break;
                case 'descripcion':
                    id = 'dcbOkbf7tg';
                    break;
                default:
                    id = '';
            }
            var Content = Parse.Object.extend("Content");
            var query = new Parse.Query(Content);
            query.get(id, {
                success: function (result) {
                    var values = {
                        id: result.id,
                        htmlBody: result.get('htmlBody')
                    };
                    res.send(200, values);
                },
                error: function (error) {
                    res.send(500, 'error');
                }
            });
        }
    };

    var putMethod = function (req, res) {
        var Content = Parse.Object.extend('Content');
        var query = new Parse.Query(Content);
        query.get(req.body.id, {
            success: function (result){
                result.set('htmlBody', req.body.htmlBody);
                result.save(null, {
                    success: function(){
                        res.send(200, true);
                    },
                    error: function(error){
                        res.send(500, 'error');
                    }
                })
            },
            error: function (error){
                res.send(500, 'error');
            }
        })


    };

    module.exports = {
        'get': getMethod,
        'put': putMethod
    };
})();
