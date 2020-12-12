const fs = require('fs')
const { google } = require('googleapis')
const { authorize } = require('../middlewares/gs.middleware')

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/16Co5uD5XcG_hlrc5-DAYwwe6n0-8O5uC0AYyd6L9j_I/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function fetchData(request, response) {
	// Load client secrets from a local file.
	fs.readFile('./common/secrets/credentials.json', (err, content) => {
		if (err) {
			console.log(`Error loading client secret file: ${err}`)
			return response.status(500).json({
				status: 'error',
				message: `Error loading client secret file: ${err}`,
			})
		}
		// Authorize a client with credentials, then call the Google Sheets API.
		authorize(JSON.parse(content), fetchDataCB)
	})

	function fetchDataCB(auth) {
		let spreadsheetId = request.body.spreadsheet_id || '16Co5uD5XcG_hlrc5-DAYwwe6n0-8O5uC0AYyd6L9j_I'
		let range = request.body.range || 'A:Z'
		const sheets = google.sheets({ version: 'v4', auth })
		sheets.spreadsheets.values.get(
			{
				spreadsheetId,
				range,
			},
			(err, res) => {
				if (err) {
					console.log(`The API returned an error: ${err}`)
					return response.status(404).json({
						status: 'error',
						message: `The API returned an error: ${err}`,
					})
				}
				const rows = res.data.values
				if (rows.length) {
					let result = {}
					let spreadsheetData = []
					rows.map(row => {
						let rowData = {}
						for (let i in row) {
							rowData[i] = row[i]
						}
						spreadsheetData.push(rowData)
					})
					result[spreadsheetId] = spreadsheetData
					console.log('result : ', result)
					return response.status(200).json({
						status: 'success',
						message: `Data pulled successfully!`,
						body: result,
					})
				} else {
					console.log('No data found.')
					return response.status(204).json({
						status: 'success',
						message: `No data found.`,
					})
				}
			}
		)
	}
}

module.exports = { fetchData }
