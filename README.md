# NSDQ Demo

This project contains a demo for howto use NSQ. It uses NSQD, NSLOOKUPD and NSQADMIN within Docker.
As client we're using here NSQJS. But the demo contains an extension about howto create a writer.

Normally the writer needs to know the address of a running NSQD instance. This is in contrary to the
Reader which is using one or more NSLOOKUPD instance to find all running NSQ instances.
The extension provides the same functionality for the Writer. It queries all running NSLOOKUPD
instances and from the unique list of NSQD instances it picks randomly one so that every NSQD
instance will be used.

## Furter links and information

- [https://nsq.io/](https://nsq.io/)
- [NSQJS](https://github.com/dudleycarr/nsqjs)
- [Using Message Queues with Microservices](https://xavierchow.github.io/2016/08/06/mq-with-microservice/()
- [GopherCon 2014 Spray Some NSQ On It by Matt Reiferson](https://www.youtube.com/watch?time_continue=930&v=CL_SUzXIUuI)
- [Lessons Learned Optimizing NSQ](https://speakerdeck.com/snakes/lessons-learned-optimizing-nsq)
- [Scaling NSQ to 750 Billion Messages](https://getpocket.com/a/read/1290554817)
