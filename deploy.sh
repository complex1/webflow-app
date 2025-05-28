cd application/client
yarn
cd ../server
yarn
cd ../..
yarn build
pm2 stop server
pm2 start server