// These two lines are required to initialize Express in Cloud Code.
express = require('express');
var _ = require('underscore');
app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


app.get('/api/services', function (req, res) {

    var Services = Parse.Object.extend("Services");
    var query = new Parse.Query(Services);
    query.find({
        success: function (results) {
            var values = _.chain(results)
                .map(function (element) {
                    return {
                        serviceType: element.get("type"),
                        serviceNames: _.sortBy(element.get("services"), function (x) {
                            return x;
                        })
                    };
                })
                .sortBy('serviceType')
                .map(function (element) {
                    return [element.serviceType, element.serviceNames];
                })
                .object()
                .value();

            res.send(200, values);
        },
        error: function (error) {
            res.send(500, 'error');
        }
    });
});

app.get('/api/specialties', function (req, res) {

    var Specialties = Parse.Object.extend("Specialties");
    var query = new Parse.Query(Specialties);
    query.find({
        success: function (results) {
            var values = _.chain(results)
                .map(function (element) {
                    return {
                        name: element.get("name"),
                        contactNum: element.get("contactNum"),
                        area: element.get("area"),
                        specialty: element.get("specialty")
                    };
                })
                .sortBy('specialty')
                .groupBy('specialty')
                .value();
            res.send(200, values);
        },
        error: function (error) {
            res.send(500, 'error');
        }
    });
});

app.get('/api/areas', function (req, res) {

    var Areas = Parse.Object.extend("Areas");
    var query = new Parse.Query(Areas);
    query.find({
        success: function (results) {
            var values = _.chain(results)
                .map(function (element) {
                    return element.get("image").url();
                })
                .value();
            res.send(200, values);
        },
        error: function (error) {
            res.send(500, 'error');
        }
    });
});

app.get('/', function (req, res) {
    res.render('index');
});

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/*', function (req, res) {
    res.redirect('/');
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
