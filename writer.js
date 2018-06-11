const config = require('config');
const nsq = require('nsqjs')

const { createWriter } = require('./helpers/connector.js');

let message = 'Hello NSQ';
if (process.argv.length > 2) {
  message = process.argv[2];
}

function publish(writer, message) {
  return new Promise((resolve, reject) => {
    writer.publish(config.topic, message,  err => {
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
      await publish(writer, message);
    }
  } catch(error) {
    console.log('Error while connecting to any configured NSQD servers', error);
  }
})();

