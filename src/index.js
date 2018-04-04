import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import awsExports from './aws-exports'
import rootReducer from './reducers'

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
// Amplify.Logger.LOG_LEVEL = 'DEBUG'
Amplify.configure(awsExports)

// Check to see if our session has expired if so wipe
if (localStorage['aws-amplify-cachefederatedInfo']) {
  // Lazy to for _.get
  const current = Date.now()
  const created = localStorage['aws-amplify-cachefederatedInfo'].timestamp
  if ((current - created) > 3600000) {
    // Less than an hour old we need a new one
    localStorage.clear()
    window.location.reload()
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
registerServiceWorker()
