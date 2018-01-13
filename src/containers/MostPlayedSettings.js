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
    fontFamily: 'nunito',
    lineHeight: 16
  },
  confirmationText: {
    fontSize: '$textFontSize',
    color: '$textColor'
  },
  input: {
    width: '$modalFormWidth',
    margin: 10,
    fontSize: '$titleFontSize',
    lineHeight: '$titleFontSize',
    color: '$textMainColor',
    fontFamily: 'nunito',
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
  }
});

class MostPlayedSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mostPlayedLength: '0',
      mostPlayedReproductions: '0'
    }

    this._renderResetMostPlayedForm = this._renderResetMostPlayedForm.bind(this);
    this._renderMostPlayedReproductionsForm = this._renderMostPlayedReproductionsForm.bind(this);
    this._renderMostPlayedLengthForm = this._renderMostPlayedLengthForm.bind(this);
    this._showSettingForm = this._showSettingForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mostPlayedLength: nextProps.mostPlayedLength.toString(),
      mostPlayedReproductions: nextProps.mostPlayedReproductions.toString()
    });
  }

  render() {
    return (
      <Container>
        <SettingsHeader title={'Edit Most Played'} onBackPress={() => this.props.navigation.goBack()} />
        <ScrollView style={styles.container}>
          <Option onPress={() => this.props.showSetSetting('setMostPlayedLength')}>
            <LeftColumn>
              <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_playlistLength')}</Text>
              <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_mostPlayed_playlistLength')}</Text>
            </LeftColumn>
            <RightColumn style={{ flex: 0.25 }}>
              <Text style={styles.sectionOptionText}>{this.props.mostPlayedLength}</Text>
            </RightColumn>
          </Option>
          <Option onPress={() => this.props.showSetSetting('setMostPlayedReproductions')}>
            <LeftColumn>
              <Text style={styles.sectionOptionText}>{this.props.dictionary.getWord('settings_mostPlayed_reproduction')}</Text>
              <Text style={styles.sectionOptionDescription}>{this.props.dictionary.getWord('settings_mostPlayed_reproductionDesc')}</Text>
            </LeftColumn>
            <RightColumn style={{ flex: 0.25 }}>
              <Text style={styles.sectionOptionText}>{this.props.mostPlayedReproductions}</Text>
            </RightColumn>
          </Option>
          <Option onPress={() => this.props.showSetSetting('resetMostPlayed')}>
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
      case 'resetMostPlayed':
        return this._renderResetMostPlayedForm();
      case 'setMostPlayedReproductions':
        return this._renderMostPlayedReproductionsForm();
      case 'setMostPlayedLength':
        return this._renderMostPlayedLengthForm();

      default:
        return null;
    }
  }

  _renderMostPlayedReproductionsForm() {
    let title = this.props.dictionary.getWord('mostPlayed') + ' ' + this.props.dictionary.getWord('settings_playlistLength');

    return (
      <ModalFormWithAction
        actionText={this.props.dictionary.getWord('save')}
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onActionPress={() => this.props.setMostPlayedReproductions(this.state.mostPlayedReproductions)}
        actionEnabled={!(!this.state.mostPlayedReproductions)}>
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={true}
            style={styles.input}
            onChangeText={text => {
              let numbers = '0123456789';

              if (text.length > 0) {
                if (numbers.indexOf(text[text.length - 1]) > -1) {
                  this.setState({ mostPlayedReproductions: text });
                }
              } else {
                this.setState({ mostPlayedReproductions: text });
              }
            }}
            value={this.state.mostPlayedReproductions}
            underlineColorAndroid={'transparent'}
            placeholder={'Reproductions'}
            placeholderTextColor={styles._inputPlaceholderColor.color}
            keyboardType={'numeric'}
          />
        </View>
      </ModalFormWithAction>
    );
  }

  _renderResetMostPlayedForm() {
    let title = this.props.dictionary.getWord('settings_reset') + ' ' + this.props.dictionary.getWord('mostPlayed');

    return (

      <ModalFormWithAction
        actionText={this.props.dictionary.getWord('settings_reset')}
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onActionPress={() => this.props.resetMostPlayed()}
        actionEnabled={true}>
        <Text style={styles.confirmationText}>{this.props.dictionary.getWord('settings_reset_mostPlayed_question')}</Text>
      </ModalFormWithAction>
    );
  }

  _renderMostPlayedLengthForm() {
    let title = this.props.dictionary.getWord('mostPlayed') + ' ' + this.props.dictionary.getWord('settings_playlistLength');

    return (
      <ModalFormWithAction
        actionText={this.props.dictionary.getWord('save')}
        title={title}
        onCancelPress={() => this.props.cancelShowSetSetting()}
        onActionPress={() => this.props.setMostPlayedLength(this.state.mostPlayedLength)}
        actionEnabled={!(!this.state.mostPlayedLength)}>
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={true}
            style={styles.input}
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
    mostPlayedLength: state.settings.mostPlayedLength,
    mostPlayedReproductions: state.settings.mostPlayedReproductions,
    dictionary: state.app.dictionary,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showSetSetting: (setting) => dispatch(settingsActions.showSetSetting(setting)),
    cancelShowSetSetting: () => dispatch(settingsActions.cancelShowSetSetting()),
    resetMostPlayed: () => settingsActions.resetMostPlayed()(dispatch),
    setMostPlayedLength: length => settingsActions.setMostPlayedLength(length)(dispatch),
    setMostPlayedReproductions: reproductions => settingsActions.setMostPlayedReproductions(reproductions)(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MostPlayedSettings);