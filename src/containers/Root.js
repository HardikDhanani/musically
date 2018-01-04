import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import * as appActions from '../redux/actions/appActions';

import {
  View,
  StatusBar
} from 'react-native';
import Navigator from './Navigator';

const styles = EStyleSheet.create({
  container: {
    height: StatusBar.currentHeight
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  }
});

class Root extends Component {
  componentWillMount() {
    this.props.start();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={'transparent'} translucent={true} barStyle='light-content' />
        <LinearGradient
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={[styles._gradientStart.color, styles._gradientEnd.color]}
          style={styles.container} />
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