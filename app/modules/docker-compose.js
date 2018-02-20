const { exec } = require('child_process');
const path = require('path');

/**
 * Create the docker-compose object
 * @param {Object} opts, the options to pass to the docker-compose command
 */
var Compose = function(opts) {
  var self = this;
  this.file = opts.file || '';
  this.projectName = opts.projectName || '';
}

/**
 * Function to run the docker-compose terminal commands
 * @param {String} command, the docker-compose command to execute
 */
Compose.prototype.cmd = function(command, callback) {
  let dcCommand = 'docker-compose ';
  if (this.file !== '') dcCommand += '-f ' + this.file + ' ';
  if (this.projectName !== '') dcCommand += '-p ' + this.projectName + ' ';
  dcCommand += command;
  console.log(dcCommand);
  exec(dcCommand, function(error, stdout, stderr) {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
}

/**
 * Function to pull the docker-compose images
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.pull = function(opts, callback) {
  this.cmd('pull', callback);
}

/**
 * Function to list the docker-compose images
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.images = function(opts, callback) {
  this.cmd('images', callback);
}

/**
 * Function to update the docker-compose containers
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.up = function(opts, callback) {
  this.cmd('up -d', callback);
}


module.exports = Compose;
