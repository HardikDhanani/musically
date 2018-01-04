import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TextInput
} from 'react-native';
import ModalFormWithAction from './common/forms/ModalFormWithAction';

const styles = EStyleSheet.create({
  contentHeight: {
    height: '$modalFormHeight'
  },
  inputContainer: {
    flex: 1,
    width: '$modalFormWidth',
    justifyContent: 'center'
  },
  input: {
    margin: 10,
    fontSize: '$titleFontSize',
    color: '$textMainColor',
    fontFamily: 'nunito'
  }
});

class NewPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistName: this.props.defaultValue
    }
  }
  /*
    <ConfirmationForm
      actionText={this.props.dictionary.getWord('save').toUpperCase()}
      onCancelPress={this.props.onCancelPress}
      onConfirmPress={() => this.props.onConfirmPress(this._text)}>
    </ConfirmationForm>
  */
  render() {
    return (
      <ModalFormWithAction
        style={{ height: styles._contentHeight.height }}
        actionText={this.props.createButtonText}
        title={this.props.title}
        onCancelPress={this.props.onCancelPress}
        onActionPress={() => {
          if (this.props.onPlaylistCreated) {
            this.props.onPlaylistCreated(this.state.playlistName);
          }
        }}
        actionEnabled={!(!this.state.playlistName)}
        backgroundTransparent={this.props.backgroundTransparent}>
        <View style={styles.inputContainer}>
          <TextInput
            defaultValue={this.props.defaultValue}
            style={styles.input}
            onChangeText={text => this.setState({ playlistName: text })}
            value={this.props.playlistName}
            underlineColorAndroid={'transparent'} />
        </View>
      </ModalFormWithAction>
    );
  }
}

NewPlaylist.propTypes = {
  title: PropTypes.string,
  defaultValue: PropTypes.string,
  createButtonText: PropTypes.string,
  onPlaylistCreated: PropTypes.func.isRequired
};

export default NewPlaylist;