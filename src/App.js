import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import ReactS3Uploader from 'react-s3-uploader'
import { uploadFile } from 'react-s3';

class App extends Component {
  constructor() {
    super()
    this.state = {
      isUploading: false,
      images: [],
      url: '',
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
      console.timeEnd('uploadTimer')
      this.setState({url})
    })
    .catch( err => {
      console.log(err)
    })
  }

  
  getSignedRequest = (file) => {

    axios.get('/sign-s3', {
      params: {
        'file-name': file.name,
        'file-type': file.type
      }
    }).then( (response) => {
      const { signedRequest, url } = response.data 
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
            <p>Drop File or Click Here</p>
        </Dropzone>
        
      </div>
    );
  }
}

export default App;
