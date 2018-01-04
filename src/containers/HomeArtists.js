import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ActivityIndicator,
  FlatList,
  View
} from 'react-native';
import Body from '../components/Body';
import CoverCard from '../components/common/cards/CoverCard';

class HomeArtists extends Component {
  constructor(props) {
    super(props);

    this._renderArtist = this._renderArtist.bind(this);
  }

  render() {
    return (
      <Body hasPaginationHeader={true}>
        {
          !this.props.isReady ?
            <ActivityIndicator animating={true} size='large' /> :
            <FlatList
              data={this.props.artists}
              renderItem={this._renderArtist}
              keyExtractor={(item, index) => index}
              initialNumToRender={8}
              getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
              style={{ flexDirection: 'column' }}
              numColumns={2} />
        }
      </Body>
    );
  }

  _renderArtist({ item }) {
    return (
      <CoverCard
        onPress={() => this.props.navigation.navigate('Artist', { artist: item })}
        source={require('../images/music.png')}
        imageUri={item.cover}
        title={item.artist} />
    );
  }
}

const mapStateToProps = state => {
  return {
    isReady: state.app.homeArtistsReady,
    artists: state.app.artists
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

HomeArtists.propTypes = {
  isReady: PropTypes.bool.isRequired,
  artists: PropTypes.array.isRequired,
  navigation: PropTypes.any.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeArtists);