import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API, Auth, Storage, Analytics } from 'aws-amplify'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

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
    width: '200px',
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
      audioSrc: ''
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.talk = this.talk.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(selectedOption) {
    this.setState({ selectedOption })
    console.log(`Selected: ${selectedOption.label}`)
  }
  handleTextChange(event) {
    this.setState({ text: event.target.value })
  }
  talk(e) {
    e.preventDefault()
    const { text, voiceId } = this.state
    console.log('talk', text, voiceId)
    if (!text || !voiceId) return
    API.post('talk', '/items', { response: true, body: { text, voiceId } })
      .then((res) => {
        console.log(res.data.key, 'apple')
        this.setState({ S3Key: res.data.key })
        
        Storage.vault.get(res.data.key)
          .then(data =>{
            console.log(data, 'great success')
              this.setState({audioSrc: data})
          })
          .catch(err => console.log(err, 'massive error'))
      })
      .catch(err => console.log(err, 'errr'))
  }

  render() {
    const { selectedOption } = this.state
    const value = selectedOption && selectedOption.value
    if(this.state.audioSrc) {
      return (
                    <audio src={this.state.audioSrc} controls />
      )
    }
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
            options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
          />
        </div>


        <input
          onChange={this.handleTextChange}
          style={styles.textBox}
          type="text"
          className="input is-large"
          placeholder="hello my name is vlad from russia"
        />
        <textarea className="textarea" style={styles.textBox} placeholder="Textarea" />

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
