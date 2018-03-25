import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import aws_exports from './aws-exports'

//Amplify.Logger.LOG_LEVEL = 'DEBUG'
Amplify.configure(aws_exports)

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)
registerServiceWorker()
