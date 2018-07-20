import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'

class App extends Component {
  constructor() {
    super()
    this.state = {
      isUploading: false,
      images: [],
      url: 'http://via.placeholder.com/200x200',
      value: ''                
    }
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
      console.log(err)
    })
  }

  
  getSignedRequest = (file) => {
    const fileName = 'ta1-' + file.name.replace(/\s/g, '-')
    axios.get('/sign-s3', {
      params: {
        'file-name': fileName,
        'file-type': file.type
      }
    }).then( (response) => {
      const { signedRequest, url } = response.data 
      this.setState({isUploading: true})
      this.uploadFile(file, signedRequest, url)
    }).catch( err => {
      console.log(err)
    })
  }
  
  addFile = ([file]) => {
    // const file = files[0]
    this.getSignedRequest(file)
  }

  render() {
    
    return (
      <div className="App">

        <h1>Upload</h1>
        <h1>{this.state.url}</h1>
        <Dropzone 
          onDropAccepted={this.addFile}
          style={{
            position: 'relative',
            width: 200,
            height: 200,
            borderWidth: 7,
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
        <img src={ this.state.url } width='200px' />
        
      </div>
    );
  }
}

export default App;
