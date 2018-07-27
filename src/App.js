import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {v4 as randomString} from 'uuid'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'

class App extends Component {
  constructor() {
    super()
    this.state = {
      isUploading: false,
      images: [],
      url: 'http://via.placeholder.com/450x450',
      value: ''                
    }
  }
  
  getSignedRequest = ([file]) => {
    this.setState({isUploading: true})
    // We are creating a file name that consists of a random string, and the name of the file that was just uploaded with the spaces removed and hyphens inserted instead. This is done using the .replace function with a specific regular expression. This will ensure that each file uploaded has a unique name which will prevent files from overwriting other files due to duplicate names.
    const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`

    // We will now send a request to our server to get a "signed url" from Amazon. We are essentially letting AWS know that we are going to upload a file soon. We are only sending the file-name and file-type as strings. We are not sending the file itself at this point.
    axios.get('/sign-s3', {
      params: {
        'file-name': fileName,
        'file-type': file.type
      }
    }).then( (response) => {
      const { signedRequest, url } = response.data 
      this.uploadFile(file, signedRequest, url)
    }).catch( err => {
      console.log(err)
    })
  }

  uploadFile = (file, signedRequest, url) => {
    
    var options = {
      headers: {
        'Content-Type': file.type
      }
    };

    axios.put(signedRequest, file, options)
    .then( response => {
      this.setState({isUploading: false, url: url})
      // THEN DO SOMETHING WITH THE URL. SEND TO DB USING POST REQUEST OR SOMETHING
    })
    .catch( err => {
      this.setState({
        isUploading: false
      })
      if(err.response.status === 403) {
        alert('Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n' + err.stack)
      } else {
        alert(`ERROR: ${err.status}\n ${err.stack}`)
      }
    })
  }

  render() {
    
    return (
      <div className="App">

        <h1>Upload</h1>
        <h1>{this.state.url}</h1>
        <img src={ this.state.url } alt='' width='450px' />        

        <Dropzone 
          onDropAccepted={this.getSignedRequest}
          style={{
            position: 'relative',
            width: 200,
            height: 200,
            borderWidth: 7,
            marginTop: 100,
            borderColor: 'rgb(102, 102, 102)',
            borderStyle: 'dashed',
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 28,
          }}
          accept='image/*'
          multiple={false} >
            
            { this.state.isUploading 
              ?  <GridLoader />
              : <p>Drop File or Click Here</p>
            }
        </Dropzone>
      </div>
    );
  }
}

export default App;
