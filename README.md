# mdns-docker

A tiny script that will provide fuzzy-matched DNS name resolution for docker containers.

## Example

Say you have the following containers running:

```
server
app
cloud-clickhouse-1
transitive-robotics.ros-tool.0.4
```

With this script running you can do

```
ping click.docker.local
```
and it will auto-resolve that name to the IP of the `cloud-clickhouse-1` container.


## Usage

Run this package anywhere using `npx mdns-docker` (`npx` will ask to install the package).



This script allows you do to "ping my-container.docker.local" and it will "just work". The way it does it is by running a local mDNS service that listens to `*.docker.local` requests, finds a running container whose name contains the name (here: "my-container"), get that container's local IP address, and respond to the mDNS query with that IP.

## Example

```sh
# start this service
npx mdns-docker

# Start a ClickHouse service (as an example)
docker run --rm --name myclicky clickhouse:25.7
```

and now open `http://myclick.docker.local:8123" to open the built-in dashboard (there is a short delay) -- no port mapping required!
