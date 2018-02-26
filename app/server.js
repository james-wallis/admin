const Docker = require('dockerode');
const docker = new Docker();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.cookieParser());
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

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

// Globals
var scanInterval;
var scanning = false;
var dockerImages = [];
var dockerInfo = {};
var content = {
  images: '',
  containers: '',
  system: ''
};

// Serve dashboard page
app.get('/', function(req, res) {
  // if (req.cookies.dashboard_authenticated) {
  // // check valid cookie and send dashboard
  //  res.sendFile(__dirname + '/dashboard.html');
  // } else {
  // // Need to create cookie
  // Create cookie, create random string, add it to the cookie list - helps verify that I've set the cookie
  // }
  res.sendFile(__dirname + '/dashboard.html');
});

// Redirect to single page
app.all('*', function(req, res) {
  res.redirect("/");
});


io.on('connection', function(socket) {
  console.log('a user connected');
  shouldIScan(io.engine.clientsCount);
  socket.on('disconnect', function(){
    console.log('user disconnected');
    shouldIScan(io.engine.clientsCount);
  });
  send();
  socket.on('dc-pull', function() { compose.pull() });
  socket.on('dc-update', function() { compose.up() });
  socket.on('dc-restart', function() { compose.restart() });
});

// Function to decide whether to scan Docker depending on the amount of users
function shouldIScan(noUsers) {
  let seconds = 30;
  let milliseconds = seconds * 1000;
  console.log('Number of users: ' + noUsers);
  if (noUsers > 0 && scanning == false) {
    scanInterval = setInterval(scan, milliseconds);
    scanning = true;
    scan();
  } else if (noUsers == 0) {
    clearInterval(scanInterval);
    return;
  }
  send();
}

// Function to set off the functions below and set a timer to do it again
function scan() {
  getDockerImages();
  getDockerInfo();
  getDockerContainers();
  send();
}

function send() {
  io.emit('dashboard', content);
}

// Get Docker images
// Only scan on page load
function getDockerImages() {
  let tempImages = [];
  docker.listImages(function(err, images) {
    // console.log(images);
    for (let i = 0; i < images.length; i++) {
      docker.getImage(images[i].Id).inspect(function(err, data) {
        let image = {
          id: i,
          names: data.RepoTags,
          creation: data.Created,
          size: data.Size
        }
        tempImages.push(image);
        // If lists are the same size we're all good to go
        if (tempImages.length == images.length) {
          // Put data back into order
          tempImages.sort(function(a, b) {
            var x = a['id']; var y = b['id'];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
          content.images = tempImages;
        }
      });
    }
  });
}

// Get information about the Docker system
// Only scan on page load so we get the most up to date containers running
function getDockerInfo() {
  docker.info(function(err, info) {
    dockerInfo = {
      containers: info.Containers,
      containersRunning: info.ContainersRunning,
      containersPaused: info.ContainersPaused,
      containersStopped: info.ContainersStopped,
      images: info.Images,
      version: info.ServerVersion,
      time: info.SystemTime,
      cpu: info.NCPU,
      mem: info.MemTotal,
      os: info.OperatingSystem
    }
    content.system = dockerInfo;
  });
}

// Get running Docker containers
function getDockerContainers() {
  docker.listContainers({all: true}, function (err, containers) {
    let tempList = [];
    for (let i = 0; i < containers.length; i++) {
      let cont = docker.getContainer(containers[i].Id);
      cont.inspect(function(err, data) {
        let name = data.Name;
        name = name.replace('/','');
        let container = {
          id: i,
          name: name,
          creation: data.Created,
          status: data.State.Status
        }
        tempList.push(container);
        // If lists are the same size we're all good to go
        if (tempList.length == containers.length) {
          // Put data back into order
          tempList.sort(function(a, b) {
            var x = a['id']; var y = b['id'];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
          content.containers = tempList;
        }
      });
    }
  });
}


// Initial scan
scan();
