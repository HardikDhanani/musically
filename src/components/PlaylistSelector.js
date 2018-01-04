import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  FlatList
} from 'react-native';
import ModalFormWithAction from './common/forms/ModalFormWithAction';
import Text from './common/Text';
import Touchable from './common/buttons/Touchable';

const styles = EStyleSheet.create({
  contentContainer: {
    flex: 1
  },
  contentHeight: {
    height: '$modalFormHeight'
  },
  playlistContainer: {
    flexDirection: 'column',
    width: '$modalFormWidth',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  playlist: {
    color: '$textMainColor',
    fontSize: '$textFontSize'
  },
  playlistDetail: {
    color: '$elementInactive',
    fontSize: '$detailFontSize',
    paddingLeft: 5
  },
  addNewContainer: {
    flexDirection: 'column',
    width: '$modalFormWidth',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  addNew: {
    color: '$appMainColor',
    fontSize: '$textFontSize'
  }
});

class PlaylistSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPlaylist: null
    }

    this._renderPlaylist = this._renderPlaylist.bind(this);
    this._onPlayistSelected = this._onPlayistSelected.bind(this);
  }

  render() {
    return (
      <ModalFormWithAction
        style={{ height: styles._contentHeight.height }}
        actionText={this.props.addNewButtonText}
        title={this.props.title}
        onCancelPress={this.props.onCancelPress}
        onActionPress={() => {
          if (this.props.onPlaylistSelected) {
            this.props.onPlaylistSelected(this.state.selectedPlaylist);
          }
        }}
        actionEnabled={this.state.selectedPlaylist !== null}>
        <FlatList
          style={styles.contentContainer}
          initialNumToRender={8}
          data={this.props.playlists}
          renderItem={this._renderPlaylist}
          keyExtractor={(item, index) => index} />
        <Touchable onPress={this.props.onAddNewPress}>
          <View style={styles.addNewContainer}>
            <Text style={styles.addNew}>{this.props.addNewText}</Text>
          </View>
        </Touchable>
      </ModalFormWithAction>
    );
  }

  _renderPlaylist(playlist) {
    let fontWeight = (this.state.selectedPlaylist && this.state.selectedPlaylist.id === playlist.item.id) ? 'bold' : 'normal';
    let color = fontWeight === 'bold' ? styles._addNew.color : undefined;

    return (
      <Touchable onPress={() => this._onPlayistSelected(playlist.item)}>
        <View style={styles.playlistContainer}>
          <Text style={[styles.playlist, { fontWeight, color }]}>{playlist.item.name}</Text>
        </View>
      </Touchable>
    );
  }

  _onPlayistSelected(playlist) {
    this.setState({ selectedPlaylist: playlist });
  }
}

PlaylistSelector.propTypes = {
  title: PropTypes.string.isRequired,
  addNewText: PropTypes.string.isRequired,
  playlists: PropTypes.array.isRequired,
  onPlaylistSelected: PropTypes.func.isRequired,
  onAddNewPress: PropTypes.func
};

export default PlaylistSelector;