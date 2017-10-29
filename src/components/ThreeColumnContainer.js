import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});

class ThreeColumnContainer extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.items[0] ? this.props.renderItem(this.props.items[0]) : null}
        {this.props.items[1] ? this.props.renderItem(this.props.items[1]) : null}
        {this.props.items[2] ? this.props.renderItem(this.props.items[2]) : null}
      </View>
    );
  }
}

ThreeColumnContainer.propTypes = {
  items: PropTypes.array
};

export default ThreeColumnContainer;