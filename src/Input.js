import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API, Auth, Storage, Analytics } from 'aws-amplify'
import Polly from 'aws-sdk/clients/polly'
import Select from 'react-select'
import { connect } from 'react-redux'
import 'react-select/dist/react-select.css'
import { addTalk } from './actions'

// AWS.config.update({ region: 'ap-southeast-2' })

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textBox: {
    width: '600px',
  },
  textBoxDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '50px',
    width: '100%',
  },
  accentSelect: {
    width: '250px',
  },
  accentDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '3rem',
  },
  accentText: {
    margin: '5px',
    fontStyle: 'italic',
    color: '#4a4a4ac9',
  },
  talkButton: {

  },
  errorMsg: {
    color: 'red',
    fontSize: '20px',
    margin: '5px',
  },
}


class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '',
      text: '',
      S3Key: '',
      audioSrc: '',
      s3Voices: [],
      isLoading: false,
      error: false,
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.talk = this.talk.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getAWSVoices((err, res) => {
      this.setState({ s3Voices: res, selectedOption: res[Math.floor(res.length * Math.random())] })
    })
  }

  componentWillUpdate(prevProps, nextState) {
    if (nextState.audioSrc !== this.state.audioSrc) {
      // const typeWriter = new Audio(nextState.audioSrc)
      // typeWriter.play()
    }
  }

  getAWSVoices(cb) {
    Auth.currentCredentials()
      .then((creds) => {
        const polly = new Polly({ credentials: Auth.essentialCredentials(creds), region: 'ap-southeast-2' })
        polly.describeVoices({}, (err, data) => {
          if (err) {
            console.log(err)
            return cb(null, [])
          }

          // need to make our own data selector
          return cb(null, data.Voices.map(voice => ({ value: voice.Id, label: `${voice.Name} (${voice.LanguageName})` })))
        })
      })
  }
  talk(e) {
    e.preventDefault()
    const { text, selectedOption } = this.state
    if (!text || !selectedOption) return
    // analytics event
    Analytics.record('click_talk')
    this.setState({ isLoading: true })
    API.post('talk', '/items', { response: true, body: { text, voiceId: selectedOption.value } })
      .then((res) => {
        this.setState({ S3Key: res.data.key })

        Storage.vault.get(res.data.key)
          .then((data) => {
            this.setState({ audioSrc: data, isLoading: false, error: false })
            this.props.addTalk(res.data.key, selectedOption.value)
            const typeWriter = new Audio(data)
            typeWriter.play()
          })
          .catch((err) => {
            // console.log(err, 'massive error')
            this.setState({ isLoading: false, error: true })
          })
      })
      .catch((err) => {
        // console.log(err, 'errr')
        this.setState({ isLoading: false, error: true })
      })
  }
  handleChange(selectedOption) {
    this.setState({ selectedOption })
  }
  handleTextChange(event) {
    this.setState({ text: event.target.value })
  }

  render() {
    const { selectedOption } = this.state
    const value = selectedOption && selectedOption.value
    const errorMsg = (<p style={styles.errorMsg}>Sorry something went wrong please try agian later!</p>)
    return (
      <div style={styles.container}>
        <div style={styles.accentDiv}>
          <p className="subtitle is-4 is-spaced" style={styles.accentText}> Accent </p>
          <Select
            style={styles.accentSelect}
            arrowRenderer={null}
            name="form-field-name"
            value={value}
            onChange={this.handleChange}
            options={this.state.s3Voices}

          />
        </div>


        <div className={this.state.isLoading ? 'control is-loading is-large' : 'control'} style={styles.textBoxDiv}>
          <input
            onChange={this.handleTextChange}
            style={styles.textBox}
            type="text"
            className="input is-large"
            placeholder="hello my name is vlad from russia"
          />
        </div>

        {this.state.error ? errorMsg : null}
        <a
          style={styles.talkButton}
          className={this.state.isLoading ? 'button is-primary is-large is-loading' : 'button is-primary is-large'}
          onClick={this.talk}
        >
          TALK
        </a>

      </div>
    )
  }
}

Input.defaultProps = {}

Input.propTypes = {}

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.getTalkLoading,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addTalk: (key, name) => dispatch(addTalk(key, name)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Input)
