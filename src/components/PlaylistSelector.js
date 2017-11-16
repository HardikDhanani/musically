import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  BackHandler
} from 'react-native';

const styles = EStyleSheet.create({
  mainContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '$appWidth',
    height: '$appHeight',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '$appWidth * 0.95',
    height: '$appHeight * 0.50',
    backgroundColor: '$headerBackgroundColor',
    justifyContent: 'space-between'
  },
  titleContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10
  },
  contentContainer: {
    marginHorizontal: 20,
  },
  buttonsContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  playlistContainer: {
    height: '$headerHeight * 0.8',
    justifyContent: 'center'
  },
  button: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  title: {
    fontSize: '$titleFontSize',
    color: '$headerColor',
    fontWeight: 'bold'
  },
  playlist: {
    color: '$headerColor',
    fontSize: '$textFontSize'
  },
  playlistDetail: {
    color: '$elementInactive',
    fontSize: '$detailFontSize',
    paddingLeft: 5
  }
});

class PlaylistSelector extends Component {
  constructor(props) {
    super(props);

    this._backHandler = this._backHandler.bind(this);
    this._renderPlaylist = this._renderPlaylist.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    this._mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{'Select playlist'}</Text>
          </View>
          <ScrollView style={styles.contentContainer}>
            <FlatList initialNumToRender={10} getItemLayout={(data, index) => ({ length: 56, offset: 56 * index, index })} data={this.props.playlists} renderItem={this._renderPlaylist} keyExtractor={(item, index) => index} />
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={this.props.onCancelPress}>
              <Icon name='clear' color={styles._icon.color} backgroundColor={styles._icon.backgroundColor} size={styles._icon.fontSize} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  _backHandler() {
    if (this._mounted) {
      this.props.onCancelPress();
    }

    return true;
  }

  _renderPlaylist(playlist){
    return (
      <TouchableOpacity onPress={() => this.props.onSelected(playlist.item)} style={styles.playlistContainer}>
        <Text style={styles.playlist}>{playlist.item.name}</Text>
        <Text style={styles.playlistDetail}>{playlist.item.songs.length + ' songs'}</Text>
      </TouchableOpacity>
    );
  }
}

PlaylistSelector.propTypes = {
  playlists: PropTypes.array,
  onSelected: PropTypes.func,
  onCancelPress: PropTypes.func,
};

export default PlaylistSelector;