cd ./types
npm install
npm run build

echo "Types setup complete"

cd ../server
npm install
npm run build

echo "Server setup complete"
