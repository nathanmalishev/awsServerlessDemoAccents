import React, { Component } from 'react'
import 'bulma/css/bulma.css'
import Amplify, { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react' // Or 'aws-amplify-react-native';

import aws_exports from './aws-exports'
import Input from './Input'

Amplify.configure(aws_exports)

const styles = {
  container: {
    display: 'flex',
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
      </div>
    )
  }
}

export default withAuthenticator(App)
