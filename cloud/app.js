// These two lines are required to initialize Express in Cloud Code.
express = require('express');
var _ = require('underscore');
var moment = require('moment');
var config = require('cloud/config.js');
var Mailgun = require('mailgun');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var adminServices = require('cloud/routes/admin/services.js');
var adminSpecialties = require('cloud/routes/admin/specialties.js');
var adminAreas = require('cloud/routes/admin/areas.js');
var adminStaff = require('cloud/routes/admin/staff.js');
var adminContent = require('cloud/routes/admin/content.js');

Mailgun.initialize(config.mailgun.domain, config.mailgun.api);

app = express();
// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.cookieParser(config.cookie.secret));
app.use(parseExpressCookieSession());

app.get('/api/admin', function (req, res){
    var currentUser = Parse.User.current();
    if (currentUser) {
        currentUser.fetch().then(function(user){

            var values = {
                username: user.get('username'),
                id: user.id
            };
            values.parseKeys = {
                appId: config.parseJsKeys.appId,
                jsKey: config.parseJsKeys.jsKey
            };
            res.send(200, values);
        }).fail(function(){
            res.send(401,{});
        });
    } else {
        res.send(401,{});
    }
});

app.post('/api/admin', function (req, res){
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
            res.send(200, user);
        }, function(user, error) {
            res.send(401,{});
        });
});

app.get('/api/admin/logout', function (req, res){
    Parse.User.logOut();
    res.send(200, {});
});

function isAuthenticated(req, res, next) {
    var currentUser = Parse.User.current();
    if (currentUser) {
        return next();
    }
    res.send(401,{});
}

app.get('/api/admin/services', isAuthenticated, adminServices.get);
app.delete('/api/admin/services/:service_id', isAuthenticated, adminServices.delete);
app.put('/api/admin/services', isAuthenticated, adminServices.put);
app.post('/api/admin/services', isAuthenticated, adminServices.post);


app.get('/api/admin/specialties', isAuthenticated, adminSpecialties.get);
app.delete('/api/admin/specialties/:specialty_id', isAuthenticated, adminSpecialties.delete);
app.put('/api/admin/specialties', isAuthenticated, adminSpecialties.put);
app.post('/api/admin/specialties', isAuthenticated, adminSpecialties.post);

app.get('/api/admin/areas', isAuthenticated, adminAreas.get);
app.delete('/api/admin/areas/:area_id', isAuthenticated, adminAreas.delete);

app.get('/api/admin/staff', isAuthenticated, adminStaff.get);
app.delete('/api/admin/staff/:staff_id', isAuthenticated, adminStaff.delete);
app.put('/api/admin/staff', isAuthenticated, adminStaff.put);
app.post('/api/admin/staff', isAuthenticated, adminStaff.post);

app.get('/api/admin/content',isAuthenticated, adminContent.get);
app.put('/api/admin/content',isAuthenticated, adminContent.put);

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



app.get('/api/content', function (req, res) {
    if(_.isUndefined(req.query.area) || req.query.area === ''){
        res.send(400, 'error');
    }else{
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
                var values = result.get('htmlBody');
                res.send(200, values);
            },
            error: function (error) {
                res.send(500, 'error');
            }
        });
    }
});

app.get('/api/staff', function (req, res) {
    var Staff = Parse.Object.extend("Staff");
    var query = new Parse.Query(Staff);
    query.find({
        success: function (results) {
            var values = _.chain(results)
                .map(function (element) {
                    return {
                        name: element.get('name'),
                        position: element.get('position'),
                        area: element.get('area'),
                        order: element.get('order')
                    };
                })
                .value();
            res.send(200, values);
        },
        error: function (error) {
            res.send(500, 'error');
        }
    });
});

app.post('/api/email', function(req, res){

    var body = 'Se ha realizado una peticion de informacion.\r\n' +
                'Contacto:\r\n' +
                'Nombre: ' + req.body.name + '\r\n' +
                'Numero Telefonico: '+ req.body.phone+'\r\n' +
                'Email: ' + (req.body.email || 'vacio') + '\r\n' +
                'Comentario: ' + req.body.comment + '\r\n\r\n\r\n' +
                'Fecha: '+ moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

    Mailgun.sendEmail({
        to: config.mailgun.to,
        from: config.mailgun.from,
        subject: 'Peticion de Informacion',
        text: body
    }, {
        success: function(httpResponse) {
            res.send(200, true);

        },
        error: function(httpResponse) {
            console.log(httpResponse);
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

app.listen();
