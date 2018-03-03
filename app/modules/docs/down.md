# docker-compose down

Stops containers and removes containers, networks, volumes, and images created by up.

For more information see the [docker-compose docs](https://docs.docker.com/compose/reference/down/).

**Parameters**
* opts, Options (optional)
* callback, A callback function (optional)

**Supported options (docker-compose command line arguments)**
* --rmi type              Remove images.
* -v, --volumes           Remove named volumes.
* --remove-orphans        Remove containers.
* -t, --timeout TIMEOUT   Specify a shutdown timeout in seconds.

## Examples

### Simple
```
const Compose = require('docker-compose');
const compose = new Compose();

compose.down();
```

### With options
```
const Compose = require('docker-compose');
const compose = new Compose({
  file: 'my-docker-compose-file.yaml',
  project_name: 'my_project'
});

let options = {
   rmi: 'all',
   volumes: true,
   remove_orphans: true,
   timeout: 40
}
compose.down(options);
```

### With callback
```
const Compose = require('docker-compose');
const compose = new Compose();

compose.down(function(err) {
  console.error(err);
});
```
