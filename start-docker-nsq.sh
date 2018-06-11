docker pull nsqio/nsq

DOCKER_HOST='172.17.0.1'

docker run -d --name lookupd1 -p 4160:4160 -p 4161:4161 \
    nsqio/nsq /nsqlookupd \
    --broadcast-address=$DOCKER_HOST \
    --tcp-address="0.0.0.0:4160" --http-address="0.0.0.0:4161"

docker run -d --name lookupd2 -p 4162:4162 -p 4163:4163 \
    nsqio/nsq /nsqlookupd \
    --broadcast-address=$DOCKER_HOST \
    --tcp-address="0.0.0.0:4162" --http-address="0.0.0.0:4163"

docker run -d --name nsqd1 -p 4150:4150 -p 4151:4151 \
    nsqio/nsq /nsqd \
    --broadcast-address=$DOCKER_HOST \
    --tcp-address="0.0.0.0:4150" --http-address="0.0.0.0:4151" \
    --lookupd-tcp-address=$DOCKER_HOST:4160 \
    --lookupd-tcp-address=$DOCKER_HOST:4162

docker run -d --name nsqd2 -p 4152:4152 -p 4153:4153 \
    nsqio/nsq /nsqd \
    --broadcast-address=$DOCKER_HOST \
    --tcp-address="0.0.0.0:4152" --http-address="0.0.0.0:4153" \
    --lookupd-tcp-address=$DOCKER_HOST:4160 \
    --lookupd-tcp-address=$DOCKER_HOST:4162

docker run  -d --name nsqadmin -p 4171:4171 nsqio/nsq /nsqadmin \
    --lookupd-http-address=$DOCKER_HOST:4161 \
    --lookupd-http-address=$DOCKER_HOST:4163
