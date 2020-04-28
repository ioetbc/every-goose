const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');
const stripePaymentIntent = require('./controllers/v1/stripePaymentIntent');
const createCustomer = require('./controllers/v1/createCustomer');

app.prepare().then(() => {
	const server = express()
	server.use(bodyParser.json());

	server.get('/', (req, res) => {
		return app.render(req, res, '/', req.query)
	});

	server.post('/api/v1/stripePaymentIntent', async (req, res) => {
		const { error, payment } = await stripePaymentIntent(req);

		if (payment) {
			const { error } = await createCustomer(req)
			
 			if (!error) {
				// send email
			} else {
				// call intercom
			}
			res.status(200).json({ response: payment });
		} else {
			res.status(500).json({ error: error });
		}
	});

	server.post('/api/v1/createCustomer', (req, res) => {
		createCustomer(req, res);
	});

	server.all('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(port, err => {
		if (err) throw err
		console.log(`> Ready don http://localhost:${port}`)
	})
})