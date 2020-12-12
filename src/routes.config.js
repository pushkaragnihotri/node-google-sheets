const { login, fetchData, updateData } = require('./controllers/sheets.controller')

module.exports = app => {
	app.post('/login', login)
	app.post('/fetch', fetchData)
	app.post('/update', updateData)

	// handle undefined routes
	app.get('*', (_, res) => res.send('Sorry, what?'))
}
