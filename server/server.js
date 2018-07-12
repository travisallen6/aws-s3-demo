require('dotenv').config();
const   express = require('express')
        , aws = require('aws-sdk')
        , cors = require('cors')
        , app = express()
        , port = 3010;

app.use(cors);

const {
    AWS_KEY_ID,
    AWS_KEY_SECRET,
    AWS_BUCKET
} = process.env

aws.config.update({
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_KEY_SECRET
});

function upload(file) {
    const s3 = new aws.S3();
    const params = {
      Bucket: AWS_BUCKET,
      Key: file.filename,
      Expires: 60,
      ContentType: file.filetype
    };
  
    return new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      });
    });
  }
  

app.get('/upload', (req, res) => {
    upload(req.query)
    .then( url => { 
        res.send( {url} )
    })
    .catch( err => {
        console.log(err)
    })
})

app.listen(port, () => console.log(`Hard to port ${port}`))