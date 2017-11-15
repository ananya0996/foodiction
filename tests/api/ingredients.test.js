const util = require('util');
const mongodb = require('mongodb');
const frisby = require('frisby');
const serverFactory = require('../../server.js');

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/foodictionTest1`;
const APP_PORT = process.env.APP_PORT || 8889;

let server;
let db;

beforeAll(async () => {
	db = await util.promisify(mongodb.MongoClient.connect)(MONGO_URL);
	db.dropDatabase = util.promisify(db.dropDatabase);
	await db.dropDatabase();
	server = serverFactory(db);
	await new Promise(resolve => {
		server.listen(APP_PORT, () => {
			resolve();
		});
	});
});

describe('Testing /api/ingredient', () => {
	test('GET / returns empty initially', done => {
		frisby.get(`http://localhost:${APP_PORT}/api/ingredient`)
			.expect('status', 200)
			.then(res => {
				expect(res.json).toEqual({success: []});
			})
			.done(done);
	});

	let ingredientId;

	test('POST / adds an ingredient', done => {
		frisby.post(`http://localhost:${APP_PORT}/api/ingredient`, {
			name: 'Sale',
			quantity: 500
		}).expect('status', 200)
		.then(res => {
			expect(res.json.success).toBeDefined();
			expect(res.json.success).toHaveLength(24);
			ingredientId = res.json.success;
		})
		.done(done);
	});

	test('GET / fetches inserted ingredient', done => {
		frisby.get(`http://localhost:${APP_PORT}/api/ingredient`)
			.expect('status', 200)
			.then(res => {
				expect(res.json.success).toBeDefined();
				expect(res.json.success).toHaveLength(1);
				expect(res.json.success[0]).toEqual({_id: ingredientId, name: 'Sale', quantity: 500});
			})
			.done(done);
	});
});

afterAll(async () => {
	server.close();
	db.close();
});
