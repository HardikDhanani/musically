import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as appActions from '../redux/actions/appActions';

import {
  View
} from 'react-native';
import Navigator from './Navigator';

class Root extends Component {
  componentWillMount() {
    this.props.start();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Navigator />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isReady: state.app.isReady
  }
}

const mapDispatchToProps = dispatch => {
  return {
    start: () => appActions.start()(dispatch)
  }
}

Root.propTypes = {
  isReady: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);