import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as appActions from '../redux/actions/appActions';

import { StyleSheet, View, Text } from 'react-native';

class Splash extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.goHome)
      this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Musically</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 40,
    color: 'white'
  }
});

const mapStateToProps = state => {
  return {
    goHome: state.app.goHome
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);