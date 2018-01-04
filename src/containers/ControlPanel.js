import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as homeActions from '../redux/actions/homeActions';

import {
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native';
import Drawer from 'react-native-drawer';
import ControlPanelSection from '../components/ControlPanelSection';
import ControlPanelButton from '../components/ControlPanelButton';
import ControlPanelCover from '../components/ControlPanelCover';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 40,
    width: '$appWidth',
    height: '$appHeight',
    backgroundColor: 'rgba(43,0,98,0.95)',
    borderBottomRightRadius: '$appHeight * 0.4',
    elevation: 10
  },
  close: {
    position: 'absolute',
    top: 25,
    left: 25
  },
  closeIcon: {
    color: '$appMainTextColor'
  }
});

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this._renderControlPanel = this._renderControlPanel.bind(this);
    this._onRef = this._onRef.bind(this);
    this._selectedSectionChanged = this._selectedSectionChanged.bind(this);
    this._navigateTo = this._navigateTo.bind(this);
    this._backHandler = this._backHandler.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    return (
      <Drawer
        ref={this._onRef}
        content={this._renderControlPanel()}
        type='overlay'>
        {this.props.children}
      </Drawer>
    );
  }

  _renderControlPanel() {
    let currentSongName = this.props.currentSong ? this.props.currentSong.title : null;
    let currentSongArtist = this.props.currentSong ? this.props.currentSong.artist : null;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this._drawer.close()} style={styles.close}>
          <Icon size={30} style={styles.closeIcon} name={'close'} />
        </TouchableOpacity>
        <ControlPanelButton onPress={() => this._drawer.close()} text={this.props.dictionary.getWord('my_music').toUpperCase()} icon='music-note' />
        <ControlPanelButton onPress={() => this._selectedSectionChanged('playlists')} text={this.props.dictionary.getWord('playlists').toUpperCase()} icon='playlist-play' />
        <ControlPanelButton onPress={() => this._navigateTo('Favorites')} text={this.props.dictionary.getWord('favorites').toUpperCase()} icon='favorite' />
        <ControlPanelButton onPress={() => this._navigateTo('Queue')} text={this.props.dictionary.getWord('queue').toUpperCase()} icon='queue-music' />
        <ControlPanelButton onPress={() => { }} text={this.props.dictionary.getWord('equalizer').toUpperCase()} icon='equalizer' />
        <ControlPanelButton onPress={() => this._navigateTo('Settings')} text={this.props.dictionary.getWord('settings').toUpperCase()} icon='settings' />
      </View>
    );
  }

  _onRef(component) {
    this._drawer = component;
    this.props.onRef(component);
  }

  _selectedSectionChanged(section) {
    this.props.selectedSectionChanged(section);
    this._drawer.close();
  }

  _navigateTo(target) {
    this.props.navigation.navigate(target);
    this._drawer.close();
  }

  _backHandler() {
    if (this._drawer._open) {
      this._drawer.close();

      return true;
    }

    return false;
  }
}

const mapStateToProps = state => {
  return {
    selectedSection: state.home.selectedSection,
    currentSong: state.player.currentSong,
    dictionary: state.app.dictionary
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectedSectionChanged: (section) => homeActions.selectedSectionChanged(section)(dispatch),
  }
}

ControlPanel.propTypes = {
  selectedSection: PropTypes.string,
  currentSong: PropTypes.object,
  selectedSectionChanged: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);