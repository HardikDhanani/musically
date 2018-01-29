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
  ScrollView
} from 'react-native';
import SettingsHeader from '../components/settings/SettingsHeader';
import Section from '../components/settings/Section';
import Option from '../components/settings/Option';
import LeftColumn from '../components/settings/LeftColumn';
import RightColumn from '../components/settings/RightColumn';
import ConfirmationForm from '../components/ConfirmationForm';
import LanguageSelector from '../components/settings/LanguageSelector';
import Container from '../components/Container';
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
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);

    this._showSettingForm = this._showSettingForm.bind(this);
    this._renderLanguageSettingForm = this._renderLanguageSettingForm.bind(this);
  }

  componentDidMount() {
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
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_lookAndFeel_theme')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionText}>Musically</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={'Default Playlists'}>
            <Option onPress={() => this.props.navigation.navigate('MostPlayedSettings')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('mostPlayed')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionEdit}>Edit</Text>
              </RightColumn>
            </Option>
            <Option onPress={() => this.props.navigation.navigate('RecentlyPlayedSettings')} style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('recentlyPlayed')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionEdit}>Edit</Text>
              </RightColumn>
            </Option>
          </Section>
          <Section title={this.props.dictionary.getWord('settings_sectionTitle_about')}>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_version')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionDescription}>Musically 0.0.1</Text>
              </RightColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_about_developer')}</Text>
              </LeftColumn>
              <RightColumn>
                <Text style={styles.sectionOptionDescription}>©2017 (t-3)</Text>
              </RightColumn>
            </Option>
            <Option style={styles.option}>
              <LeftColumn>
                <Text style={styles.sectionOptionEdit}>{this.props.dictionary.getWord('settings_about_sendFeedback')}</Text>
              </LeftColumn>
            </Option>
            <Option style={styles.option}>
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
        actionText={'SAVE'}>
        <LanguageSelector selectedOption={this.props.dictionary.id} items={items} onOptionChanged={optionSelected => language = optionSelected} />
      </ConfirmationForm>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings.settings,
    showSettingForm: state.settings.showSettingForm,
    showSetting: state.settings.showSetting,
    dictionary: state.app.dictionary,
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);