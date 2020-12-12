const fs = require('fs')
const { google } = require('googleapis')
const { authorize } = require('../middlewares/gs.middleware')
const { getNewToken } = require('../../common/services/gs.service')

function login(_, response) {
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

		// create a new token
		getNewToken(oAuth2Client)

		return response.status(200).json({
			status: 'success',
			message: `Token created successfully!`,
		})
	})
}

function fetchData(request, response) {
	// Authorize a client, then call the Google Sheets API.
	authorize(response, fetchDataCB)

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
				sheetName = res.data.range.split('!')[0]
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
					result[sheetName] = spreadsheetData
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

function updateData(request, response) {
	// Authorize a client, then call the Google Sheets API.
	authorize(response, updateDataCB)

	function updateDataCB(auth) {
		let spreadsheetId = request.body.spreadsheet_id || '16Co5uD5XcG_hlrc5-DAYwwe6n0-8O5uC0AYyd6L9j_I'
		let sheetId = request.body.sheet_id || 'Sheet1'
		let rowNumber = request.body.row_number || 1
		let columnNumber = request.body.column_number || 'A'
		let newValue = request.body.new_value || 'A'
		let values = [[newValue]]
		const resource = { values }
		const sheets = google.sheets({ version: 'v4', auth })
		sheets.spreadsheets.values.update(
			{
				spreadsheetId,
				range: `${sheetId}!${rowNumber}:${columnNumber}`,
				valueInputOption: 'RAW',
				resource,
			},
			(err, res) => {
				if (err) {
					console.log(`The API returned an error: ${err}`)
					return response.status(404).json({
						success: false,
						message: `The API returned an error: ${err}`,
					})
				}
				return response.status(200).json({
					success: true,
					message: `Sheet updated successfully!`,
					body: res.data,
				})
			}
		)
	}
}

module.exports = { login, fetchData, updateData }
