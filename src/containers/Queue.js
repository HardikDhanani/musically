import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import SortableListView from 'react-native-sortable-listview';

import * as queueActions from '../redux/actions/queueActions';
import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';

import {
  View,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';
import QueueHeader from '../components/QueueHeader';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import QueueSongMenu from '../components/QueueSongMenu';
import FloatMenu from '../components/FloatMenu';
import HeaderMenu from '../components/HeaderMenu';
import PlayerFooter from './PlayerFooter';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bodySecondaryBackgroundColor'
  }
});

class SorteableItem extends Component {
  render() {
    return (
      <SongCard
        {...this.props.sortHandlers}
        styles={{ container: styles.item, text: styles.itemText }}
        id={this.props.song.id}
        name={this.props.song.title}
        artist={this.props.song.artist}
        duration={this.props.song.duration}
        onOptionPressed={this.props.onOptionPressed}
        onPress={this.props.onPress} />
    )
  }
}

class Queue extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._removeFromQueue = this._removeFromQueue.bind(this);
    this._navigateTo = this._navigateTo.bind(this);
  }

  componentWillMount() {
    this.props.load();
  }

  render() {
    return (
      <View style={styles.container}>
        <QueueHeader
          onBackPress={() => this.props.navigation.goBack()}
          onMorePress={() => this.props.setMenu({ type: 'MENU' })} />
        <Body>
          {
            this.props.isLoading ?
              <ActivityIndicator animating={true} size='large' /> :
              <SortableListView
                style={{ flex: 1 }}
                data={this.props.queue}
                onRowMoved={e => {
                  this.props.moveSong(e.row.data.id, e.from, e.to);
                }}
                renderRow={this._renderSong}
                activeOpacity={0.5}
                disableAnimatedScrolling={true} />
          }
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </View>
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song
    };

    return (
      <SorteableItem
        song={song}
        targetMenu={targetMenu}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
        onPress={() => this.props.songChanged(song)} />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || this.props.targetMenu.caller !== 'QUEUE')
      return null;

    if (this.props.targetMenu.type.toLowerCase() === 'song') {
      return (
        <QueueSongMenu
          isFavorite={true}
          positionX={this.props.menuPositionX}
          positionY={this.props.menuPositionY}
          onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })}
          onPlayPress={() => this.props.playSong(this.props.targetMenu.payload)}
          onRemovePress={() => this._removeFromQueue(this.props.targetMenu.payload)}
          onArtistPress={() => this._navigateTo('Artist', { artistName: this.props.targetMenu.payload.artist })}
          onAlbumPress={() => this._navigateTo('Album', { artistName: this.props.targetMenu.payload.artist, albumName: this.props.targetMenu.payload.album })} />
      );
    }

    return (
      <HeaderMenu onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />
    );
  }

  _navigateTo(route, params) {
    this.props.setMenu(null, 0, 0);
    this.props.navigation.navigate(route, params);
  }

  _removeFromQueue(song) {
    this.props.setMenu(null, 0, 0);
    this.props.removeFromQueue(song);
  }
}

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
    songChanged: (song) => { },
    removeFromQueue: song => queueActions.removeFromQueue(song)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'QUEUE' }, positionX, positionY)),
    moveSong: (songId, from, to) => queueActions.moveSong(songId, from, to)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue);