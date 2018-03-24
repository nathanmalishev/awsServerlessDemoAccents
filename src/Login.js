import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  form: {
    width: '450px',
    display: 'flex',
    flexDirection: 'column',
  },
}

function Login({ ...props }) {
  return (
    <div style={styles.form}>
      <div className="field">
        <label className="label">Username</label>
        <div className="control has-icons-left has-icons-right">
          <input className="input is-success" type="text" placeholder="Text input" value="bulma" />
          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check" />
          </span>
        </div>
        <p className="help is-success">This username is available</p>
      </div>
    </div>
  )
}

Login.defaultProps = {}

Login.propTypes = {}

export default Login
