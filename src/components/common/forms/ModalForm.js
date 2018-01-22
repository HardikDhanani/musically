import React, { PureComponent } from 'react';

import {
  Modal
} from 'react-native';
import ModalFormContainer from '../containers/ModalFormContainer';

export default class ModalForm extends PureComponent {
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={true}
        onRequestClose={() => {
          this.props.onCancelPress();
        }}>
        <ModalFormContainer {...this.props} />
      </Modal>
    );
  }
}