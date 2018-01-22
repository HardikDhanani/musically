import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import * as appActions from '../redux/actions/appActions';

import {
  Image,
  View,
  Animated
} from 'react-native';
import Text from '../components/common/Text';

const styles = EStyleSheet.create({
  appHeight: {
    height: '$appHeight'
  },
  gradientContainer: {
    height: '$appHeight',
    width: '$appWidth'
  },
  container: {
    width: '$appWidth',
    height: '$appHeight',
    backgroundColor: '$headerBackgroundColor',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  },
  image: {
    width: '$appWidth * 0.7',
    height: '$appWidth * 0.7'
  },
  fullScreenImageContainer: {
    width: '$appWidth',
    height: '$appHeight',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  fullScreenImage: {
    width: '$appWidth * 0.7',
    height: '$appWidth * 0.7'
  },
  text: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 50
  }
});

class Splash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: new Animated.Value(-styles._appHeight.height)
    }

    this._goHomeOrChangeBackground = this._goHomeOrChangeBackground.bind(this);
  }

  componentDidMount() {
    this._goHomeOrChangeBackground(this.props.goHome);
  }

  componentWillReceiveProps(nextProps) {
    this._goHomeOrChangeBackground(nextProps.goHome);
  }

  render() {
    let { top } = this.state;

    return (
      <Animated.View style={{ top }}>
        <LinearGradient
          start={{ x: 1.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={[styles._gradientStart.color, styles._gradientEnd.color]}
          style={styles.container}>
          <Image source={require('../images/splash-logo-white.png')} style={styles.image} />
        </LinearGradient>
        <View style={styles.fullScreenImageContainer}>
          <Image source={require('../images/(t-3).png')} style={styles.fullScreenImage} />
          <Text style={styles.text}>
            <Text style={{ color: 'green' }}>console</Text>
            <Text style={{ color: 'white' }}>.</Text>
            <Text style={{ color: 'yellow' }}>log</Text>
            <Text style={{ color: 'white' }}>(</Text>
            <Text style={{ color: 'red' }}>'Revolutioning the innovation...'</Text>
            <Text style={{ color: 'white' }}>);</Text>
          </Text>
        </View>
      </Animated.View>
    );
  }

  _goHomeOrChangeBackground(goHome = false) {
    if (goHome) {
      const actionToDispatch = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })]
      })
      this.props.navigation.dispatch(actionToDispatch);
    } else {
      setTimeout(() => {
        Animated.timing(
          this.state.top,
          {
            toValue: 0,
            duration: 300,
          }
        ).start();
      }, 2000);
    }
  }
}

const mapStateToProps = state => {
  return {
    goHome: state.app.goHome
  }
}

Splash.propTypes = {
  goHome: PropTypes.bool
};

export default connect(mapStateToProps, {})(Splash);