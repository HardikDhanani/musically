import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as queueActions from '../redux/actions/queueActions';
import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';

import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, FlatList, StatusBar, Dimensions } from 'react-native';

import Header from '../components/Header';
import Title from '../components/Title';
import SongCard from '../components/SongCard';
import FloatMenu from '../components/FloatMenu';
import PlayerFooter from './PlayerFooter';

class Queue extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
  }

  componentWillMount() {
    this.props.load();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.buttonText}>{'<<'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            <Title style={styles.title}>List Queue</Title>
          </View>
          <View style={[styles.right, styles.row]}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.setMenu({ target: 'MENU' })}>
              <Text style={styles.buttonText}>{'+'}</Text>
            </TouchableOpacity>
          </View>
        </Header>
        <View style={[styles.body, { height: this._getHeight() }]}>
          {
            this.props.isLoading ?
              <ActivityIndicator animating={true} size='large' /> :
              <FlatList initialNumToRender={10} getItemLayout={(data, index) => ({ length: 56, offset: 56 * index, index })} data={this.props.queue} renderItem={this._renderSong} keyExtractor={this._keyExtractor} />
          }
        </View>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </View>
    );
  }

  _getHeight() {
    let footerHeight = 60;
    let headerHeight = Header.currentHeight;
    let statusBarHeight = StatusBar.currentHeight;
    let windowHeight = Dimensions.get('window').height;

    return windowHeight - (headerHeight + footerHeight + statusBarHeight);
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song.item
    };

    return (
      <View key={song.index}>
        <SongCard
          styles={{ container: styles.item, text: styles.itemText }}
          id={song.item.id}
          name={song.item.title}
          artist={song.item.artist}
          duration={song.item.duration}
          onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
          onPress={() => this.props.songChanged(song.item)}
        />
      </View>
    );
  }
  _keyExtractor(item, index) {
    return index;
  }

  _renderMenu() {
    if (!this.props.showMenu)
      return null;

    return (
      <FloatMenu positionY={this.props.menuPositionY} positionX={this.props.menuPositionX} onPress={() => this.props.setMenu(null, 0, 0)}>
        {this._getTargetMenu(this.props.targetMenu)}
      </FloatMenu>
    );
  }

  _getTargetMenu(target) {
    switch (target.type) {
      case 'SONG':
        return this._getSongMenu(target.payload);

      default:
        return this._getMenu();
    }
  }

  _getMenu() {
    return [
      (
        <TouchableOpacity key={1} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Sort Order'}</Text>
          <Text style={styles.floatMenuOptionText}>{'>'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={2} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'View Mode'}</Text>
          <Text style={styles.floatMenuOptionText}>{'>'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={3} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Rescan Library'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={4} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Playlist Queue'}</Text>
        </TouchableOpacity>
      )
    ];
  }

  _getSongMenu(song) {
    return [
      (
        <TouchableOpacity key={1} style={styles.floatMenuOption} onPress={() => this.props.playSong(song)}>
          <Text style={styles.floatMenuOptionText}>{'Play'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={2} style={styles.floatMenuOption} onPress={() => this._navigateTo('Artist', { artistName: song.artist })}>
          <Text style={styles.floatMenuOptionText}>{'Artist'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={3} style={styles.floatMenuOption} onPress={() => this._navigateTo('Album', { artistName: song.artist, albumName: song.album })}>
          <Text style={styles.floatMenuOptionText}>{'Album'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={4} style={styles.floatMenuOption} onPress={() => this._removeFromQueue(song)}>
          <Text style={styles.floatMenuOptionText}>{'Remove from Queue'}</Text>
        </TouchableOpacity>
      )
    ]
  }

  _navigateTo(route, params) {
    this.props.navigation.navigate(route, params);
    this.props.setMenu(null, 0, 0);
  }

  _removeFromQueue(song) {
    this.props.removeFromQueue(song);
    this.props.setMenu(null, 0, 0);
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
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  left: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  title: {
    color: 'white',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    height: Header.currentHeight * 0.7,
    width: Header.currentHeight * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  floatMenuOption: {
    flexDirection: 'row',
    height: Header.currentHeight * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  floatMenuOptionText: {
    fontSize: 15,
    color: 'white'
  }
});

const mapStateToProps = state => {
  return {
    queue: state.queue.queue,
    isLoading: state.queue.isLoading,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(queueActions.load()),
    songChanged: (song) => playerActions.songChanged(song, null)(dispatch),
    removeFromQueue: song => queueActions.removeFromQueue(song)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue);