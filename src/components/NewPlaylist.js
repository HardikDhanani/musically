import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TextInput
} from 'react-native';
import ConfirmationForm from './ConfirmationForm';

const styles = EStyleSheet.create({
  inputContainer: {
    flex: 1
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: '$textFontSize',
    color: '$headerColor',
  }
});

class NewPlaylist extends Component {
  componentDidMount() {
    this._text = 'My Playlist';
  }

  render() {

    return (
      <ConfirmationForm
        title={'New Playlist'}
        onCancelPress={this.props.onCancelPress}
        onConfirmPress={() => this.props.onConfirmPress(this._text)}>
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={true}
            defaultValue={'My Playlist'}
            style={styles.input}
            onChangeText={text => this._text = text}
            value={this.props.text}
            underlineColorAndroid={'transparent'} />
        </View>
      </ConfirmationForm>
    );
  }
}

NewPlaylist.propTypes = {
  onCancelPress: PropTypes.func,
  onConfirmPress: PropTypes.func
};

export default NewPlaylist;