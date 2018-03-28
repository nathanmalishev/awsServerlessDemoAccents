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
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
// Amplify.Logger.LOG_LEVEL = 'DEBUG'
Amplify.configure(awsExports)

const federated = {
  facebook_app_id: '442540206182549',
  google_client_id: '453030685440-dnqb50sp9a5pkrdbnjcbhps3v3psnqdu.apps.googleusercontent.com'
}

ReactDOM.render(
  <Provider store={store}>
    <App federated={federated} />
  </Provider>,
  document.getElementById('root'),
)
registerServiceWorker()
