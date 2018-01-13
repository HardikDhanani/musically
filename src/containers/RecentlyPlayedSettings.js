import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as settingsActions from '../redux/actions/settingsActions';

import {
  View,
  TextInput,
  ScrollView
} from 'react-native';
import SettingsHeader from '../components/settings/SettingsHeader';
import Option from '../components/settings/Option';
import LeftColumn from '../components/settings/LeftColumn';
import RightColumn from '../components/settings/RightColumn';
import ConfirmationForm from '../components/ConfirmationForm';
import Container from '../components/Container';
import Text from '../components/common/Text';
import ModalFormWithAction from '../components/common/forms/ModalFormWithAction';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  sectionOptionText: {
    color: '$textMainColor',
    fontSize: 18
  },
  sectionOptionReset: {
    color: '$appMainColor',
    fontSize: 18
  },
  sectionOptionDescription: {
    color: '$textColor',
    fontSize: 14,
    lineHeight: 14,
  },
  input: {
    width: '$modalFormWidth',
    margin: 10,
    fontSize: '$titleFontSize',
    color: '$textMainColor',
    fontFamily: 'nunito'
  },
  inputPlaceholderColor: {
    color: '$elementInactive'
  },
  inputUnderlineColor: {
    color: '$elementInactive'
  },
  confirmationText: {
    marginHorizontal: 15,
    marginBottom: 15,
    fontSize: '$textFontSize',
    lineHeight: '$textFontSize',
    color: '$textColor'
  },
});

class RecentlyPlayedSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recentlyPlayedLength: '0'
    }

    this._renderResetResentlyPlayedForm = this._renderResetResentlyPlayedForm.bind(this);
    this._renderRecentlyPlayedLengthForm = this._renderRecentlyPlayedLengthForm.bind(this);
    this._showSettingForm = this._showSettingForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      recentlyPlayedLength: nextProps.recentlyPlayedLength.toString()
    });
  }

  render() {
    return (
      <Container>
        <SettingsHeader title={'Edit Recently Played'} onBackPress={() => this.props.navigation.goBack()} />
        <ScrollView style={styles.container}>
          <Option onPress={() => this.props.showSetSetting('setRecentlyPlayedLength')}>
            <LeftColumn>
              <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_playlistLength')}</Text>
              <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_mostPlayed_playlistLength')}</Text>
            </LeftColumn>
            <RightColumn style={{ flex: 0.25 }}>
              <Text style={styles.sectionOptionText}>{this.props.recentlyPlayedLength}</Text>
            </RightColumn>
          </Option>
          <Option onPress={() => this.props.showSetSetting('resetResentlyPlayed')}>
            <LeftColumn>
              <Text style={styles.sectionOptionReset}>{this.props.dictionary.getWord('settings_reset')}</Text>
            </LeftColumn>
          </Option>
        </ScrollView>
        {this._showSettingForm()}
      </Container>
    );
  }

  _showSettingForm() {
    if (!this.props.showSettingForm) {
      return null;
    }

    switch (this.props.showSetting) {
      case 'resetResentlyPlayed':
        return this._renderResetResentlyPlayedForm();
      case 'setRecentlyPlayedLength':
        return this._renderRecentlyPlayedLengthForm();

      default:
        return null;
    }
  }

  _renderResetResentlyPlayedForm() {
    let title = this.props.dictionary.getWord('settings_reset') + ' ' + this.props.dictionary.getWord('mostPlayed');

    return (

      <ModalFormWithAction
        actionText={this.props.dictionary.getWord('settings_reset')}
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onActionPress={() => this.props.resetRecentlyPlayed()}
        actionEnabled={true}>
        <Text style={styles.confirmationText}>{this.props.dictionary.getWord('settings_reset_mostPlayed_question')}</Text>
      </ModalFormWithAction>
    );
  }

  _renderRecentlyPlayedLengthForm() {
    let title = this.props.dictionary.getWord('recentlyPlayed') + ' ' + this.props.dictionary.getWord('settings_playlistLength');

    return (
      <ModalFormWithAction
        actionText={this.props.dictionary.getWord('save')}
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onActionPress={() => this.props.setRecentlyPlayedLength(this.state.recentlyPlayedLength)}
        actionEnabled={!(!this.state.recentlyPlayedLength)}>
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={true}
            style={styles.input}
            onChangeText={text => {
              let numbers = '0123456789';

              if (text.length > 0) {
                if (numbers.indexOf(text[text.length - 1]) > -1) {
                  this.setState({ recentlyPlayedLength: text });
                }
              } else {
                this.setState({ recentlyPlayedLength: text });
              }
            }}
            value={this.state.recentlyPlayedLength}
            underlineColorAndroid={'transparent'}
            placeholder={'Length'}
            placeholderTextColor={styles._inputPlaceholderColor.color}
            keyboardType={'numeric'}
          />
        </View>
      </ModalFormWithAction>
    );
  }
}

const mapStateToProps = state => {
  return {
    showSettingForm: state.settings.showSettingForm,
    showSetting: state.settings.showSetting,
    recentlyPlayedLength: state.settings.recentlyPlayedLength,
    dictionary: state.app.dictionary,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showSetSetting: (setting) => dispatch(settingsActions.showSetSetting(setting)),
    cancelShowSetSetting: () => dispatch(settingsActions.cancelShowSetSetting()),
    resetRecentlyPlayed: () => settingsActions.resetRecentlyPlayed()(dispatch),
    setRecentlyPlayedLength: length => settingsActions.setRecentlyPlayedLength(length)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyPlayedSettings);