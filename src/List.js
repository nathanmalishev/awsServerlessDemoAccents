import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API, Auth, Storage, Analytics } from 'aws-amplify'
import { connect } from 'react-redux'
import { initTalks, addTalk, startLoading, endLoading } from './actions'


const styles = {
  container: {
    flexDirection: 'column',
    display: 'flex',
    marginTop: '100px',
    alignItems: 'center'
  },
  item: {
    margin: '5px',
    minWidth: '300px',
  },
  icon: {
    width: '30px',
    height: '30px',
  },
  tableHeading: {
    margin: '5px',
    fontStyle: 'italic',
    color: '#4a4a4ac9',
  }
}

const List = ({ list, handleAudioClick }) => {
  if (!list || list.length === 0) {
    return null
  }

  return list.map(item => (
    <tr onClick={() => handleAudioClick(item.key)}>
      <td>
        <p key={item.key} style={styles.item}> {item.name} </p>
      </td>
      <td>
        <img src="https://s3-ap-southeast-2.amazonaws.com/assets-ncu4cpljpr5b/DEMOS/ACCENTS/93134-200.png" style={styles.icon} />
      </td>
    </tr>
  ))
}


class ListContainer extends Component {
  componentDidMount() {
    this.props.startLoading('listTalks_GET_DATA')
    Storage.vault.list('')
      .then((res) => {
        // need to sort this shit :(
        const resItemAdded = res.map((item) => {
          const timeStamp = item.key.split('_')[1].split('.')[0]
          const newItem = item
          newItem.name = `${item.key.split('_')[0]}`
          newItem.timeStamp = timeStamp
          return item
        })
        resItemAdded.sort((a, b) => {
          if (a.timeStamp < b.timeStamp) { return 1 } else if (a.timeStamp > b.timeStamp) { return -1 }
          return 0
        })
        this.props.initTalks(resItemAdded)
        this.props.startLoading('listTalks_RECIEVE_DATA')
      })
      .catch((err) => {
        this.props.endLoading('listTalks_RECIEVE_ERROR')
        console.log(err)
      })
  }

  playSound(key) {
    Storage.vault.get(key)
      .then((data) => {
        const typeWriter = new Audio(data)
        typeWriter.play()
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div style={styles.container}>
        <p className="is-4 is-spaced subtitle" style={styles.tableHeading}> Recents </p> 
        <table className="table is-fullwidth is-hoverable">
          <thead>
            <th> Voice </th>
            <th> Play </th>
          </thead>
          <tbody>
            <List list={this.props.talks} handleAudioClick={this.playSound} />
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  talks: state.talks,
  isLoading: state.listTalksLoading,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  initTalks: (keys) => dispatch(initTalks(keys)),
  addTalk: (key, name) => dispatch(addTalk(key, name)),
  startLoading: actionType => dispatch(startLoading(actionType)),
  endLoading: actionType => dispatch(endLoading(actionType)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListContainer)
