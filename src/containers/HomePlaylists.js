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
import ConfirmationForm from '../components/ConfirmationForm';
import NewPlaylist from '../components/NewPlaylist';
import FourCoverCard from '../components/common/cards/FourCoverCard';
import CoverCard from '../components/common/cards/CoverCard';
import BodyActivityIndicator from '../components/common/BodyActivityIndicator';

const styles = EStyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 25
  }
});

class HomePlaylists extends Component {
  constructor(props) {
    super(props);

    this._renderPlaylist = this._renderPlaylist.bind(this);
    this._showNewPlaylistForm = this._showNewPlaylistForm.bind(this);
    this._getPlaylistName = this._getPlaylistName.bind(this);
  }

  render() {
    return (
      <View>
        <Body hasPaginationHeader={true}>
          {
            !this.props.isReady ?
              <BodyActivityIndicator /> :
              <FlatList
                data={this.props.playlists}
                renderItem={this._renderPlaylist}
                keyExtractor={(item, index) => item.id}
                initialNumToRender={8}
                style={{ flexDirection: 'column' }}
                numColumns={2} />
          }
        </Body>
        {
          this.props.isReady ?
            <AddPlaylistButton hide={this.props.selectedSection !== 'playlists'} bottom={80} style={styles.addButton} onPress={this.props.createNewPlaylistForm} /> :
            null
        }
        {this._showNewPlaylistForm()}
      </View>
    );
  }

  _renderPlaylist({ item }) {
    let onPress = () => this.props.navigation.navigate('Playlist', { playlistId: item.id });
    let name = this._getPlaylistName(item.name);
    let detail = item.songs.length + ' ' + this.props.dictionary.getWord('songs');
    let source = require('../images/music.png');

    if (item.songs.length > 1) {
      return (
        <FourCoverCard
          items={this._getCovers(item.songs)}
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
        imageUri={item.songs[0] ? item.songs[0].cover : null}
        title={name}
        detail={detail} />
    )
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
}

const mapStateToProps = state => {
  return {
    isReady: state.app.homePlaylistsReady,
    playlists: state.app.playlists,
    dictionary: state.app.dictionary,
    selectedSection: state.home.selectedSection,
    showNewPlaylistForm: state.home.showNewPlaylistForm,
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
  isReady: PropTypes.bool,
  playlists: PropTypes.array.isRequired,
  navigation: PropTypes.any.isRequired,
  dictionary: PropTypes.any.isRequired,
  selectedSection: PropTypes.string,
  showNewPlaylistForm: PropTypes.bool,
  createNewPlaylistForm: PropTypes.func,
  closeNewPlaylistForm: PropTypes.func,
  newPlaylistConfirmed: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePlaylists);