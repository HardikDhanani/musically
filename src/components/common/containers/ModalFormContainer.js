import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Text from '../Text';

const styles = EStyleSheet.create({
  container: {
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    width: '$appWidth',
    height: '$appHeight - $statusBarHeight',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerBackgroundColor: {
    backgroundColor: '$modalFormBackgroundColor'
  },
  contentContainer: {
    width: '$modalFormWidth',
    backgroundColor: '$modalFormContentBackgroundColor',
    elevation: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    marginHorizontal: 15,
    marginVertical: 15,
    color: '$textMainColor',
    fontSize: '$bigTextFontSize',
    fontWeight: 'bold'
  }
});

class ModalFormContainer extends PureComponent {
  render() {
    let backgroundColor = this.props.backgroundTransparent ? 'transparent' : styles._containerBackgroundColor.backgroundColor

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={[styles.contentContainer, this.props.style]}>
          {
            this.props.title ?
              <Text style={styles.title}>{this.props.title}</Text> :
              null
          }
          {this.props.children}
        </View>
      </View>
    );
  }
}

ModalFormContainer.propTypes = {
  title: PropTypes.string,
  backgroundTransparent: PropTypes.bool
};

export default ModalFormContainer;