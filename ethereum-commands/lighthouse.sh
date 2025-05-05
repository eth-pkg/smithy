#!/bin/bash

lighthouse beacon --datadir /home/eniko/mainnet/lighthouse \
  --network mainnet \
  --port 30303 \
  --maxpeers 50 \
  --http \
  --http.port 8545 \
  --http.api eth,net,web3 \
  --jwtsecret {common.dataDir}/jwt.hex \
  --engine.host localhost \
  --engine.port 8551 \
  --metrics \
  --metrics.port 6060