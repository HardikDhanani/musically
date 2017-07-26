import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import * as homeActions from '../actions/homeActions';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    const { state, actions } = this.props;
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    state: state.home
  }
}

const mapDispatchToProps = dispatch => {
  return {
    homeActions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);