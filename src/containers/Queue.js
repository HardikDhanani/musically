import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import SortableListView from 'react-native-sortable-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as queueActions from '../redux/actions/queueActions';
import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';

import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  BackHandler
} from 'react-native';
import QueueHeader from '../components/QueueHeader';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import QueueSongMenu from '../components/QueueSongMenu';
import FloatMenu from '../components/FloatMenu';
import HeaderMenu from '../components/HeaderMenu';
import CheckBox from '../components/common/buttons/CheckBox';
import Header from '../components/common/headers/Header';
import HeaderLeftSection from '../components/HeaderLeftSection';
import HeaderCenterSection from '../components/HeaderCenterSection';
import HeaderRightSection from '../components/HeaderRightSection';
import HeaderTitle from '../components/HeaderTitle';
import IconButton from '../components/common/buttons/IconButton';
import Touchable from '../components/common/buttons/Touchable';
import ConfirmationForm from '../components/ConfirmationForm';
import PlayerFooter from './PlayerFooter';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bodySecondaryBackgroundColor'
  },
  deleteSongContainer: {
    flexDirection: 'row',
    width: '$appWidth',
    height: '$headerHeight',
    backgroundColor: '$headerBackgroundColor',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 5
  },
  text: {
    color: '$headerColor',
    fontSize: '$textFontSize',
  },
  textBold: {
    color: '$headerColor',
    fontSize: '$bigTextFontSize',
    fontWeight: 'bold'
  },
  durationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '$headerHeight * 0.7',
    width: '$headerHeight * 0.7'
  },
  checkboxChecked: {
    color: '$elementActive',
  },
  checkboxUnchecked: {
    color: '$elementInactive',
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
  },
  icon: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  deleteFormContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center'
  },
  deleteButton: {
    flex: 1,
    width: '$appWidth',
    height: '$footerHeight',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButtonIcon: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
  },
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
    this._renderDeleteSong = this._renderDeleteSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._removeFromQueue = this._removeFromQueue.bind(this);
    this._navigateTo = this._navigateTo.bind(this);
    this._renderList = this._renderList.bind(this);
    this._renderDeleteList = this._renderDeleteList.bind(this);
    this._backHandler = this._backHandler.bind(this);
    this._renderDeleteConfirmation = this._renderDeleteConfirmation.bind(this);
  }

  componentWillMount() {
    this.props.load();
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    return (
      <View style={styles.container}>
        <QueueHeader
          title={this.props.dictionary.getWord('queue')}
          onBackPress={() => this.props.navigation.goBack()}
          onDeletePress={() => this.props.setDeleteModeOn()}
          onMorePress={() => this.props.setMenu({ type: 'MENU' })} />
        <Body>
          {
            this.props.isLoading ?
              <ActivityIndicator animating={true} size='large' /> :
              this._renderList()
          }
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
        {this._renderDeleteList()}
        {this._renderDeleteConfirmation()}
      </View>
    );
  }

  _renderList() {
    if (this.props.deleteMode) {
      return null;
    }

    return (
      <SortableListView
        style={{ flex: 1 }}
        data={this.props.queue}
        onRowMoved={e => {
          this.props.moveSong(e.row.data.id, e.from, e.to);
        }}
        renderRow={this._renderSong}
        activeOpacity={0.5}
        disableAnimatedScrolling={false} />
    );
  }

  _renderDeleteList() {
    if (!this.props.deleteMode) {
      return null;
    }

    return (
      <View style={styles.deleteFormContainer}>
        <Header>
          <HeaderLeftSection>
            <IconButton iconName='arrow-back' onPress={this.props.setDeleteModeOff} style={styles._button} iconSize={styles._button.fontSize - 2} />
          </HeaderLeftSection>
          <HeaderCenterSection>
            <HeaderTitle>{this.props.selected + ' selected'}</HeaderTitle>
          </HeaderCenterSection>
          <HeaderRightSection style={{ marginRight: 10 }}>
            <CheckBox onChange={this.props.onSelectAllPress} style={this.props.selectedAll ? styles.checkboxChecked : styles.checkboxUnchecked} />
          </HeaderRightSection>
        </Header>
        <Body>
          <FlatList
            data={this.props.queueDelete}
            renderItem={this._renderDeleteSong}
            keyExtractor={(item, index) => item.id} />
        </Body>
        <Touchable onPress={this.props.showDeleteSongsConfirmation}>
          <View style={styles.deleteButton}>
            <Icon name='delete' color={styles._deleteButtonIcon.color} backgroundColor={styles._deleteButtonIcon.backgroundColor} size={styles._deleteButtonIcon.fontSize} />
          </View>
        </Touchable>
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

  _renderDeleteSong({ item }) {
    let duration = '00:00';
    if (item.duration) {
      let d = new Date(parseInt(duration));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      duration = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }

    return (
      <View style={styles.deleteSongContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.songInformation}>
            <Text numberOfLines={1} style={styles.textBold}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.text}>{item.artist}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text numberOfLines={1} style={styles.text}>{duration}</Text>
          </View>
        </View>
        <CheckBox onChange={() => this.props.selectSong(item.id)} style={item.selected ? styles.checkboxChecked : styles.checkboxUnchecked} />
      </View>
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

  _renderDeleteConfirmation() {
    if (!this.props.showConfirmation) {
      return null;
    }

    return (
      <ConfirmationForm
        title={'Delete'}
        onCancelPress={this.props.deleteSelectedSongsCancel}
        onConfirmPress={() => this.props.deleteSelectedSongs(this.props.queueDelete)}>
        <Text style={styles.confirmationText}>{'You are removing ' + this.props.selected + ' from the queue.\nAre you sure?'}</Text>
      </ConfirmationForm>
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

  _backHandler() {
    if (this.props.deleteMode) {
      this.props.setDeleteModeOff();
      return true;
    }

    return false;
  }
}

const mapStateToProps = state => {
  return {
    queue: state.queue.queue,
    queueDelete: state.queue.queueDelete,
    deleteMode: state.queue.deleteMode,
    selectedAll: state.queue.selectedAll,
    selected: state.queue.selected,
    isLoading: state.queue.isLoading,
    showConfirmation: state.queue.showConfirmation,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
    dictionary: state.app.dictionary
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(queueActions.load()),
    songChanged: (song) => { },
    removeFromQueue: song => queueActions.removeFromQueue(song)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'QUEUE' }, positionX, positionY)),
    moveSong: (songId, from, to) => queueActions.moveSong(songId, from, to)(dispatch),
    selectSong: (songId) => dispatch(queueActions.selectSong(songId)),
    setDeleteModeOn: () => dispatch(queueActions.setDeleteModeOn()),
    setDeleteModeOff: () => dispatch(queueActions.setDeleteModeOff()),
    onSelectAllPress: () => dispatch(queueActions.onSelectAllPress()),
    showDeleteSongsConfirmation: () => dispatch(queueActions.showDeleteSongsConfirmation()),
    deleteSelectedSongsCancel: () => dispatch(queueActions.deleteSelectedSongsCancel()),
    deleteSelectedSongs: (queue) => queueActions.deleteSelectedSongs(queue)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue);