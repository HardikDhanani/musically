import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as homeActions from '../redux/actions/homeActions';

import { StyleSheet, StatusBar, Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Drawer from 'react-native-drawer'

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this._renderControlPanel = this._renderControlPanel.bind(this);
    this._onRef = this._onRef.bind(this);
    this._renderSections = this._renderSections.bind(this);
    this._selectedSectionChanged = this._selectedSectionChanged.bind(this);
    this._navigateToQueue = this._navigateToQueue.bind(this);
    this._navigateToFavorites = this._navigateToFavorites.bind(this);
  }

  render() {
    return (
      <Drawer
        ref={this._onRef}
        content={this._renderControlPanel(() => this._drawer.close())}
        type="overlay"
        tapToClose={true}
        openDrawerOffset={0.15}
      >
        {this.props.children}
      </Drawer>
    );
  }

  _renderControlPanel(closeDrawer) {
    let currentSongName = this.props.currentSong ? this.props.currentSong.name : null;
    let currentSongArtist = this.props.currentSong ? this.props.currentSong.artist : null;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.albumCover}>
          <Image source={require('../images/music.png')} style={{ flex: 1/*height: 95, width: null*/ }} />
          <View style={styles.albumInfo}>
            <Text style={[styles.albumInfoText, { fontWeight: 'bold' }]}>{currentSongName}</Text>
            <Text style={styles.albumInfoText}>{currentSongArtist}</Text>
          </View>
        </View>
        {this._renderSections()}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionButton} onPress={this._navigateToQueue}>
            {/*<Icon style={[styles.sectionIcon, { color: 'gray' }]} name="list" />*/}
            <Text style={[styles.sectionText, { color: 'gray' }]}>Queue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionButton}>
            {/*<Icon style={[styles.sectionIcon, { color: 'gray' }]} name="list-box" />*/}
            <Text style={[styles.sectionText, { color: 'gray' }]}>Play Lists</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionButton} onPress={this._navigateToFavorites}>
            {/*<Icon style={[styles.sectionIcon, { color: 'gray' }]} name="fav" />*/}
            <Text style={[styles.sectionText, { color: 'gray' }]}>Favorites</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <TouchableOpacity style={styles.sectionButton}>
            {/*<Icon style={[styles.sectionIcon, { color: 'gray' }]} name="options" />*/}
            <Text style={[styles.sectionText, { color: 'gray' }]}>Equalizer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionButton}>
            {/*<Icon style={[styles.sectionIcon, { color: 'gray' }]} name="settings" />*/}
            <Text style={[styles.sectionText, { color: 'gray' }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  _onRef(component) {
    this._drawer = component;
    this.props.onRef(component);
  }

  _renderSections() {
    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionButton} onPress={() => this._selectedSectionChanged('artists')}>
          {/*<Icon style={[styles.sectionIcon, this.props.selectedSection === 'artists' ? styles.sectionSelected : styles.sectionUnselected]} name="person" />*/}
          <Text style={[styles.sectionText, this.props.selectedSection === 'artists' ? styles.sectionSelected : styles.sectionUnselected]}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionButton} onPress={() => this._selectedSectionChanged('albums')}>
          {/*<Icon style={[styles.sectionIcon, this.props.selectedSection === 'albums' ? styles.sectionSelected : styles.sectionUnselected]} name="disc" />*/}
          <Text style={[styles.sectionText, this.props.selectedSection === 'albums' ? styles.sectionSelected : styles.sectionUnselected]}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionButton} onPress={() => this._selectedSectionChanged('genres')}>
          {/*<Icon style={[styles.sectionIcon, this.props.selectedSection === 'genres' ? styles.sectionSelected : styles.sectionUnselected]} name="musical-notes" />*/}
          <Text style={[styles.sectionText, this.props.selectedSection === 'genres' ? styles.sectionSelected : styles.sectionUnselected]}>Genres</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionButton} onPress={() => this._selectedSectionChanged('songs')}>
          {/*<Icon style={[styles.sectionIcon, this.props.selectedSection === 'songs' ? styles.sectionSelected : styles.sectionUnselected]} name="musical-note" />*/}
          <Text style={[styles.sectionText, this.props.selectedSection === 'songs' ? styles.sectionSelected : styles.sectionUnselected]}>Songs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _selectedSectionChanged(section) {
    this.props.selectedSectionChanged(section);
    this._drawer.close();
  }

  _navigateToQueue() {
    this.props.navigation.navigate('Queue');
    this._drawer.close();
  }

  _navigateToFavorites() {
    this.props.navigation.navigate('Favorites');
    this._drawer.close();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    flexDirection: 'column',
  },
  controlText: {
    color: 'white',
  },
  section: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingLeft: 15
  },
  sectionIcon: {
    marginRight: 30,
    height: 30,
    width: 30
  },
  sectionButton: {
    flexDirection: 'row',
    padding: 10,
  },
  sectionSelected: {
    color: '#ffa500'
  },
  sectionUnselected: {
    color: 'gray'
  },
  sectionText: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold'
  },
  albumCover: {
    flex: 1,
    height: 200,
    backgroundColor: 'blue'
  },
  albumInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 15,
  },
  albumInfoText: {
    fontSize: 16
  }
});

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

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);