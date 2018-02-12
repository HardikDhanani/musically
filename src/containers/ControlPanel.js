import React, { Component } from 'react';
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
    marginTop: 10,
    color: '$appMainTextColor'
  }
});

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this._renderControlPanel = this._renderControlPanel.bind(this);
    this._onRef = this._onRef.bind(this);
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
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this._drawer.close()} style={styles.close}>
          <Icon size={30} style={styles.closeIcon} name={'close'} />
        </TouchableOpacity>
        <ControlPanelButton onPress={() => this._navigateTo('Favorites')} text={this.props.dictionary.getWord('favorites').toUpperCase()} icon='favorite' />
        <ControlPanelButton onPress={() => this._navigateTo('MostPlayed')} text={this.props.dictionary.getWord('mostPlayed').toUpperCase()} icon='plus-one' />
        <ControlPanelButton onPress={() => this._navigateTo('RecentlyPlayed')} text={this.props.dictionary.getWord('recentlyPlayed').toUpperCase()} icon='timelapse' />
        <ControlPanelButton onPress={() => this._navigateTo('Folders')} text={this.props.dictionary.getWord('folders').toUpperCase()} icon='folder' />
        <ControlPanelButton onPress={() => this._navigateTo('Queue')} text={this.props.dictionary.getWord('queue').toUpperCase()} icon='queue-music' />
        <ControlPanelButton onPress={() => this._navigateTo('Settings')} text={this.props.dictionary.getWord('settings').toUpperCase()} icon='settings' />
      </View>
    );
  }

  _onRef(component) {
    this._drawer = component;
    this.props.onRef(component);
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
    dictionary: state.app.dictionary
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);