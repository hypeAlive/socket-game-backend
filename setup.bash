#!bin bash

cd ./types
npm install
npm run build

cd ../server
npm install
npm run build
