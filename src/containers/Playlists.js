import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appActions from '../redux/actions/appActions';
import * as playlistsActions from '../redux/actions/playlistsActions';

import { StyleSheet, View } from 'react-native';

import Header from '../components/Header';
import Button from '../components/Button';
import HeaderTitle from '../components/HeaderTitle';
import PlayerFooter from './PlayerFooter';

class Playlists extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <View style={[styles.left, styles.row]}>
            <Button text={'<'} onPress={() => this.props.navigation.goBack()} />
          </View>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            <HeaderTitle>Playlists</HeaderTitle>
          </View>
          <View style={[styles.right, styles.row]}>
            <Button text={'S'} onPress={() => this.props.navigation.navigate('Search', {})} />
          </View>
        </Header>
        <PlayerFooter navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c4c4c',
  },
  header: {
    backgroundColor: '#2E2E2E'
  },
  left: {
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  right: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row'
  },
});

const mapStateToProps = state => {
  return {
    isLoading: state.playlists.isLoading,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => playlistsActions.load()(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists);