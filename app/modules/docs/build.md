# docker-compose build

Build or rebuild services.

For more information see the [docker-compose docs](https://docs.docker.com/compose/reference/build/).

**Parameters**
* opts, Options (optional)
* callback, A callback function (optional)

**Supported options (docker-compose command line arguments)**
* --force-rm, *Always remove intermediate containers.*
* --no-cache, *Do not use cache when building the image.*
* --pull, *Always attempt to pull a newer version of the image.*
* -m, --memory MEM, *Sets memory limit for the build container.*
* --build-arg key=val, *Set build-time variables for one service.*

## Examples

### Simple
```
const Compose = require('docker-compose');
const compose = new Compose();

compose.build();
```

### With options
```
const Compose = require('docker-compose');
const compose = new Compose({
  file: 'my-docker-compose-file.yaml',
  project_name: 'my_project'
});

let options = {
   force_rm: true,
   no_cache: true,
   pull: true,
   memory: 400,
   build_args: {
     field: value,
     field: value
   }
}
compose.build(options);
```

### With callback
```
const Compose = require('docker-compose');
const compose = new Compose();

compose.build(function(err) {
  console.error(err);
});
```
