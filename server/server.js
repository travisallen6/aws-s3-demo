require('dotenv').config();
const   express = require('express')
        , app = express()
        , port = 3010;
const aws = require('aws-sdk');

app.use(express.json())

const {
    AWS_KEY_ID,
    AWS_KEY_SECRET,
    AWS_BUCKET,
    AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY
} = process.env

const S3_BUCKET = process.env.AWS_BUCKET;

aws.config.region = 'us-west-1';

app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.listen(port, () => console.log(`Hard to port ${port}`))