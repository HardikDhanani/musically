import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Image,
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '$appWidth',
    height: '$appHeight * 0.21',
    backgroundColor: '$headerBackgroundColor',
  },
  content: {
    flex: 1,
    paddingLeft: 15
  },
  image: {
    width: '$headerHeight * 2',
    height: '$headerHeight * 2',
    marginLeft: 20,
  }
});

export default class ContainerViewCover extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Image source={this.props.source} style={styles.image} />
        <View style={styles.content}>
          {this.props.coverContent}
        </View>
      </View>
    );
  }
}