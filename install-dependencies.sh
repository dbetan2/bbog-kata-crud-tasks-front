#!/bin/bash

OS=$(uname)
if [ "$OS" = "Linux" ]; then
    set -eux
    rm ~/.npmrc | true
    curl -u "${ARTIFACTORY_READER_USER}:${ARTIFACTORY_READER_API_KEY}" 'https://bbogdigital.jfrog.io/bbogdigital/api/npm/auth' >> ~/.npmrc
    # or replace ARTIFACTORY_READER_API_KEY by ARTIFACTORY_READER_PASSWORD if not exist
    sed -i 's#_auth#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:_auth#g' ~/.npmrc
    sed -i 's#always-auth#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:always-auth#g' ~/.npmrc
    sed -i 's#email#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:email#g' ~/.npmrc
    npm i
elif [ "$OS" = "Darwin" ]; then
    set +u
    rm ~/.npmrc | true
    curl -u "${ARTIFACTORY_READER_USER}:${ARTIFACTORY_READER_API_KEY}" 'https://bbogdigital.jfrog.io/bbogdigital/api/npm/auth' >> ~/.npmrc
    # # or replace ARTIFACTORY_READER_API_KEY by ARTIFACTORY_READER_PASSWORD if not exist
    sed -i "" 's#_auth#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:_auth#g' ~/.npmrc
    sed -i "" 's#always-auth#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:always-auth#g' ~/.npmrc
    sed -i "" 's#email#//bbogdigital.jfrog.io/bbogdigital/api/npm/npm-bbta/:email#g' ~/.npmrc
    npm i
    # or npm install
else
    echo "Sistema operativo no soportado"
    exit 1
fi
