module.exports = {
	ENV: process.env.ENV || 'dev',
	PORT: process.env.PORT || 4040,
	SCOPES: process.env.SCOPES || ['https://www.googleapis.com/auth/spreadsheets'],
	TOKEN_PATH: process.env.TOKEN_PATH || 'token.json',
}
