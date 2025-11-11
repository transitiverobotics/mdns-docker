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
