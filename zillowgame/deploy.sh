#!/bin/bash
#npm run build
pm2 serve build 9393
pm2 start src/DatabaseController.mjs