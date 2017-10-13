import React, { Component } from 'react';
import { connect } from 'react-redux';
import StyleManager from '../styles/StyleManager';

import * as appActions from '../redux/actions/appActions';

import { View, Text } from 'react-native';

class Splash extends Component {
  constructor(props) {
    super(props);

    this._containerStyle = StyleManager.getStyle('SplashContainer');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.goHome)
      this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={this._containerStyle}>
        <Text style={{ fontSize: 40, color: 'white' }}>Musically</Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    goHome: state.app.goHome
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);