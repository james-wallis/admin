# docker-compose config

Validate and view the docker-compose file.

For more information see the [docker-compose docs](https://docs.docker.com/compose/reference/config/).

**Parameters**
* opts, Options (optional)
* callback, A callback function (optional) - Recommended to get feedback

**Supported options (docker-compose command line arguments)**
* --resolve-image-digests, *Pin image tags to digests.*
* -q, --quiet, *Only validate the configuration, don't print anything.*
* --services, *Print the service names, one per line.*
* --volumes, *Print the volume names, one per line.*

## Examples

### Simple
```
const Compose = require('docker-compose');
const compose = new Compose();

// Prints an error to the terminal is your docker-compose file isn't valid
// If it is then it will print the docker-compose file to the terminal
compose.config();
```

### With options
```
const Compose = require('docker-compose');
const compose = new Compose({
  file: 'my-docker-compose-file.yaml',
  project_name: 'my_project'
});

let options = {
   services: true
}
// Will print a list of the services in your docker-compose file to the terminal
compose.config(options);
```

### With callback
```
const Compose = require('docker-compose');
const compose = new Compose();

// file will be your docker-compose file in json.
compose.config(function(err, file) {
  console.error(err);
  console.log(file);
});
```

### With callback + options
```
const Compose = require('docker-compose');
const compose = new Compose();

let options = {
   services: true
}
// services will be a list of the services in your docker-compose file
compose.config(function(err, services) {
  console.error(err);
  console.log(services);
});
```
