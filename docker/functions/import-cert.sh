#!/bin/bash

set -exu

EMULATOR_HOST=${COSMOSDB_HOST:-localhost}
EMULATOR_PORT=${COSMOSDB_PORT:-3000}
EMULATOR_CERT_PATH=/tmp/cosmos.crt

openssl s_client -connect ${EMULATOR_HOST}:${EMULATOR_PORT} </dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > $EMULATOR_CERT_PATH

cat $EMULATOR_CERT_PATH

if [[ "$OSTYPE" == "darwin"* ]]; then
    sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${EMULATOR_CERT_PATH}                                                     
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    cp ${EMULATOR_CERT_PATH} /usr/local/share/ca-certificates/cosmos.crt
    update-ca-certificates
fi

exec "$@"