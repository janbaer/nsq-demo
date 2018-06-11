const fetch = require('node-fetch');
const nsq = require('nsqjs')
const { flatten, uniqWith, isEqual, random } = require('lodash');

const STATUS_CODE_OK = 200;

async function createWriter(lookupdHTTPAddresses, options) {
  const nsqdConfigs = await getPossibleNSQDServers(lookupdHTTPAddresses);
  if (nsqdConfigs.length === 0) {
    throw new Error('Error -> no NSQD servers found');
  }

  const nsqdConfig = pickRandomConfig(nsqdConfigs);
  return connectTo(nsqdConfig, options);
}

async function getPossibleNSQDServers(lookupdHTTPAddresses) {
  const promises = [];

  for (const lookupdAddress of lookupdHTTPAddresses) {
    promises.push(getNSQDAddressesFromLookupd(lookupdAddress));
  }

  const results = await Promise.all(promises);

  const nsqdConfigs = uniqWith(flatten(results), isEqual);
  console.log(`Found ${nsqdConfigs.length} NSQD servers: ${JSON.stringify(nsqdConfigs)}`);

  return nsqdConfigs;
}

async function getNSQDAddressesFromLookupd(lookupdHTTPAddress) {
  let nsqdConfigs = [];

  const response = await fetch(`http://${lookupdHTTPAddress}/nodes`);
  if (response.status === STATUS_CODE_OK) {
    const config = await response.json();
    nsqdConfigs = config.producers.map(producer => { 
      return { host: producer.broadcast_address, port: producer.tcp_port };
    });
  } else {
    throw new Error(`Could not connect to LOOKUPD server ${lookupdHTTPAddress}`);
  }

  return nsqdConfigs;
}

function connectTo(nsqdConfig, options) {
  return new Promise((resolve, reject) => {
    const writer = new nsq.Writer(nsqdConfig.host, nsqdConfig.port, options);

    writer.connect();

    writer.on('ready', () => {
      console.log(`Connected to NSQD server ${nsqdConfig.host}:${nsqdConfig.port}`);
      resolve(writer);
    });
    writer.on('error', () => reject(new Error(`Error while connect to ${nsqdConfig.host}:${nsqdConfig.port}`)));

    writer.on('close', () => console.log(`Connection to ${nsqdConfig.host}:${nsqdConfig.port} is closed.`));
  });
}

function pickRandomConfig(nsqdConfigs) {
  const randomIndex = random(0, nsqdConfigs.length - 1);
  return nsqdConfigs[randomIndex];
}

module.exports.createWriter = createWriter;
