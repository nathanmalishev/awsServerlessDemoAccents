import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API, Auth, Storage, Analytics } from 'aws-amplify'
import AWS from 'aws-sdk'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

AWS.config.update({ region: 'ap-southeast-2' })

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
    margin: '50px',
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
}


class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '',
      text: '',
      S3Key: '',
      voiceId: 'Joanna',
      audioSrc: '',
      s3Voices: [],
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.talk = this.talk.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleTextChange(event) {
    this.setState({ text: event.target.value })
  }
  talk(e) {
    e.preventDefault()
    const { text, selectedOption } = this.state
    if (!text || !selectedOption) return
    console.log(text, selectedOption, 'see ya later')
    API.post('talk', '/items', { response: true, body: { text, voiceId: selectedOption.value } })
      .then((res) => {
        this.setState({ S3Key: res.data.key })

        Storage.vault.get(res.data.key)
          .then((data) => {
            this.setState({ audioSrc: data })
          })
          .catch(err => console.log(err, 'massive error'))
      })
      .catch(err => console.log(err, 'errr'))
  }

  componentWillUpdate(prevProps, nextState) {
    if (nextState.audioSrc !== this.state.audioSrc) {
      const typeWriter = new Audio(nextState.audioSrc)
      typeWriter.play()
    }
    console.log('next', nextState)
  }

  componentDidMount() {
    this.getAWSVoices((err, res) => {
      this.setState({ s3Voices: res, selectedOption: res[Math.floor(res.length * Math.random())] })
    })
  }

  getAWSVoices(cb) {
    Auth.currentCredentials()
      .then((creds) => {
        const polly = new AWS.Polly({ credentials: Auth.essentialCredentials(creds) })
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
  handleChange(selectedOption) {
    this.setState({ selectedOption})
  }

  render() {
    const { selectedOption } = this.state
    const value = selectedOption && selectedOption.value
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


        <input
          onChange={this.handleTextChange}
          style={styles.textBox}
          type="text"
          className="input is-large"
          placeholder="hello my name is vlad from russia"
        />

        <a
          style={styles.talkButton}
          className="button is-primary is-large"
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

export default Input
