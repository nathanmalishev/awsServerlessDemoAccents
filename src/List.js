import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { API, Auth, Storage, Analytics } from 'aws-amplify'

class List extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    Storage.vault.list('')
      .then(res => console.log(res))
      .catch(err => console.log(err))
    return (
      <div>
        
      </div>
    );
  }
}

export default List;
