import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

class TwoColumnContainer extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.items[0] ? this.props.renderItem(this.props.items[0]) : null}
        {this.props.items[1] ? this.props.renderItem(this.props.items[1]) : null}
      </View>
    );
  }
}

TwoColumnContainer.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func.isRequired
};

export default TwoColumnContainer;