const config = require('config');
const nsq = require('nsqjs')

let channel = config.channel;
if (process.argv.length > 2) {
  channel = process.argv[2];
}

console.log(`Subscribing to topic ${config.topic} on channel ${channel}...`);

const reader = new nsq.Reader(config.topic, channel, {
  lookupdHTTPAddresses: config.lookupdHTTPAddresses
})

reader.connect()

reader.on('message', msg => {
  const messageText = msg.body.toString();
  console.log(`Received message [${msg.id}], attempts: ${msg.attempts}, body: ${messageText}`);
  const result = handleMessage(msg);
  if (result) {
    msg.finish()
  } else {
    msg.requeue(5000, true);
  }
})

function handleMessage(msg) {
  if (msg.body.toString().startsWith('requeue') && msg.attempts === 1) {
    return false;
  }
  return true;
}
