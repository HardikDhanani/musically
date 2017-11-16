import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as homeActions from '../redux/actions/homeActions';

import {
  View,
  ScrollView
} from 'react-native';
import Drawer from 'react-native-drawer';
import ControlPanelSection from '../components/ControlPanelSection';
import ControlPanelButton from '../components/ControlPanelButton';
import ControlPanelCover from '../components/ControlPanelCover';

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this._renderControlPanel = this._renderControlPanel.bind(this);
    this._onRef = this._onRef.bind(this);
    this._selectedSectionChanged = this._selectedSectionChanged.bind(this);
    this._navigateTo = this._navigateTo.bind(this);
  }

  render() {
    return (
      <Drawer
        ref={this._onRef}
        content={this._renderControlPanel()}
        type='overlay'
        tapToClose={true}
        openDrawerOffset={0.15}>
        {this.props.children}
      </Drawer>
    );
  }

  _renderControlPanel() {
    let currentSongName = this.props.currentSong ? this.props.currentSong.title : null;
    let currentSongArtist = this.props.currentSong ? this.props.currentSong.artist : null;

    return (
      <ScrollView>
        <ControlPanelCover source={require('../images/music.png')} song={currentSongName} artist={currentSongArtist} />
        <ControlPanelSection>
          <ControlPanelButton onPress={() => this._selectedSectionChanged('playlists')} text={'Play Lists'} isActive={this.props.selectedSection === 'playlists'} icon='playlist-play' />
          <ControlPanelButton onPress={() => this._selectedSectionChanged('artists')} text={'Artists'} isActive={this.props.selectedSection === 'artists'} icon='person' />
          <ControlPanelButton onPress={() => this._selectedSectionChanged('albums')} text={'Albums'} isActive={this.props.selectedSection === 'albums'} icon='album' />
          <ControlPanelButton onPress={() => this._selectedSectionChanged('genres')} text={'Genres'} isActive={this.props.selectedSection === 'genres'} icon='music-note' />
          <ControlPanelButton onPress={() => this._selectedSectionChanged('songs')} text={'Songs'} isActive={this.props.selectedSection === 'songs'} icon='music-note' />
        </ControlPanelSection>
        <ControlPanelSection>
          <ControlPanelButton onPress={() => this._navigateTo('Queue')} text={'Queue'} isActive={false} icon='queue-music' />
          <ControlPanelButton onPress={() => this._navigateTo('Favorites')} text={'Favorites'} isActive={false} icon='favorite' />
        </ControlPanelSection>
        <ControlPanelSection>
          <ControlPanelButton onPress={() => { }} text={'Equalizer'} isActive={false} icon='equalizer' />
          <ControlPanelButton onPress={() => { }} text={'Settings'} isActive={false} icon='settings' />
        </ControlPanelSection>
      </ScrollView>
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
}

const mapStateToProps = state => {
  return {
    selectedSection: state.home.selectedSection,
    currentSong: state.player.currentSong,
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