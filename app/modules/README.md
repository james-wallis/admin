# Docker-compose NPM Module
## Commands
- [x] [build - *Build or rebuild services*](docs/build.md)
- [ ] bundle - *Generate a Docker bundle from the Compose file*
- [ ] config - *Validate and view the Compose file*
- [ ] down - *Stop and remove containers, networks, images, and volumes*
- [ ] events - *Receive real time events from containers*
- [ ] exec - *Execute a command in a running container*
- [ ] images - *List images*
- [ ] kill - *Kill containers*
- [ ] logs - *View output from containers*
- [ ] pause - *Pause services*
- [ ] port - *Print the public port for a port binding*
- [ ] ps - *List containers*
- [ ] pull - *Pull service images*
- [ ] push - *Push service images*
- [ ] restart - *Restart services*
- [ ] rm - *Remove stopped containers*
- [ ] start - *Start services*
- [ ] stop - *Stop services*
- [ ] top - *Display the running processes*
- [ ] unpause - *Unpause services*
- [ ] up - *Create and start containers*
- [ ] version - *Show the Docker-Compose version information*

## Excluded Commands
I've excluded the following docker-compose commands:
+ create - *Create services*, Not included as it is deprecated.
+ help - *Get help on a command*, Help shouldn't be needed.
+ run - *Run a one-off command*, Won't be implementing at the moment as it looks like a much bigger task than the other commands.
+ scale - *Set number of containers for a service*, Not included as it is deprecated.
