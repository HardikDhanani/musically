import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View } from 'react-native';

import Navigator from './Navigator';
import * as appActions from '../redux/actions/appActions';

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

export default connect(mapStateToProps, mapDispatchToProps)(Root);