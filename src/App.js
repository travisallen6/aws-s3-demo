import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import { uploadFile } from 'react-s3';

class App extends Component {
  constructor() {
    super()
    this.state = {
      isUploading: false,
      images: []
    }
  }


  uploadToS3 = (file) => {
    const config = {
      bucketName: process.env.REACT_APP_AWS_BUCKET,
      // dirName: 'photos', /* optional */
      region: 'us-west-1',
      accessKeyId: process.env.REACT_APP_AWS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET,
    }

    uploadFile(file, config)
    .then(data => {
      console.log(data)
    })
    .catch(err => { 
      console.error(err)
    })
  }


  render() {
    const divStyle = {
      width: 400,
      height: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'solid',
      borderRadius: 5
    };

    const activeStyle = {
      opacity: 0.5,
      backgroundColor: '#eee'
    };

    const rejectStyle = {
      backgroundColor: '#ffdddd'
    };

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React-DropZone/Amazon S3 Demo</h1>
        </header>

        <Dropzone
          onDrop={this.uploadToS3}
          accept="image/*"
          style={divStyle}
          activeStyle={activeStyle}
          rejectStyle={rejectStyle}
        >

        {this.state.isUploading ?
          <div>Uploading</div> :
          <div>Drag Files Here</div>}
        </Dropzone>

        {this.state.images.length > 0 &&
          <div style={{margin: 30}}>
            {this.state.images.map(({name, url}) =>
              <img key={name} src={url} style={{width: 200, height: 200}}/>)}
          </div>}
      </div>
    );
  }
}

export default App;
