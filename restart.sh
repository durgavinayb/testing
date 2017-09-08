forever stop ./bin/www
PORT=3001 NODE_TYPE=master forever -a -o fmwebsite.log -e fmwebsite.log start ./bin/www
