import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as appActions from '../redux/actions/appActions';

import {
  View,
  Text
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$headerBackgroundColor',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Splash extends Component {
  constructor(props) {
    super(props);

    this._goHome = this._goHome.bind(this);
  }

  componentDidMount() {
    if (this.props.goHome) {
      this._goHome();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.goHome) {
      this._goHome();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 40, color: 'white' }}>Musically</Text>
      </View>
    );
  }

  _goHome() {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })]
    })
    this.props.navigation.dispatch(actionToDispatch);
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