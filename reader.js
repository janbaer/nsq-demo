const config = require('config');
const nsq = require('nsqjs')

if (process.argv.length !== 4) {
  console.log('Please pass topic and channel as arguments');
  process.exit(1);
}
const topic = process.argv[2];
const channel = process.argv[3];

console.log(`Subscribing to topic ${topic} on channel ${channel}...`);

const reader = new nsq.Reader(topic, channel, {
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
