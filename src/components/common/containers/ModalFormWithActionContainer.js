import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import ModalFormContainer from './ModalFormContainer';
import Touchable from '../buttons/Touchable';
import Text from '../Text';

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
  }
});

class ModalFormWithActionContainer extends PureComponent {
  render() {
    return (
      <ModalFormContainer {...this.props}>
        {this.props.children}
        <View style={styles.actionContainer}>
          {
            this.props.actionEnabled ?
              this._renderActionButtonEnabled(this.props.actionText) :
              this._renderActionButtonDisabled(this.props.actionText)
          }
        </View>
      </ModalFormContainer>
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

ModalFormWithActionContainer.propTypes = {
  actionText: PropTypes.string.isRequired,
  actionEnabled: PropTypes.bool,
  onActionPress: PropTypes.func
};

export default ModalFormWithActionContainer;