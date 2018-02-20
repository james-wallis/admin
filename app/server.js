const Docker = require('dockerode');
const docker = new Docker();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3001;
http.listen(port, function(){
  console.log('listening on ' + port);
});

// Require docker-compose module
const dockerComposeFile = __dirname + '/docker-compose.yaml';
const Compose = require('./modules/docker-compose.js');
const compose = new Compose({
  file: dockerComposeFile
});

// Serve dashboard page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dashboard.html');
});


io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('dc-pull', function() { compose.pull() });
  socket.on('dc-update', function() { compose.up() });
});


// docker.listContainers(function (err, containers) {
//   containers.forEach(function (containerInfo) {
//     console.log(containerInfo);
//   });
// });
