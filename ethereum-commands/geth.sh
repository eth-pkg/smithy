#!/bin/bash

geth --datadir /home/eniko/mainnet/geth \
  --mainnet \
  --networkid 1 \
  --port 30303 \
  --maxpeers 50 \
  --http \
  --http.port 8545 \
  --http.api eth,net,web3 \
  --authrpc.jwtsecret /home/eniko/mainnet/jwt.hex \
  --authrpc.addr localhost \
  --authrpc.port 8551 \
  --ipcdisable \
  --metrics \
  --metrics.port 6060 \
  --authrpc.vhosts "localhost"