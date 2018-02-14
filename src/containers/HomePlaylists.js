import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as homeActions from '../redux/actions/homeActions';

import {
  FlatList,
  View,
  Text
} from 'react-native';
import Body from '../components/Body';
import AddPlaylistButton from '../components/common/buttons/AddPlaylistButton';
import ConfirmationForm from '../components/common/forms/ConfirmationForm';
import NewPlaylist from '../components/NewPlaylist';
import FourCoverCard from '../components/common/cards/FourCoverCard';
import RowCoverCard from '../components/common/cards/RowCoverCard';
import CoverCard from '../components/common/cards/CoverCard';
import BodyActivityIndicator from '../components/common/BodyActivityIndicator';

const styles = EStyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 25
  }
});

const FETCH_NUMBER = 40;

class HomePlaylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
      lastPosition: 0
    }

    this._showNewPlaylistForm = this._showNewPlaylistForm.bind(this);
    this._getPlaylistName = this._getPlaylistName.bind(this);
    this._handleOnEndReached = this._handleOnEndReached.bind(this);
    this._renderPlaylist = this._renderPlaylist.bind(this);
    this._renderRowPlaylist = this._renderRowPlaylist.bind(this);
    this._renderCardPlaylist = this._renderCardPlaylist.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.playlists && this.state.lastPosition === 0) {
  //     this.setState({
  //       playlists: nextProps.playlists.slice(0, FETCH_NUMBER),
  //       lastPosition: FETCH_NUMBER
  //     });
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.itemViewMode !== this.props.itemViewMode
      || nextProps.playlists !== this.props.playlists
      || nextProps.language !== this.props.language
      || nextProps.isReady !== this.props.isReady
      || nextProps.selectedSection !== this.props.selectedSection
      || nextProps.showNewPlaylistForm !== this.props.showNewPlaylistForm
      || nextState.lastPosition !== this.state.lastPosition;
  }

  render() {
    return (
      <View>
        <Body hasPaginationHeader={true}>
          {
            !this.props.isReady ?
              <BodyActivityIndicator /> :
              <FlatList
                data={this.state.playlists}
                showsVerticalScrollIndicator={false}
                onEndReached={this._handleOnEndReached}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => this._renderPlaylist(item)}
                keyExtractor={(item, index) => 'column_' + item.id}
                style={{ flexDirection: 'column', alignSelf: 'flex-start' }}
                numColumns={this.props.itemViewMode === 'row' ? 1 : 2}
                key={this.props.itemViewMode} />
          }
        </Body>
        {
          (this.props.isReady && !this.props.scanningSongs) ?
            <AddPlaylistButton hide={this.props.selectedSection !== 'playlists'} bottom={80} style={styles.addButton} onPress={this.props.createNewPlaylistForm} /> :
            null
        }
        {this._showNewPlaylistForm()}
      </View>
    );
  }

  _renderPlaylist(playlist) {
    if (this.props.itemViewMode === 'row') {
      return this._renderRowPlaylist(playlist);
    } else {
      return this._renderCardPlaylist(playlist);
    }
  }

  _renderRowPlaylist(playlist) {
    let name = this._getPlaylistName(playlist.name);
    let detail = playlist.songs.length + ' ' + this.props.dictionary.getWord('songs');

    return (
      <RowCoverCard
        showFavoriteButton={false}
        title={name}
        detail={detail}
        cover={this._getDefaultCover(playlist.songs)}
        onPress={() => this.props.navigation.navigate('Playlist', { playlistId: playlist.id })} />
    );
  }

  _renderCardPlaylist(playlist) {
    let onPress = () => this.props.navigation.navigate('Playlist', { playlistId: playlist.id });
    let name = this._getPlaylistName(playlist.name);
    let detail = playlist.songs.length + ' ' + this.props.dictionary.getWord('songs');
    let source = require('../images/default-cover.png');

    if (playlist.songs.length > 1) {
      return (
        <FourCoverCard
          items={this._getCovers(playlist.songs)}
          defaultSource={source}
          title={name}
          detail={detail}
          onPress={onPress} />
      );
    }

    return (
      <CoverCard
        onPress={onPress}
        source={source}
        imageUri={this._getDefaultCover(playlist.songs)}
        title={name}
        detail={detail} />
    )
  }

  _getDefaultCover(songs) {
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].cover) {
        return songs[i].cover;
      }
    }

    return null;
  }

  _showNewPlaylistForm() {
    if (this.props.showNewPlaylistForm) {
      return (
        <NewPlaylist
          backgroundTransparent={false}
          title={this.props.dictionary.getWord('create_playlist')}
          createButtonText={this.props.dictionary.getWord('create').toUpperCase()}
          onPlaylistCreated={this.props.newPlaylistConfirmed}
          onCancelPress={this.props.closeNewPlaylistForm}
          defaultValue={this.props.dictionary.getWord('my_playlist')} />
      );
    }

    return null;
  }

  _getCovers(items) {
    let ret = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].cover) {
        let j = ret.findIndex(r => r.imageUri === items[i].cover)
        if (j === -1) {
          ret.push({ imageUri: items[i].cover });
        }
      }

      if (ret.length === 4) {
        break;
      }
    }

    if (ret.length === 2) {
      ret = [
        ret[0],
        { imageUri: null },
        { imageUri: null },
        ret[1]
      ]
    }

    return ret;
  }

  _getPlaylistName(name) {
    switch (name.toLowerCase()) {
      case 'most played':
        return this.props.dictionary.getWord('mostPlayed');
      case 'favorites':
        return this.props.dictionary.getWord('favorites');
      case 'recently played':
        return this.props.dictionary.getWord('recentlyPlayed');
      default:
        return name;
    }
  }

  _handleOnEndReached(info) {
    if (this.state.playlists.length < this.props.playlists.length) {
      let playlists = this.state.playlists.concat(this.props.playlists.slice(this.state.lastPosition, this.state.lastPosition + FETCH_NUMBER));
      this.setState({
        playlists,
        lastPosition: this.state.lastPosition + FETCH_NUMBER
      });
    }
  }
}

const mapStateToProps = state => {
  return {
    language: state.app.language,
    isReady: state.app.homePlaylistsReady,
    playlists: state.app.playlists,
    dictionary: state.app.dictionary,
    selectedSection: state.home.selectedSection,
    showNewPlaylistForm: state.home.showNewPlaylistForm,
    itemViewMode: state.home.itemViewMode,
    scanningSongs: state.app.scanningSongs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createNewPlaylistForm: () => dispatch(homeActions.createNewPlaylistForm()),
    closeNewPlaylistForm: () => dispatch(homeActions.closeNewPlaylistForm()),
    newPlaylistConfirmed: (playlistName) => homeActions.newPlaylistConfirmed(playlistName)(dispatch)
  }
}

HomePlaylists.propTypes = {
  navigation: PropTypes.object.isRequired,
  dictionary: PropTypes.object.isRequired,
  isReady: PropTypes.bool.isRequired,
  playlists: PropTypes.array.isRequired,
  selectedSection: PropTypes.string.isRequired,
  showNewPlaylistForm: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  itemViewMode: PropTypes.string.isRequired,
  createNewPlaylistForm: PropTypes.func.isRequired,
  closeNewPlaylistForm: PropTypes.func.isRequired,
  newPlaylistConfirmed: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePlaylists);