const { exec } = require('child_process');
const path = require('path');
const dockerCompose = 'docker-compose ';

/**
 * Create the docker-compose object
 * @param {Object} opts, the options to pass to the docker-compose command
 */
var Compose = function(opts) {
  var self = this;
  if (opts) {
    this.file = opts.file || '';
    this.project_name = opts.project_name || '';
  }
}

/**
 * Function to run the docker-compose terminal commands
 * @param {String} command, the docker-compose command to execute
 * @param {[Strings]} args, (Optional) the list of arguments to add onto the command
 */
Compose.prototype.cmd = function(command, args, callback) {
  let dc = dockerCompose;
  if (this.file !== '' && this.file) dc += '-f ' + this.file + ' ';
  if (this.project_name !== '' && this.project_name) dc += '-p ' + this.project_name + ' ';
  dc += command;
  // If args has content then split it
  if (args.length > 0){
    args = opts.join(' ');
  // else set args to a blank string so it doesn't mess up the command
  } else {
    args = '';
  }
  dc += ` ${args}`;
  if (callback) {
    exec(dc, callback);
  } else {
    exec(dc, (error, stdout, stderr) => {
      if (error) {
        console.error(`docker-compose error: ${error}`);
        return;
      }
      console.log(`docker-compose stdout: ${stdout}`);
      console.log(`docker-compose stderr: ${stderr}`);
    });
  }

}

/**
 * Function to build the docker-compose images
 * @param {Object} opts, Options (optional)
 * @param {Function} callback, A callback function (optional)
 */
Compose.prototype.build = function(opts, callback) {
  // if opts is the callback make callback = opts
  if (typeof opts === 'function') callback = opts;
  let args = [];
  if (opts && opts.force_rm) args.push('--force-rm');
  if (opts && opts.no_cache) args.push('--no-cache');
  if (opts && opts.pull) args.push('--pull');
  if (opts && opts.memory) args.push(`--memory=${opts.memory}`);
  if (opts && opts.build_args) {
    for (field in opts.build_args) {
      args.push(`--build-arg ${field}=${opts.build_args[field]}`);
    }
  }
  this.cmd('build', args, callback);
}

/**
 * Function to bundle the docker-compose
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --push-images         Automatically push images for any services
 *                       which have a `build` option specified.
 * -o, --output PATH     Path to write the bundle file to.
 *                       Defaults to "<project name>.dab".
 */
Compose.prototype.bundle = function(opts, callback) {
  this.cmd('bundle', opts, callback);
}

/**
 * Function to validate and view the docker-compose file
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --resolve-image-digests  Pin image tags to digests.
 * -q, --quiet              Only validate the configuration, don't print
 *                          anything.
 * --services               Print the service names, one per line.
 * --volumes                Print the volume names, one per line.
 */
Compose.prototype.config = function(opts, callback) {
  this.cmd('config', opts, callback);
}

/**
 * Function to stop and remove containers, networks, images, and volumes
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --rmi type              Remove images. Type must be one of:
 *                         'all': Remove all images used by any service.
 *                         'local': Remove only images that don't have a
 *                         custom tag set by the `image` field.
 * -v, --volumes           Remove named volumes declared in the `volumes`
 *                         section of the Compose file and anonymous volumes
 *                         attached to containers.
 * --remove-orphans        Remove containers for services not defined in the
 *                         Compose file
 * -t, --timeout TIMEOUT   Specify a shutdown timeout in seconds.
 *                         (default: 10)
 */
Compose.prototype.down = function(opts, callback) {
  // if opts is the callback make callback = opts
  if (typeof opts === 'function') callback = opts;
  let args = [];
  if (opts && opts.rmi) args.push(`--rmi ${opts.rmi}`);
  if (opts && opts.volumes) args.push('--volumes');
  if (opts && opts.remove_orphans) args.push('--remove-orphans');
  if (opts && opts.timeout) args.push(`--timeout ${opts.timeout}`);
  this.cmd('down', args, callback);
}

/**
 * Function to receive real time events from containers
 * @param {String} service, the service name to get the event for
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.events = function(service, opts, callback) {
  let command = 'events --json ' + service;
  this.cmd(command, opts, callback);
}

/**
 * Function to execute a command in a running container
 * @param {String} exec, the command to execute
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * -d                Detached mode: Run command in the background.
 * --privileged      Give extended privileges to the process.
 * -u, --user USER   Run the command as this user.
 * -T                Disable pseudo-tty allocation. By default `docker-compose exec`
 *                   allocates a TTY.
 * --index=index     index of the container if there are multiple
 *                   instances of a service [default: 1]
 * -e, --env KEY=VAL Set environment variables (can be used multiple times,
 *                   not supported in API < 1.25)
 */
Compose.prototype.exec = function(exec, opts, callback) {
  let command = 'exec ' + exec;
  this.cmd(command, opts, callback);
}

/**
 * Function list images used by created containers
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * -q     Only display IDs
 */
