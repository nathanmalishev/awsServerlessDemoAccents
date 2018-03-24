import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    }
  }
  handleChange(selectedOption) {
    this.setState({ selectedOption })
    console.log(`Selected: ${selectedOption.label}`)
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
            onChange={this.handleChange.bind(this)}
            options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
          />
        </div>


        <input style={styles.textBox} type="text" className="input is-large" placeholder="hello my name is vlad from russia" />

        <a style={styles.talkButton} className="button is-primary is-large"> TALK </a>

      </div>
    )
  }
}

Input.defaultProps = {}

Input.propTypes = {}

export default Input
