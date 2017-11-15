const util = require('util');
const mongodb = require('mongodb');
const puppeteer = require('puppeteer');

const serverFactory = require('../../server.js');

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/foodictionTest2`;
const APP_PORT = process.env.APP_PORT || 8890;
const appUrlBase = `http://localhost:${APP_PORT}`;

let server;
let db;
let browser;

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

	browser = await puppeteer.launch();
}, 10000);

describe('', () => {
	test('Master Menu is initially empty', async () => {
		const masterMenuPage = await browser.newPage();
		await masterMenuPage.goto(`${appUrlBase}/canteen/master_menu`);
		await masterMenuPage.waitFor('#tbody');
		const itemRows = await masterMenuPage.$$('#tbody tr');
		expect(itemRows.length).toBe(0);
		await masterMenuPage.close();
	}, 10000);

	test('Master Menu allows addition of items', async () => {
		const masterMenuPage = await browser.newPage();
		await masterMenuPage.goto(`${appUrlBase}/canteen/master_menu`);
		await masterMenuPage.waitFor('input#Item');
		await masterMenuPage.type('input#Item', 'Sandwich');
		await masterMenuPage.waitFor('input#Price');
		await masterMenuPage.type('input#Price', '100');
		await masterMenuPage.waitFor('input#addItem');
		await masterMenuPage.click('input#addItem');
		await masterMenuPage.waitFor(10);
		await masterMenuPage.waitFor('#tbody tr');
		const itemRows = await masterMenuPage.$$('#tbody tr');
		expect(itemRows.length).toBe(1);
		await masterMenuPage.close();
	}, 10000);

	test('Daily Menu is initially empty', async () => {
		const dailyMenuPage = await browser.newPage();
		await dailyMenuPage.goto(`${appUrlBase}/canteen/menu`);
		await dailyMenuPage.waitFor('#tbody');
		const itemRows = await dailyMenuPage.$$('#tbody tr');
		expect(itemRows.length).toBe(0);
		await dailyMenuPage.close();
	}, 10000);

	test('Master Menu allows adding items to Daily Menu', async () => {
		const masterMenuPage = await browser.newPage();
		await masterMenuPage.goto(`${appUrlBase}/canteen/master_menu`);
		await masterMenuPage.waitFor('.addbutton');
		await masterMenuPage.click('.addbutton');
		await masterMenuPage.waitFor(10);
		const removeButton = await masterMenuPage.$('.rmbutton');
		expect(removeButton).toBeDefined();
		await masterMenuPage.close();
	}, 10000);

	test('Daily Menu shows the items that have been added', async () => {
		const dailyMenuPage = await browser.newPage();
		await dailyMenuPage.goto(`${appUrlBase}/canteen/menu`);
		await dailyMenuPage.waitFor(100);
		await dailyMenuPage.waitFor('#tbody');
		const itemRows = await dailyMenuPage.$$('#tbody tr');
		expect(itemRows.length).toBe(1);
		await dailyMenuPage.close();
	});

	test('Customer can view menu', async () => {
		const customerOrderPage = await browser.newPage();
		await customerOrderPage.goto(`${appUrlBase}/customer/menu`);
		await customerOrderPage.waitFor(100);
		await customerOrderPage.waitFor('#tbody');
		const itemRows = await customerOrderPage.$$('#tbody tr');
		expect(itemRows.length).toBe(1);
		await customerOrderPage.close();
	}, 10000);

	test('Customer can place an order', async () => {
		const customerOrderPage = await browser.newPage();
		await customerOrderPage.goto(`${appUrlBase}/customer/menu`);
		await customerOrderPage.waitFor('tbody button');
		let addItemButtonText = await customerOrderPage.evaluate(() => {
			return document.querySelector('tbody button').innerText;
		}, 10000);

		expect(addItemButtonText.includes('Add')).toBe(true);
		await customerOrderPage.evaluate(() => {
			const menuItem = document.querySelector('tbody');
			menuItem.querySelector('input').value = 1;
			menuItem.querySelector('button').click();
		}, 10000);

		addItemButtonText = await customerOrderPage.evaluate(() => {
			return document.querySelector('tbody button').innerText;
		}, 10000);
		expect(addItemButtonText.includes('Remove')).toBe(true);
		await customerOrderPage.click('#checkout');
		await customerOrderPage.waitForNavigation();
		await customerOrderPage.waitFor('button');
		await customerOrderPage.click('button');
		await customerOrderPage.close();
	}, 10000);

	test('Canteen can view the order', async () => {
		const canteenOrderPage = await browser.newPage();
		await canteenOrderPage.goto(`${appUrlBase}/canteen/orders`);
		await canteenOrderPage.waitFor(100);
		await canteenOrderPage.waitFor('tbody');
		const orderRows = await canteenOrderPage.$$('tbody tr');
		expect(orderRows.length).toBe(1);
		await canteenOrderPage.close();
	}, 10000);
});

afterAll(async () => {
	await browser.close();
	server.close();
	db.close();
});
