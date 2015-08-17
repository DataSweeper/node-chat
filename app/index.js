var nr = require('newrelic')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require( 'body-parser' );
var models = require( './models.js' );

/*app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});*/

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.get('/', function(req, res) {
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/login.html');
});

app.get('/tamil', function(req, res){
  res.sendFile(__dirname + '/tamil.html');
});

app.post ( '/login', function ( req, res ) {
   //res.send('Got a POST request name : ' + req.body.acct + ' passwd ' + req.body.pw + ' submit : ' + req.body.button );  
  if ( req.body.button == "create" ) {
    models.Users.findOrCreate({where: {username : req.body.acct}, defaults: { password : req.body.pw}}).spread(function(user, created) {
    if ( created ) {
      res.sendFile(__dirname + '/index.html');
    }
    else {
      res.send ( "Try some other UserName!!! " );
    }
   });
  }
  else {
    models.Users.findOne({ where : {username : req.body.acct} }).then(function(users) {
      if ( users.password == req.body.pw ) {
        res.sendFile(__dirname + '/index.html');
      }
      else {
        res.send ("User Name or Password is incorrect!!!");
      }
    });
  }
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('chat message', 'a user connected.');
  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.broadcast.emit('chat message', 'a user disconnected.');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', nr.createWebTransaction('/msg', function (msg) {
    console.log('message: ' + msg);
   nr.endTransaction();
  }));
});

io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
