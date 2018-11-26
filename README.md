# Amazon S3 Upload Walk-through and Demo

## Dependencies
- aws-sdk
- axios
- express
- uuid
- react-spinners
- react-dropzone

## .gitignore
### BEFORE YOU DO ANYTHING ELSE BEYOND THIS POINT
1. Go into the .gitignore file and add .env on a new line in the file, then save.

    <img src='assets/s3-01.jpg' />

    - We will be putting your s3 API keys in a .env file. If you don't add your .env to your .gitignore and you push to github, evil people will use your keys for their evil purposes at your expense.
1. Double check and if necessary review step 1.
1. Triple check and if necessary review step 1.
#### **Failing to do this step could easily cost you $5,000/day. I wish I were kidding.**

### Create a .env File
Create the file at the root of your project and add the following properties:
```
S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
In order for your back-end code to work, it is important that the property names in your .env are exactly as shown above. 

## Account Setup
If you haven't already signed up for an amazon S3 account, you can do so [here](https://portal.aws.amazon.com/billing/signup). S3 does cost money so you will need to input a credit card. However, AWS offers 12-months of free tier service as long as you don't exceed your limits. See details [here](https://aws.amazon.com/free/).

Once your account is set up, go to https://console.aws.amazon.com and log in.

## Create a New User and Generate Access Keys
1. Once you are on the home page, type 'IAM' in the search box and click on the link to IAM in the search results.
    <img src='assets/s3-02.jpg' />

1. It is highly recommended by AWS that you delete your root access keys since they provide complete control over all AWS products and instead create a new IAM user with access restricted to only to specific products. In our case, we want to create a user with restricted access to S3.

    1. Click delete your root access keys, then manage security credentials, then continue to security credentials
      <img src='assets/s3-03.jpg' />

    1. In the actions column, click delete, then yes to the confirmation box.
      <img src='assets/s3-04.jpg' />

1. Click 'Users' on the left navigation menu, then 'Add user'.
    <img src='assets/s3-05.jpg' />
1. Type a name for the user and check the 'programmatic access' checkbox, then click 'Next: permissions'
    <img src='assets/s3-06.jpg' />
1. No changes necessary on this screen, so click 'Next: tags'
    <img src='assets/s3-06-01.png' />
1. No changes necessary on the next screen so just click 'Next: review'
    <img src='assets/s3-07.png' />
1. No Changes necessary on this screen either, so click 'Create user'
    <img src='assets/s3-08.jpg' />
1. The next screen gives us the Access Key ID and Secret Access Key for the user. Click 'Show' in the secret access key column.
    <img src='assets/s3-09.jpg' />
1. Copy and paste your Key ID and Secret Access Key into your .env
    1. Copy and paste the value from the 'Access key ID' column into the `AWS_ACCESS_KEY_ID=` field of your .env.
    1. Copy and paste the value from the 'Secret access key' column into the `AWS_SECRET_ACCESS_KEY=` filed of your .env.

    <img src='assets/s3-09-0.jpg' />

1. Click 'Close' at the bottom right corner of the success screen.
1. Click on the name of the user that you just created.
    <img src='assets/s3-10.jpg' />
1. Copy the user ARN into a separate note taking app. You can use your .env, just make sure to not put it in any document that will be committed to github. You can add a note to your .env by placing a # in front of it.
    <img src='assets/s3-11.jpg' />

## Create a New Bucket

1. Click the services dropdown on the top navbar. Search for S3, or find it under 'storage' in the menu. S3 should also be an option in the 'History' list on the left part of the dropdown menu.
    <img src='assets/s3-12.jpg' />

1. Click 'Create bucket'
    <img src='assets/s3-13.jpg' />

1. Give your bucket a name. Bucket names need to be unique so it may take a few tries to find one that is available. Then select your region. The code in server.js is assuming the bucket region will be 'US West (N. California)', so if you pick a different region you may need to modify the name of the region in server.js.
    <img src='assets/s3-14.png' />

1. In step 2 of the prompt, we don't need to change anything so click 'Next'.
    <img src='assets/s3-15.png' />

1. Un-check the two boxes shown outlined in yellow in the image below.
    <img src='assets/s3-16.png' />

1. On this screen, review your bucket details. This is probably a good time to copy your bucket name to your .env in the `S3_BUCKET=` field.
    <img src='assets/s3-17.png' />

1. Once you are finished, click 'Create bucket'

## Configure Bucket Permissions
1. On your S3 dashboard, click the name of your bucket.
    <img src='assets/s3-18.jpg' />

1. Click the 'Permissions' tab at the top.
    <img src='assets/s3-19.jpg' />

1. Click on 'Bucket policy'
    <img src='assets/s3-21.jpg' />

1. Paste the following into the policy editor:

    <details>
    <summary><code>Starter Bucket Policy</code></summary>

    ```
    {
        "Version": "2012-10-17",
        "Id": "Policy1531943908491",
        "Statement": [
            {
                "Sid": "Stmt1531943904542",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "COPY ARN FROM IAM CREATED USER HERE"
                },
                "Action": [
                    "s3:DeleteObject",
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:Get*",
                    "s3:Put*"
                ],
                "Resource": "arn:aws:s3:::NAME-OF-BUCKET/*"
            }
        ]
    }
    ```
    </details>

1. There are 2 lines in this policy that need to be changed in the JSON:
    <img src='assets/s3-20.jpg' />

  1. Copy and paste the ARN from the user that you created earlier into Principal.AWS line which is outlined in orange above.

  1. Copy and paste the bucket ARN found above the policy editor text box which is outlined in purple above into the resource property field which is highlighted in green above. After your bucket name, make sure to put a `/*` before the closing quotation mark.

1. Once you are finished, click 'Save'

## Update CORS Configuration

1. Click on the 'CORS configuration' button at the top of the page
    <img src='assets/s3-22.jpg' />

1. Paste the following into the text box:

    <details>
    <summary><code>CORS Configuration</code></summary>

    ```

    <CORSConfiguration>
        <CORSRule>
            <AllowedOrigin>*</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
            <AllowedMethod>POST</AllowedMethod>
            <AllowedMethod>PUT</AllowedMethod>
            <AllowedHeader>*</AllowedHeader>
        </CORSRule>
    </CORSConfiguration>

    ```
    </details>


1. Once you are finished, click 'Save'

**_NOTE:_ The bucket policy and CORS configuration above are meant to get you up and running in development. Prior to using your bucket in a production environment, you should review the AWS S3 Documentation and determine the best CORS configuration and bucket policy for your situation based on what you learn. With proper implementation, the bucket policy and CORS configuration can limit your exposure to tragic situations caused by bad people gaining access to your bucket.**

## This Demo App Should Now Work

1. Open one terminal and run `nodemon`

1. Open a second terminal and run `npm start`
    <img src='assets/s3-23.jpg' />

1. If a new browser window didn't open automatically, open a new one and navigate to http://localhost:3000
    <img src='assets/s3-24.jpg' />

1. You can now drag an image into the file drop zone, or you can also click inside the square and select a picture to upload.
    <img src='assets/s3-25.jpg' />

1. You should then see a loading animation inside the drop zone while your file is being uploaded to s3.

1. If your upload is successful, you should see the placeholder url text at the top of the page change and shortly after you should see the your uploaded image on the screen.
    <img src='assets/s3-26.jpg' />
    <img src='assets/s3-27.jpg' />

1. You should now be able to go to your S3 bucket and see that your image is now in the bucket. You may need to refresh your browser.
    <img src='assets/s3-28.jpg' />

## Code Walkthrough
### App.js
In the return of the render method, we are using a package called react-dropzone. It can be installed in your project by running `npm install react-dropzone`. This is basically a fancy `<input type='file' />` 

#### Dropzone
```js
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
```
 - `onDropAccepted=`The function to run when an acceptable file is accepted or dropped. We have designated that function to be `this.getSignedRequest` which is explained in the next section.
 -` accept=` Specific file types that are allowed to be dropped in the dropzone
 - `multiple=` false makes it so only one file can be dropped at a time. If you set this to true, you will need to refactor the code to iterate through the array of files.
 - The code between `<Dropzone></Dropzone>` is a ternary that renders a loading animation or text depending on the value of a boolean property on state. We toggle that value in the getSignedRequest and  methods.

 #### getSignedRequest

 ```js
getSignedRequest = ([file]) => {
    this.setState({isUploading: true})

    const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`

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

```

1. This method takes in the file as a parameter which is in an array. In this example, we are destructuring the parameter which names the first item in the array 'file'.
1. The function then generates a file name using a random string, and then the name of the file. We are using a regular expression to replace all of the white space with hyphens.
1. We then use axios to make a GET request to our server endpoint '/sign-s3'. The object in the second argument of axios.get() is a cleaner way to send query string parameters. The alternative would have been:
    
    ```js
    axios.get(`/sign-s3?file-name=${fileName}&file-type=${file.type}`)
    ```

    But doesn't this look much cleaner?
    
    ```js
    axios.get('/sign-s3', {
        params: {
        'file-name': fileName,
        'file-type': file.type
        }
    ```
1. At this point, this get request is sent off to the server.

### server.js
```js
const aws = require('aws-sdk');

const {
    S3_BUCKET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
} = process.env

app.get('/sign-s3', (req, res) => {

  aws.config = {
    region: 'us-west-1',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
  
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

    return res.send(returnData)
  });
});
```
1. Our server endpoint app.get('/sign-s3') receives the request that we just made from App.js.
1. We configure the aws-sdk with our app credentials. 
1. Our server then requests a 'signed url' from AWS. In order to upload our file, we need to authenticate with AWS using our secret key ID and secret access key and this step is how we do it. 
1. AWS responds to that request with a a signed URL.
1. The signed url is sent back to the front-end (App.js specifically) which will then be used to upload the file. This process keeps our access keys secret since they are stored server-side.

### App.js
#### .then inside getSignedRequest
1. Once our server responds with the signed URL from AWS, the `.then()` from the GET request fires and pulls, the signedRequest and the URL from the response. The URL will be the URL of the stored photo which we can then use for the source in an `<img />` tag as long as the photo upload is successful.
1. The uploadFile method is then called with the file itself, the signed upload url (signedRequest), and the file url (url) as arguments.

#### uploadFile
1. the uploadFile method takes the file to be uploaded, the signed upload url, and the file's potential source url as parameters. 
1. In order for the file to be treated like a file on the PUT request, we need to set a header of Content-Type with the file type.
1. An axios PUT request is sent to the signed URL along with the file and the configuration object with the necessary header.
1. Once the .then of the axios PUT method fires, we now know that the file upload was successful.
1. Inside this .then is where you would normally send the URL to the back-end on a POST request to be inserted into the database.