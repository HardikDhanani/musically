import React, { PureComponent } from 'react';

import {
  Modal
} from 'react-native';
import ModalFormWithActionContainer from '../containers/ModalFormWithActionContainer';

export default class ModalFormWithAction extends PureComponent {
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={true}
        onRequestClose={() => {
          this.props.onCancelPress();
        }}>
        <ModalFormWithActionContainer {...this.props} />
      </Modal>
    );
  }
}