import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Text from '../Text';
import RowCard from './RowCard';
import IconButton from '../buttons/IconButton';
import Cover from '../../Cover';

const styles = EStyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 9
  },
  songInformation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '$headerHeight * 0.7'
  },
  coverContainer: {
    backgroundColor: 'white',
    elevation: 5
  },
  cover: {
    height: '$headerHeight',
    width: '$headerHeight'
  },
  buttonEnabled: {
    color: '$buttonEnabled',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  buttonDisabled: {
    color: '$buttonDisabled',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  detail: {
    color: '$textColor',
    fontSize: '$textFontSize',
  },
  title: {
    color: '$textMainColor',
    fontSize: '$bigTextFontSize',
  }
});

class RowCoverCard extends PureComponent {
  render() {
    let showFavoriteButton
    return (
      <RowCard onPress={this.props.onPress}>
        <View style={styles.coverContainer}>
          <Cover imageUri={this.props.cover} height={styles._cover.height} width={styles._cover.width} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.songInformation}>
            <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
            {
              this.props.detail ?
                <Text numberOfLines={1} style={styles.detail}>{this.props.detail}</Text> :
                null
            }
          </View>
        </View>
        {
          this.props.showFavoriteButton !== false ?
            <IconButton iconName={'favorite'} onPress={this.props.onLikePress} style={this.props.isFavorite ? styles._buttonEnabled : styles._buttonDisabled} iconSize={styles._buttonEnabled.fontSize} /> :
            null
        }
      </RowCard>
    );
  }
}

RowCoverCard.propTypes = {
  imageUri: PropTypes.string,
  title: PropTypes.string.isRequired,
  showFavoriteButton: PropTypes.bool,
  detail: PropTypes.string,
  isFavorite: PropTypes.bool,
  onPress: PropTypes.func,
  onLikePress: PropTypes.func
};

export default RowCoverCard;