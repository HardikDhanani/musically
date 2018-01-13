import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as appActions from '../redux/actions/appActions';

import {
  View,
  StatusBar
} from 'react-native';
import Navigator from './Navigator';

class Root extends Component {
  componentWillMount() {
    this.props.start();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={'transparent'} translucent={true} barStyle='light-content' />
        <Navigator />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    start: () => appActions.start()(dispatch)
  }
}

Root.propTypes = {
  start: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);