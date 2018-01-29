import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  View
} from 'react-native';
import Touchable from '../common/buttons/Touchable';

const styles = EStyleSheet.create({
  deleteButton: {
    flex: 1,
    width: '$appWidth',
    backgroundColor: '$appMainColor',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10
  },
  deleteButtonIcon: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
  },
});

class DeleteModeButton extends PureComponent {
  render() {
    return (
      <Touchable onPress={this.props.onDeletePress}>
        <View style={styles.deleteButton}>
          <Icon name='delete' color={styles._deleteButtonIcon.color} backgroundColor={styles._deleteButtonIcon.backgroundColor} size={styles._deleteButtonIcon.fontSize} />
        </View>
      </Touchable>
    );
  }
}

DeleteModeButton.propTypes = {
  onDeletePress: PropTypes.func.isRequired
};

export default DeleteModeButton;