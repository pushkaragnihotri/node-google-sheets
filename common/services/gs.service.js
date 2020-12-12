const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
const { SCOPES, TOKEN_PATH } = require('../../common/config/env.config')

// If modifying the scopes, delete token.json.

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

/**
 * Get and store new token after prompting for user authorization.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken(oAuth2Client) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	})
	console.log('Authorize this app by visiting this url:', authUrl)
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	rl.question('Enter the code from that page here: ', code => {
		rl.close()
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error while trying to retrieve access token', err)
			oAuth2Client.setCredentials(token)
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
				if (err) return console.error(err)
				console.log('Token stored to', TOKEN_PATH)
			})
		})
	})
}

module.exports = { getNewToken }
