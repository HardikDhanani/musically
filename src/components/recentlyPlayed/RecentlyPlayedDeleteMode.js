import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  FlatList,
  View
} from 'react-native';
import Container from '../common/containers/Container';
import RecentlyPlayedDeleteModeHeader from './RecentlyPlayedDeleteModeHeader';
import Body from '../Body';
import DeleteModeButton from '../common/buttons/DeleteModeButton';
import Text from '../common/Text';
import CheckBox from '../common/buttons/CheckBox';
import RowCard from '../common/cards/RowCard';
import ConfirmationForm from '../common/forms/ConfirmationForm';

const styles = EStyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5
  },
  text: {
    color: '$textColor',
    fontSize: '$textFontSize'
  },
  textBold: {
    color: '$textMainColor',
    fontSize: '$bigTextFontSize'
  },
  checkboxChecked: {
    color: '$appMainColor',
  },
  checkboxUnchecked: {
    color: '$elementInactive',
  },
  confirmationTextContainer: {
    marginHorizontal: 10,
    marginBottom: 10
  }
});

class RecentlyPlayedDeleteMode extends Component {
  constructor(props) {
    super(props);

    this._renderDeleteSong = this._renderDeleteSong.bind(this);
    this._renderDeleteConfirmation = this._renderDeleteConfirmation.bind(this);
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <RecentlyPlayedDeleteModeHeader
          title={this.props.selected + ' ' + this.props.dictionary.getWord('selected')}
          selectedAll={this.props.selectedAll}
          onBackPress={this.props.onBackPress}
          onSelectAllPress={this.props.onSelectAllPress} />
        <Body>
          <FlatList
            data={this.props.data}
            renderItem={this._renderDeleteSong}
            keyExtractor={(item, index) => item.id} />
        </Body>
        <DeleteModeButton onDeletePress={this.props.onDeletePress}/>
        {this._renderDeleteConfirmation()}
      </Container>
    );
  }

  _renderDeleteSong({ item }) {
    let duration = '00:00';
    if (item.duration) {
      let d = new Date(parseInt(duration));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      duration = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }

    return (
      <RowCard onPress={() => this.props.onSelecteSong(item)}>
        <View style={styles.infoContainer}>
          <View style={styles.songInformation}>
            <Text numberOfLines={1} style={styles.textBold}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.text}>{item.artist}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text numberOfLines={1} style={styles.text}>{duration}</Text>
          </View>
        </View>
        <CheckBox onChange={() => this.props.onSelecteSong(item)} style={item.selected ? styles.checkboxChecked : styles.checkboxUnchecked} />
      </RowCard>
    );
  }

  _renderDeleteConfirmation() {
    if (!this.props.showConfirmation || this.props.selected === 0) {
      return null;
    }

    return (
      <ConfirmationForm
        title={this.props.dictionary.getWord('delete_from_recently_played')}
        actionText={this.props.dictionary.getWord('delete')}
        onCancelPress={this.props.onCancelPress}
        onConfirmPress={this.props.onConfirmPress}>
        <View style={styles.confirmationTextContainer}>
          <Text style={styles.confirmationText}>{this.props.dictionary.getWord('you_are_removing') + ' ' + this.props.selected + ' ' + this.props.dictionary.getWord('songs_from_recently_played') + '.\n'}</Text>
          <Text style={styles.confirmationText}>{this.props.dictionary.getWord('are_you_sure')}</Text>
        </View>
      </ConfirmationForm>
    );
  }
}

RecentlyPlayedDeleteMode.propTypes = {
  dictionary: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  selected: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  showConfirmation: PropTypes.bool.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onSelectAllPress: PropTypes.func.isRequired,
  onDeletePress: PropTypes.func.isRequired,
  onSelecteSong: PropTypes.func.isRequired,
  onCancelPress: PropTypes.func.isRequired,
  onConfirmPress: PropTypes.func.isRequired,
};

export default RecentlyPlayedDeleteMode;