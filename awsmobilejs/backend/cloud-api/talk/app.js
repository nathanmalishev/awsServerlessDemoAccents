/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// Declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

AWS.config.update({ region: process.env.REGION })

/** ********************
 * Example get method *
 ********************* */

app.get('/items', (req, res) => {
  // Add your code here

  res.json({ success: 'get call succeed!', url: req.url, event: req.event })
})

app.get('/items/*', (req, res) => {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url })
})

/** **************************
* Example post method *
*************************** */

app.post('/items', (req, res) => {
  // Add your code here
  const polly = new AWS.Polly()
  const s3 = new AWS.S3()

  const { text, voiceId } = req.body

  if (!text || !voiceId) {
    res.status = 500
    res.json({ failuer: 'Text or voiceId not provided' })
    return
  }
  const { cognitoIdentityId } = req.apiGateway.event.requestContext.identity

  polly.synthesizeSpeech({
    OutputFormat: 'mp3',
    Text: text,
    TextType: 'text',
    VoiceId: voiceId,
  }, (err, data) => {
    if (err) {
      console.log(err)
      res.status = 500
      res.json({ failuer: 'Could not synthesizeSpeech' })
    } else {
      // Data.AudioStream is out bytes we want to upload to s3
      const s3Key = `${voiceId}_${Date.now()}.mp3`
      const privateBucket = `private/${cognitoIdentityId}/`
      s3.putObject({
        Body: data.AudioStream,
        Bucket: 'accentdemomarh-userfiles-mobilehub-1258765760', // change for your bucket
        Key: `${privateBucket}${s3Key}`,
      }, (s3Err) => {
        if (s3Err) {
          console.log(s3Err)
          res.status = 500
          res.json({ failure: 'Could not save media file' })
        } else {
          res.json({
            success: 'Succesfully uploaded audio file!',
            key: s3Key,
          })
        }
      })
    }
  })
})

app.post('/items/*', (req, res) => {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

/** **************************
* Example post method *
*************************** */

app.put('/items', (req, res) => {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

app.put('/items/*', (req, res) => {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

/** **************************
* Example delete method *
*************************** */

app.delete('/items', (req, res) => {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})

app.delete('/items/*', (req, res) => {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})

app.listen(3000, () => {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
