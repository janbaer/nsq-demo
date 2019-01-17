const config = require('config');
const nsq = require('nsqjs')

const { createWriter } = require('./helpers/connector.js');

if (process.argv.length !== 4) {
  console.log('Please pass topic and message as arguments');
  process.exit(1);
}

const topic = process.argv[2];
const message = process.argv[3];

function publish(writer, topic, message) {
  return new Promise((resolve, reject) => {
    writer.publish(topic, message,  err => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Message sent successfully')
      writer.close()
    })
  });
}

(async () => {
  try {
    const writer = await createWriter(config.lookupdHTTPAddresses);
    if (writer) {
      await publish(writer, topic, message);
    }
  } catch(error) {
    console.log('Error while connecting to any configured NSQD servers', error);
  }
})();

