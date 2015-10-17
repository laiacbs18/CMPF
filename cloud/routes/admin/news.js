(function(){
    var _ = require('underscore');

    var getMethod = function (req, res) {
        if(_.isUndefined(req.params.news_id) || _.isEmpty(req.params.news_id)) {
            var News = Parse.Object.extend("News");
            var query = new Parse.Query(News);
            query.limit(1000);
            query.include("author");
            query.find({
                success: function (results) {
                    var values = _.map(results, function (element) {
                        return {
                            title: element.get("title"),
                            body: element.get("body"),
                            date: element.createdAt,
                            author: {
                                name: element.get("author").get("name"),
                                id: element.get("author").id,
                                email: element.get("author").get("email")
                            },
                            id: element.id
                        };
                    });
                    res.send(200, values);
                },
                error: function (error) {
                    res.send(500, 'error');
                }
            });
        }else{
            var News = Parse.Object.extend("News");
            var query = new Parse.Query(News);
            query.include('author')
            query.get(req.params.news_id, {
                success: function(element) {
                    var value = {
                        title: element.get("title"),
                        body: element.get("body"),
                        date: element.createdAt,
                        author: {
                            name: element.get("author").get("name"),
                            id: element.get("author").id,
                            email: element.get("author").get("email")
                        },
                        id: element.id
                    };
                    res.send(200, value);
                },
                error: function() {
                    res.send(500, 'error');
                }
            });
        }
    };

    var putMethod = function (req, res) {
        var News = Parse.Object.extend('News');
        var query = new Parse.Query(News);
        query.get(req.body.id, {
            success: function (result){
                result.set('body', req.body.body);
                result.set('title', req.body.title);
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

    var deleteMethod = function (req, res){
        var News = Parse.Object.extend("News");
        var query = new Parse.Query(News);
        query.get(req.params.news_id, {
            success: function(element) {
                element.destroy({
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
        var News = Parse.Object.extend("News");
        var news = new News();
        news.set("title", req.body.title);
        news.set("body", req.body.body);
        news.set("author", Parse.User.current());
        news.save(null, {
            success: function(savedNews) {
                savedNews.get("author").fetch({
                    success: function(author) {
                        var value = {
                            title: savedNews.get("title"),
                            body: savedNews.get("body"),
                            date: savedNews.createdAt,
                            author: {
                                name: author.get("name"),
                                id: author.id,
                                email: author.get("email")
                            },
                            id: savedNews.id
                        };
                        res.send(200, value);
                    },
                    error: function(myObject, error) {
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
        'delete': deleteMethod,
        'put': putMethod,
        'post': postMethod
    };
})();
