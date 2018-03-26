import React, { Component } from 'react'
import 'bulma/css/bulma.css'
import { withAuthenticator } from 'aws-amplify-react' // Or 'aws-amplify-react-native';

import Input from './Input'

import List from './List'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
}

class App extends Component {
  render() {
    return (
      <div style={styles.container}>
        <Input />
        {/* Previous shit down here */}
        <List />
      </div>
    )
  }
}

export default withAuthenticator(App)