Compose.prototype.images = function(opts, callback) {
  this.cmd('images', opts, callback);
}

/**
 * Function to kill containers
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * -s SIGNAL         SIGNAL to send to the container.
 *                   Default signal is SIGKILL.
 */
Compose.prototype.kill = function(opts, callback) {
  this.cmd('kill', opts, callback);
}

/**
 * Function to view the output of containers
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 *  --no-color          Produce monochrome output.
 *  -f, --follow        Follow log output.
 *  -t, --timestamps    Show timestamps.
 *  --tail="all"        Number of lines to show from the end of the logs
 *                      for each container.
 */
Compose.prototype.logs = function(opts, callback) {
  this.cmd('logs', opts, callback);
}

/**
 * Function to pause services
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.pause = function(opts, callback) {
  this.cmd('pause', opts, callback);
}

/**
 * Function to get the public port for a port binding
 * @param {String} service, the service to use
 * @param {Int} port, the private port inside the container
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --protocol=proto  tcp or udp [default: tcp]
 *  --index=index    index of the container if there are multiple
 *                   instances of a service [default: 1]
 */
Compose.prototype.port = function(service, port, opts, callback) {
  this.cmd('port', opts, callback);
}

/**
 * Function to list containers
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 *  -q    Only display IDs
 */
Compose.prototype.ps = function(opts, callback) {
  this.cmd('ps', opts, callback);
}

/**
 * Function to pull images for services defined in the docker-compose file
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --ignore-pull-failures  Pull what it can and ignores images with pull failures.
 * --parallel              Pull multiple images in parallel.
 * --quiet                 Pull without printing progress information
 */
Compose.prototype.pull = function(opts, callback) {
  this.cmd('pull', opts, callback);
}

/**
 * Function to push images for a service
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --ignore-push-failures  Push what it can and ignores images with push failures.
 */
Compose.prototype.push = function(opts, callback) {
  this.cmd('push', opts, callback);
}

/**
 * Function to restart running containers
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * -t, --timeout TIMEOUT      Specify a shutdown timeout in seconds.
 *                            (default: 10)
 */
Compose.prototype.restart = function(opts, callback) {
  this.cmd('restart', opts, callback);
}

/**
 * Function to remove stopped containers
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * -f, --force   Don't ask to confirm removal - this should be default for headless
 * -s, --stop    Stop the containers, if required, before removing
 * -v            Remove any anonymous volumes attached to containers
 */
Compose.prototype.rm = function(opts, callback) {
  this.cmd('rm', opts, callback);
}

/**
 * Function to start existing containers
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.start = function(opts, callback) {
  this.cmd('start', opts, callback);
}

/**
 * Function to stop running containers without removing them
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * -t, --timeout TIMEOUT      Specify a shutdown timeout in seconds.
 *                            (default: 10)
 */
Compose.prototype.stop = function(opts, callback) {
  this.cmd('stop', opts, callback);
}

/**
 * Function to get the running processes
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.top = function(opts, callback) {
  this.cmd('top', opts, callback);
}

/**
 * Function to unpause services
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 */
Compose.prototype.unpause = function(opts, callback) {
  this.cmd('unpause', opts, callback);
}

/**
 * Function which builds, (re)creates, starts, and attaches to containers for a service.
 * Note: pass service name through as an option as its optional
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 *  -d                        Detached mode: Run containers in the background,
 *                            print new container names. Incompatible with
 *                            --abort-on-container-exit and --timeout.
 * --no-color                 Produce monochrome output.
 * --no-deps                  Don't start linked services.
 * --force-recreate           Recreate containers even if their configuration
 *                            and image haven't changed.
 *                            Incompatible with --no-recreate.
 * --no-recreate              If containers already exist, don't recreate them.
 *                            Incompatible with --force-recreate.
 * --no-build                 Don't build an image, even if it's missing.
 * --no-start                 Don't start the services after creating them.
 * --build                    Build images before starting containers.
 * --abort-on-container-exit  Stops all containers if any container was stopped.
 *                            Incompatible with -d.
 * -t, --timeout TIMEOUT      Use this timeout in seconds for container shutdown
 *                            when attached or when containers are already.
 *                            Incompatible with -d.
 *                            running. (default: 10)
 * --remove-orphans           Remove containers for services not
 *                            defined in the Compose file
 * --exit-code-from SERVICE   Return the exit code of the selected service container.
 *                            Implies --abort-on-container-exit.
 * --scale SERVICE=NUM        Scale SERVICE to NUM instances. Overrides the `scale`
 *                            setting in the Compose file if present.
 */
Compose.prototype.up = function(opts, callback) {
 this.cmd('up -d', opts, callback);
}

/**
 * Function to get the docker-compose version
 * @param {Object} opts, Options (optional)
 * @param {Function} callback
 *
 * Command line options:
 * --short     Shows only Compose's version number.
 */
Compose.prototype.version = function(opts, callback) {
  this.cmd('version', opts, callback);
}

module.exports = Compose;
