import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Text from '../Text';
import Touchable from '../buttons/Touchable';
import ModalForm from './ModalForm';

const styles = EStyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  actionButton: {
    flex: 1,
    height: '$headerHeight',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$modalFormButtonColor',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  actionButtonDisabled: {
    flex: 1,
    height: '$headerHeight',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$modalFormButtonDisabledColor',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  actionButtonText: {
    fontSize: '$titleFontSize',
    color: '$modalFormButtonTextColor',
  },
});

class ModalFormWithAction extends PureComponent {
  render() {
    return (
      <ModalForm
        style={this.props.style}
        title={this.props.title}
        backgroundTransparent={this.props.backgroundTransparent}
        onCancelPress={this.props.onCancelPress}>
        {this.props.children}
        <View style={styles.actionContainer}>
          {
            this.props.actionEnabled ?
              this._renderActionButtonEnabled(this.props.actionText) :
              this._renderActionButtonDisabled(this.props.actionText)
          }
        </View>
      </ModalForm>
    );
  }

  _renderActionButtonEnabled(text) {
    return (
      <Touchable onPress={this.props.onActionPress}>
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{text}</Text>
        </View>
      </Touchable>
    );
  }

  _renderActionButtonDisabled(text) {
    return (
      <View style={styles.actionButtonDisabled}>
        <Text style={styles.actionButtonText}>{text}</Text>
      </View>
    );
  }
}

ModalFormWithAction.propTypes = {
  actionEnabled: PropTypes.bool,
  actionText: PropTypes.string.isRequired,
  onActionPress: PropTypes.func.isRequired
};

export default ModalFormWithAction;