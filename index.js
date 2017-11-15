const util = require('util');
const mongodb = require('mongodb');
const serverFactory = require('./server');

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/foodiction`;
const APP_PORT = process.env.APP_PORT || 8888;

(async function () {
	const db = await util.promisify(mongodb.MongoClient.connect)(MONGO_URL);
	console.log(`Connected to MongoDB at ${MONGO_URL}`);
	const server = serverFactory(db);

	server.listen(APP_PORT, () => {
		console.log(`Server listening on port ${APP_PORT}`);
	});
})().catch(err => {
	console.log(err);
});
