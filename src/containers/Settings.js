import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as settingsActions from '../redux/actions/settingsActions';

import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  TextInput,
  ScrollView
} from 'react-native';
import SettingsHeader from '../components/settings/SettingsHeader';
import Section from '../components/settings/Section';
import Option from '../components/settings/Option';
import LeftColumn from '../components/settings/LeftColumn';
import RightColumn from '../components/settings/RightColumn';
import ConfirmationForm from '../components/ConfirmationForm';
import LanguageSelector from '../components/settings/LanguageSelector';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bodySecondaryBackgroundColor'
  },
  option: {
    borderBottomWidth: 1,
    borderBottomColor: '$elementInactive',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionOptionText: {
    color: 'white',
    fontSize: 16
  },
  sectionOptionDescription: {
    color: '$textColor',
    fontSize: 14
  },
  confirmationText: {
    fontSize: '$textFontSize',
    color: '$textColor'
  },
  textInput: {
    fontSize: '$titleFontSize',
    color: '$textColor'
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);

    this._showSettingForm = this._showSettingForm.bind(this);
    this._renderLanguageSettingForm = this._renderLanguageSettingForm.bind(this);
    this._renderResetMostPlayedForm = this._renderResetMostPlayedForm.bind(this);
    this._renderResetRecentlyPlayedForm = this._renderResetRecentlyPlayedForm.bind(this);
    this._renderRecentlyPlayedLengthForm = this._renderRecentlyPlayedLengthForm.bind(this);
    this._renderMostPlayedLengthForm = this._renderMostPlayedLengthForm.bind(this);

    this.state = {
      recentlyPlayedLength: "0",
      mostPlayedLength: "0"
    }
  }

  componentDidMount() {
    this.props.load();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      recentlyPlayedLength: nextProps.recentlyPlayedLength.toString(),
      mostPlayedLength: nextProps.mostPlayedLength.toString()
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SettingsHeader title={this.props.dictionary.getWord('settings_title')} onBackPress={() => this.props.navigation.goBack()} />
        <ScrollView>
          <Section title={this.props.dictionary.getWord('settings_sectionTitle_lookAndFeel')}>
            <Option onPress={() => this.props.showSetSetting('language')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_lookAndFeel_languague')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_lookAndFeel_select_languague')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.language}</Text>
              </RightColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_lookAndFeel_theme')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_lookAndFeel_select_theme')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>Musically</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={this.props.dictionary.getWord('mostPlayed')}>
            <Option onPress={() => this.props.showSetSetting('resetMostPlayed')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_reset')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_mostPlayed_resetPlaylist')}</Text>
              </LeftColumn>
            </Option>
            <Option onPress={() => this.props.showSetSetting('setMostPlayedLength')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_playlistLength')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_mostPlayed_playlistLength')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>{this.props.mostPlayedLength}</Text>
              </RightColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_mostPlayed_reproduction')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_mostPlayed_reproductionDesc')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>5</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={this.props.dictionary.getWord('recentlyPlayed')}>
            <Option onPress={() => this.props.showSetSetting('resetRecentlyPlayed')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_reset')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_recentlyPlayed_resetPlaylist')}</Text>
              </LeftColumn>
            </Option>
            <Option onPress={() => this.props.showSetSetting('setRecentlyPlayedLength')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_playlistLength')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_recentlyPlayed_playlistLength')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>{this.props.recentlyPlayedLength}</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={this.props.dictionary.getWord('settings_sectionTitle_about')}>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_version')}</Text>
                <Text style={styles.sectionOptionDescription}>Musically 0.0.1</Text>
              </LeftColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_developer')}</Text>
                <Text style={styles.sectionOptionDescription}>©2017 (t-3)</Text>
              </LeftColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_sendFeedback')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_about_sendFeedbackDesc')}</Text>
              </LeftColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_rateApp')}</Text>
                <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_about_rateAppDesc')}</Text>
              </LeftColumn>
            </Option>
          </Section>
        </ScrollView>
        {this._showSettingForm()}
      </View>
    );
  }

  _showSettingForm() {
    if (!this.props.showSettingForm) {
      return null;
    }

    switch (this.props.showSetting) {
      case 'language':
        return this._renderLanguageSettingForm();
      case 'resetMostPlayed':
        return this._renderResetMostPlayedForm();
      case 'resetRecentlyPlayed':
        return this._renderResetRecentlyPlayedForm();
      case 'setRecentlyPlayedLength':
        return this._renderRecentlyPlayedLengthForm();
      case 'setMostPlayedLength':
        return this._renderMostPlayedLengthForm();

      default:
        return null;
    }
  }

  _renderLanguageSettingForm() {
    let items = [
      { text: 'English', value: 'english' },
      { text: 'Português', value: 'portuguese' },
      { text: 'Español', value: 'spanish' }
    ];

    let language = null;

    return (
      <ConfirmationForm
        title={this.props.dictionary.getWord('settings_lookAndFeel_select_languague')}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onConfirmPress={() => this.props.languageChanged(language)}>
        <LanguageSelector selectedOption={this.props.dictionary.id} items={items} onOptionChanged={optionSelected => language = optionSelected} />
      </ConfirmationForm>
    );
  }

  _renderResetMostPlayedForm() {
    let title = this.props.dictionary.getWord('settings_reset') + ' ' + this.props.dictionary.getWord('mostPlayed');

    return (
      <ConfirmationForm
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onConfirmPress={() => this.props.resetMostPlayed()}>
        <Text style={styles.confirmationText}>{this.props.dictionary.getWord('settings_reset_mostPlayed_question')}</Text>
      </ConfirmationForm>
    );
  }

  _renderResetRecentlyPlayedForm() {
    let title = this.props.dictionary.getWord('settings_reset') + ' ' + this.props.dictionary.getWord('recentlyPlayed');

    return (
      <ConfirmationForm
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onConfirmPress={() => this.props.resetRecentlyPlayed()}>
        <Text style={styles.confirmationText}>{this.props.dictionary.getWord('settings_reset_recentlyPlayed_question')}</Text>
      </ConfirmationForm>
    );
  }

  _renderRecentlyPlayedLengthForm() {
    let title = this.props.dictionary.getWord('recentlyPlayed') + ' ' + this.props.dictionary.getWord('settings_playlistLength');

    return (
      <ConfirmationForm
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onConfirmPress={() => this.props.setRecentlyPlayedLength(this.state.recentlyPlayedLength)}>
        <TextInput
          autoFocus={true}
          style={styles.textInput}
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
          placeholderTextColor={styles._textInput.color}
          keyboardType={'numeric'}
        />
      </ConfirmationForm>
    );
  }

  _renderMostPlayedLengthForm() {
    let title = this.props.dictionary.getWord('mostPlayed') + ' ' + this.props.dictionary.getWord('settings_playlistLength');

    return (
      <ConfirmationForm
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onConfirmPress={() => this.props.setMostPlayedLength(this.state.mostPlayedLength)}>
        <TextInput
          autoFocus={true}
          style={styles.textInput}
          onChangeText={text => {
            let numbers = '0123456789';

            if (text.length > 0) {
              if (numbers.indexOf(text[text.length - 1]) > -1) {
                this.setState({ mostPlayedLength: text });
              }
            } else {
              this.setState({ mostPlayedLength: text });
            }
          }}
          value={this.state.mostPlayedLength}
          underlineColorAndroid={'transparent'}
          placeholderTextColor={styles._textInput.color}
          keyboardType={'numeric'}
        />
      </ConfirmationForm>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings.settings,
    showSettingForm: state.settings.showSettingForm,
    showSetting: state.settings.showSetting,
    recentlyPlayedLength: state.settings.recentlyPlayedLength,
    mostPlayedLength: state.settings.mostPlayedLength,
    dictionary: state.app.dictionary,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(settingsActions.load()),
    showSetSetting: (setting) => dispatch(settingsActions.showSetSetting(setting)),
    cancelShowSetSetting: () => dispatch(settingsActions.cancelShowSetSetting()),
    languageChanged: (language) => settingsActions.languageChanged(language)(dispatch),
    resetMostPlayed: () => settingsActions.resetMostPlayed()(dispatch),
    resetRecentlyPlayed: () => settingsActions.resetRecentlyPlayed()(dispatch),
    setRecentlyPlayedLength: length => settingsActions.setRecentlyPlayedLength(length)(dispatch),
    setMostPlayedLength: length => settingsActions.setMostPlayedLength(length)(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);