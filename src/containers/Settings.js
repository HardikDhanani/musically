import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as settingsActions from '../redux/actions/settingsActions';

import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TextInput,
  ScrollView,
  Linking,
  Image,
  Platform
} from 'react-native';
import SettingsHeader from '../components/settings/SettingsHeader';
import Section from '../components/settings/Section';
import Option from '../components/settings/Option';
import LeftColumn from '../components/settings/LeftColumn';
import RightColumn from '../components/settings/RightColumn';
import ConfirmationForm from '../components/common/forms/ConfirmationForm';
import LanguageSelector from '../components/settings/LanguageSelector';
import Container from '../components/common/containers/Container';
import Text from '../components/common/Text';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bodySecondaryBackgroundColor'
  },
  sectionOptionText: {
    color: '$textMainColor',
    fontSize: 18
  },
  sectionOptionEdit: {
    color: '$appMainColor',
    fontSize: 18
  },
  sectionOptionDescription: {
    color: '$textColor',
    fontSize: 18
  },
  confirmationText: {
    fontSize: '$textFontSize',
    color: '$textColor'
  },
  textInput: {
    fontSize: '$titleFontSize',
    color: '$textColor'
  },
  logo: {
    borderRadius: 20,
    height: 30,
    width: 30,
    marginRight: 10
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);

    this._showSettingForm = this._showSettingForm.bind(this);
    this._renderLanguageSettingForm = this._renderLanguageSettingForm.bind(this);
    this._navigateToDeveloperPage = this._navigateToDeveloperPage.bind(this);
    this._rateThisApp = this._rateThisApp.bind(this);
  }

  componentWillMount() {
    this.props.load();
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <SettingsHeader title={this.props.dictionary.getWord('settings_title')} onBackPress={() => this.props.navigation.goBack()} />
        <ScrollView>
          <Section title={this.props.dictionary.getWord('settings_sectionTitle_lookAndFeel')}>
            <Option onPress={() => this.props.showSetSetting('language')}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_lookAndFeel_languague')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.language}</Text>
              </RightColumn>
            </Option>
            <Option>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_lookAndFeel_theme')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>Musically</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={'Default Playlists'}>
            <Option onPress={() => this.props.navigation.navigate('MostPlayedSettings')}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('mostPlayed')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionEdit}>{this.props.dictionary.getWord('edit')}</Text>
              </RightColumn>
            </Option>
            <Option onPress={() => this.props.navigation.navigate('RecentlyPlayedSettings')} >
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('recentlyPlayed')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionEdit}>{this.props.dictionary.getWord('edit')}</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={this.props.dictionary.getWord('settings_sectionTitle_about')}>
            <Option>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_version')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionDescription}>{'Musically ' + this.props.version}</Text>
              </RightColumn>
            </Option>
            <Option onPress={() => this._navigateToDeveloperPage()}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_developer')}</Text>
              </LeftColumn>
              <RightColumn>
                <Image style={styles.logo} source={require('../images/(t-3).png')} />
                <Text style={styles.sectionOptionDescription}>©2017</Text>
              </RightColumn>
            </Option>
            <Option>
              <LeftColumn>
                <Text style={styles.sectionOptionEdit}>{this.props.dictionary.getWord('settings_about_sendFeedback')}</Text>
              </LeftColumn>
            </Option>
            <Option onPress={() => this._rateThisApp()}>
              <LeftColumn>
                <Text style={styles.sectionOptionEdit}>{this.props.dictionary.getWord('settings_about_rateApp')}</Text>
              </LeftColumn>
            </Option>
          </Section>
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
      case 'language':
        return this._renderLanguageSettingForm();
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
        onConfirmPress={() => this.props.languageChanged(language)}
        actionText={this.props.dictionary.getWord('save')}>
        <LanguageSelector selectedOption={this.props.dictionary.id} items={items} onOptionChanged={optionSelected => language = optionSelected} />
      </ConfirmationForm>
    );
  }

  _navigateToDeveloperPage() {
    Linking.canOpenURL('http://www.tmenos3.com').then(supported => {
      if (supported) {
        Linking.openURL('http://www.tmenos3.com');
      } else {
        console.log('Do not know how to open URI: http://www.tmenos3.com');
      }
    });
  }

  _rateThisApp() {
    if (Platform.OS === 'ios') {
      Linking.openURL(`itms://itunes.apple.com/us/app/apple-store/${this.props.iosAppId}?mt=8`);
    } else {
      Linking.openURL(`market://details?id=${this.props.androidAppId}`);
    }
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    iosAppId: state.app.iosAppId,
    androidAppId: state.app.androidAppId,
    version: state.app.version,
    settings: state.settings.settings,
    showSettingForm: state.settings.showSettingForm,
    showSetting: state.settings.showSetting,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(settingsActions.load()),
    showSetSetting: (setting) => dispatch(settingsActions.showSetSetting(setting)),
    cancelShowSetSetting: () => dispatch(settingsActions.cancelShowSetSetting()),
    languageChanged: (language) => settingsActions.languageChanged(language)(dispatch)
  }
}

Settings.propTypes = {
  dictionary: PropTypes.object.isRequired,
  iosAppId: PropTypes.string.isRequired,
  androidAppId: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  showSettingForm: PropTypes.bool.isRequired,
  showSetting: PropTypes.bool.isRequired,
  load: PropTypes.func.isRequired,
  showSetSetting: PropTypes.func.isRequired,
  cancelShowSetSetting: PropTypes.func.isRequired,
  languageChanged: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);