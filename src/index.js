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

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
)
registerServiceWorker()
