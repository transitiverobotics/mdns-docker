#!/usr/bin/env node

/** Script that listens to mDNS queries, fuzzy matches them against running
* docker containers, and responds with the IP of any matched container. */

'use strict';

const mdns = require('multicast-dns')();
const Docker = require('dockerode');
const docker = new Docker();


const IPs = {}; // lookup from container name to IP
const refreshContainerIPs = async (log = false) => {
  const list = await docker.listContainers();
  list.forEach(c => {
    // const name = c.Names[0].slice(1); // remove '/'
    const image = c.Image;
    for (let net in c.NetworkSettings.Networks) {
      if (c.NetworkSettings.Networks[net].IPAddress)
        IPs[image] = c.NetworkSettings.Networks[net].IPAddress;
    }
  });

  log && console.log({IPs});
};

/** Find the best match (or exact match) among container names */
const lookup = (name) => {
  let min = 1e9;
  let argmin;
  Object.keys(IPs).forEach(imageName => {
    const match = imageName.match(name);
    if (match && imageName.length < min) {
      min = imageName.length;
      argmin = IPs[imageName];
    }
  });

  return argmin;
};

const startMDNS = async () => {

  await refreshContainerIPs(true);
  setInterval(refreshContainerIPs, 30 * 1e3);

  mdns.on('query', async (query) => {
    const fqdn = query.questions[0].name.toLowerCase();
    const parts = fqdn.split('.');

    if (parts.slice(-2).join('.') == 'docker.local') {

      const name = parts.slice(0, -2).join('.');
      const IP = lookup(name);
      console.log(name, IP);

      if (IP) mdns.respond({
        answers: [{
          name: fqdn,
          type: 'A',
          ttl: 300,
          data: IP
        }]
      });
    }
  });
};

startMDNS();
