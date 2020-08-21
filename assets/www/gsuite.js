var API_KEY = 'AIzaSyBg6TafQeM6mjdAgRi5hh2G1k9gAdxUkqA',
CLIENT_ID = '549665734442-bc7pqd84f27s5rrl8j8e3sgrej0gfh9s.apps.googleusercontent.com',
DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
SCOPES = 'https://www.googleapis.com/auth/drive',
  
loadClient = function() {
	gapi.load('client:auth2', function() {
		console.log('Loading client auth...')
		gapi.client.init({
        		apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
	        }).then( () => {
			let isSigned = gapi.auth2.getAuthInstance().isSignedIn.get(),
			getUserInfo = function(signed) {
				if (!signed) return
				let user = gapi.auth2.getAuthInstance().currentUser.get(),
				profile = user.getBasicProfile(),
				name = profile.getName()
				console.log('User ' + name +' is signed.')
				listFiles()
			}

			if (!isSigned) {
				console.log('User not logged...')
				gapi.auth2.getAuthInstance().signIn()
				.then( gapi.auth2.getAuthInstance().isSignedIn.listen(getUserInfo) )
			} else {
				getUserInfo(true)
			}

		})
	})
},

listFiles = function() {
       	gapi.client.drive.files.list({
		'q': 'mimeType="application/vnd.google-apps.spreadsheet"',
         	'pageSize': 100,
          	'fields': "nextPageToken, files(id, name)"
        }).then( function(response) {
		let files = response.result.files
          	console.log('Spreadsheets on Drive: '+files.length)
          	if (files && files.length > 0) {
            		for (let i = 0; i < files.length; i++) {
              			var file = files[i]
              			state.spreadsheets.push({ id: file.id, name: file.name })
            		}
			view.update({ spreadsheets: state.spreadsheets })
          	} else {
            		console.log('No files found.')
          	}
        })
}
