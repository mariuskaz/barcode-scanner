let connect = function() {

    gapi.load('client:auth2', () => {
      console.log('Loading client auth...')
      gapi.client.init({
              // Replace with your own API credentials from Google Cloud Platform
              apiKey: 'AIzaSyBg6TafQeM6mjdAgRi5hh2G1k9gAdxUkqA',
              clientId: '549665734442-bc7pqd84f27s5rrl8j8e3sgrej0gfh9s.apps.googleusercontent.com',
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
              scope: 'https://www.googleapis.com/auth/drive',

      }).then( () => {
              let signed = gapi.auth2.getAuthInstance().isSignedIn.get()
              if ( !signed ) {
                gapi.auth2.getAuthInstance().signIn().then( 
                  gapi.auth2.getAuthInstance().isSignedIn.listen(getSpreadSheets) )
              } else {
                getSpreadSheets(signed)
              }

      })
      
    })
},

getSpreadSheets = function(signed) {

  if (signed) {
    gapi.client.drive.files.list({
      'q': 'mimeType="application/vnd.google-apps.spreadsheet"',
      'pageSize': 100,
      'fields': "nextPageToken, files(id, name)"
      
    }).then( response => {
        let files = response.result.files
        console.log('Spreadsheets on Drive: ' + files.length)
        if (files && files.length > 0) {
            files.forEach( file => state.spreadsheets.push({ id: file.id, name: file.name }) )
            view.update({ spreadsheets: state.spreadsheets })
        }
    })
  }
  
}
