#!/bin/sh

ts-node ./node_modules/typeorm/cli.js migration:run
npm start