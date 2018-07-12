import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Dropzone from 'react-dropzone'

class App extends Component {
  constructor() {
    super()
    this.state = {
      isUploading: false,
      images: []
    }
  }

  uploadImage = (file) => {
    return axios.get('/upload', {
      params: {
        filename: file.name,
        filetype: file.type,
      }
    })
    .then( response => {
      const options = {
        headers: {
          'Content-Type': file.type
        }
      }
      return axios.put(response.data.url, file, options).then( response => {
        const { name } = response.config.data
        return {
          name,
          isUploading: true,
          url: `https://tallendev.s3.amazonaws.com/${file.name}` 
        }
      })
    })
  }

  handleDrop = (files) => {
    this.setState({isUploading: true})
    let imageRequests = files.map( file => this.uploadImage(file))
    Promise.all(imageRequests)
    .then( images => {
      this.setState({
        isUploading: false,
        images: [...this.state.images, ...images]
      })
    })
    .catch( err => {
      console.log(err)
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
          onDrop={this.handleDrop}
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
