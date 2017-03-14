//main variables for the page to show
var express		= require('express'),
	app			= express(),
	server		= require('http').createServer(app);
var bodyParser	= require('body-parser');
var path		= require('path');
var mongoose	= require('mongoose');
var session 	= require('express-session');
//for the mongodb
require('./db/db');
//sets the static up, allowing the page to connect anything in the public folder
app.use(express.static(path.join(__dirname, 'public')));
//sets what you are seeing, and the engine to handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function(req, res){
	res.render('confessionsPage')
})

app.use(session({
	secret: " this is our secret salt",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}))

//express framework node.js syntax
var authenticateRoute = function(request, response, next){
	if(request.originalUrl === '/registerLogin' || request.originalUrl === '/registerLogin'){
		next()
	}
		else {
			if(!request.session.loggedIn){
				response.redirect('/registerLogin')
			}else{
				next()
			}
		}
	}

app.use(authenticateRoute); //set this before controller!!!! It will run first!!!

var UserController = require('./controllers/UserController');
var ConfessionsController = require('./controllers/ConfessionsController');


app.get('/registerLogin', function(req, res){
	res.render('registerLogin')
}) //this will grab the registerLogin page when the address is made

app.use('/', UserController);
app.use('/confessionsPage', ConfessionsController);

//this is where the server is being shown 
server.listen(3000, function(){
	console.log('yup, server is listening on port 3000');
});