const express = require('express')
const cookieParser = require('cookie-parser')
const { PORT } = require('./common/config/env.config')
const Routes = require('./src/routes.config')

const app = express()

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE')
	res.header('Access-Control-Expose-Headers', 'Content-Length')
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range')
	if (req.method === 'OPTIONS') {
		return res.send(200)
	} else {
		return next()
	}
})

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
	res.send('Tadaa..app is working!')
})

Routes(app)

app.listen(PORT, () => {
	console.log(`App is listening at port ${PORT}`)
})

module.exports = app // for testing
