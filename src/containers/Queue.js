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
  ActivityIndicator,
  FlatList,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import Container from '../components/Container';
import QueueHeader from '../components/QueueHeader';
import QueueDeleteModeHeader from '../components/QueueDeleteModeHeader';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import CheckBox from '../components/common/buttons/CheckBox';
import IconButton from '../components/common/buttons/IconButton';
import Touchable from '../components/common/buttons/Touchable';
import ConfirmationForm from '../components/ConfirmationForm';
import PlayerFooter from './PlayerFooter';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';
import RowCard from '../components/common/cards/RowCard';
import Text from '../components/common/Text';

const styles = EStyleSheet.create({
  listContainer: {
    width: '$appWidth'
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
    color: '$textColor',
    fontSize: '$textFontSize'
  },
  textBold: {
    color: '$textMainColor',
    fontSize: '$bigTextFontSize'
  },
  durationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '$headerHeight * 0.7',
    width: '$headerHeight * 0.7'
  },
  checkboxChecked: {
    color: '$appMainColor',
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
    backgroundColor: '$appMainColor',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10
  },
  deleteButtonIcon: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
  },
  confirmationTextContainer: {
    marginHorizontal: 10,
    marginBottom: 10
  }
});

class SorteableItem extends Component {
  render() {
    return (
      <TouchableOpacity {...this.props.sortHandlers}>
        <SongCard
          styles={{ container: styles.item, text: styles.itemText }}
          id={this.props.song.id}
          name={this.props.song.title}
          artist={this.props.song.artist}
          duration={this.props.song.duration}
          onOptionPress={this.props.onOptionPress}
          onPlayPress={this.props.onPlayPress}
          onLikePress={this.props.onLikePress} />
      </TouchableOpacity>
    )
  }
}

class Queue extends Component {
  constructor(props) {
    super(props);

    this._renderDeleteMode = this._renderDeleteMode.bind(this);
    this._renderViewMode = this._renderViewMode.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderDeleteSong = this._renderDeleteSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._removeFromQueue = this._removeFromQueue.bind(this);
    this._navigateTo = this._navigateTo.bind(this);
    this._renderList = this._renderList.bind(this);
    this._backHandler = this._backHandler.bind(this);
    this._renderDeleteConfirmation = this._renderDeleteConfirmation.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
  }

  componentWillMount() {
    this.props.load();
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    if (this.props.deleteMode) {
      return this._renderDeleteMode();
    }

    return this._renderViewMode();
  }

  _renderDeleteMode() {
    return (
      <Container fillStatusBar={false}>
        <QueueDeleteModeHeader
          title={this.props.selected + ' selected'}
          selectedAll={this.props.selectedAll}
          onBackPress={this.props.setDeleteModeOff}
          onSelectAllPress={this.props.onSelectAllPress} />
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
        {this._renderDeleteConfirmation()}
      </Container>
    );
  }

  _renderViewMode() {
    return (
      <Container>
        <QueueHeader
          title={this.props.dictionary.getWord('queue')}
          onBackPress={() => this.props.navigation.goBack()}
          onDeletePress={() => this.props.setDeleteModeOn()} />
        <Body>
          {
            this.props.isLoading ?
              <ActivityIndicator animating={true} size='large' /> :
              this._renderList()
          }
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </Container>
    );
  }

  _renderList() {
    if (this.props.deleteMode) {
      return null;
    }

    return (
      <SortableListView
        style={styles.listContainer}
        data={this.props.queue}
        onRowMoved={e => {
          this.props.moveSong(e.row.data.id, e.from, e.to);
        }}
        renderRow={this._renderSong}
        activeOpacity={0.5}
        disableAnimatedScrolling={false} />
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
        onOptionPress={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSongs([song])}
        onLikePress={() => this.props.like('song', song)} />
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
      <RowCard onPress={() => this.props.selectSong(item.id)}>
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
      </RowCard>
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'QUEUE')
      return null;

    return (
      <ModalForm
        title={this.props.targetMenu.payload.title}
        onCancelPress={() => this.props.setMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={'Remove from queue'}
          onPress={() => this._removeFromQueue(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={'File detail'}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _renderDeleteConfirmation() {
    if (!this.props.showConfirmation) {
      return null;
    }

    return (
      <ConfirmationForm
        title={'Delete from queue'}
        actionText={'Delete'}
        onCancelPress={this.props.deleteSelectedSongsCancel}
        onConfirmPress={() => this.props.deleteSelectedSongs(this.props.queueDelete)}>
        <View style={styles.confirmationTextContainer}>
          <Text style={styles.confirmationText}>{'You are removing ' + this.props.selected + ' songs from the queue.\n'}</Text>
          <Text style={styles.confirmationText}>{'Are you sure?'}</Text>
        </View>
      </ConfirmationForm>
    );
  }

  _navigateTo(route, params) {
    this.props.setMenu(null, 0, 0);
    this.props.navigation.navigate(route, params);
  }

  _removeFromQueue(song) {
    this.props.setMenu(null);
    this.props.removeFromQueue(song);
  }

  _backHandler() {
    if (this.props.deleteMode) {
      this.props.setDeleteModeOff();
      return true;
    }

    return false;
  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.navigation.navigate('PlaylistSelector', { song })
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
    setMenu: (target) => dispatch(appActions.setMenu({ ...target, caller: 'QUEUE' })),
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