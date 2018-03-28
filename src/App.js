import React, { Component } from 'react'
import 'bulma/css/bulma.css'
import { withAuthenticator, FederatedSignIn, ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact } from 'aws-amplify-react' // Or 'aws-amplify-react-native';

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
  signIn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginTop: '20px',
    marginBottom: '40px',
  },
  subtitle: {

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

const federated = {
  facebook_app_id: '442540206182549',
  google_client_id: '453030685440-dnqb50sp9a5pkrdbnjcbhps3v3psnqdu.apps.googleusercontent.com',
}
class SignInWrapper extends SignIn {
  render() {
    return (
      <div style={styles.signIn}>
        <p className="is-2 title" style={styles.title}>AWS Accent Demo App </p>
        <p className="is-6 subtitle" style={styles.subtitle}> Please use an oauth account to access the demo! </p>
        <FederatedSignIn federated={federated} {...this.props} />
      </div>
    )
  }
}

export default withAuthenticator(App, false, [
  <SignInWrapper />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <SignUp />,
  <ConfirmSignUp />,
  <ForgotPassword />,
])
