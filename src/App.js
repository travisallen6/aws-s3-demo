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
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          this.setState({url})
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  
  getSignedRequest = (file) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }
  
  addFile = ({target:{files}}) => {
    const file = files[0]
    this.getSignedRequest(file)

  }

  render() {
    
    return (
      <div className="App">

        <h1>Upload</h1>
        <h1>{this.state.url}</h1>
        <input onChange={ this.addFile } type="file" id="file-input" />>
        
      </div>
    );
  }
}

export default App;
