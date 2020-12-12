const fs = require('fs')
const { google } = require('googleapis')
const { TOKEN_PATH } = require('../../common/config/env.config')

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(response, callback) {
	// Load client secrets from a local file.
	fs.readFile('./common/secrets/credentials.json', 'utf8', (err, content) => {
		if (err) {
			console.log(`Error loading Google API credentials: ${err}`)
			return response.status(500).json({
				status: 'error',
				message: `Error loading Google API credentials: ${err}`,
			})
		}
		content = JSON.parse(content)
		const { client_secret, client_id, redirect_uris } = content.installed
		const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

		// Check if we have previously stored a token.
		fs.readFile(TOKEN_PATH, (err, token) => {
			if (err) {
				return response.status(401).json({
					status: 'error',
					message: `Authorization Required.`,
				})
			}
			oAuth2Client.setCredentials(JSON.parse(token))
			callback(oAuth2Client)
		})
	})
}

module.exports = { authorize }
