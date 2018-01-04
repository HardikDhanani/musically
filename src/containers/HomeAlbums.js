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

class HomeAlbums extends Component {
  constructor(props) {
    super(props);

    this._renderAlbum = this._renderAlbum.bind(this);
  }

  render() {
    return (
      <Body hasPaginationHeader={true}>
        {
          !this.props.isReady ?
            <ActivityIndicator animating={true} size='large' /> :
            <FlatList
              data={this.props.albums}
              renderItem={this._renderAlbum}
              keyExtractor={(item, index) => index}
              initialNumToRender={8}
              getItemLayout={(data, index) => ({ length: 200, offset: 200 * index, index })}
              style={{ flexDirection: 'column' }}
              numColumns={2} />
        }
      </Body>
    );
  }

  _renderAlbum({ item }) {
    return (
      <CoverCard
        onPress={() => this.props.navigation.navigate('Album', { album: item })}
        source={require('../images/music.png')}
        imageUri={item.cover}
        title={item.album}
        detail={item.artist} />
    );
  }
}

const mapStateToProps = state => {
  return {
    isReady: state.app.homeAlbumsReady,
    albums: state.app.albums
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

HomeAlbums.propTypes = {
  isReady: PropTypes.bool.isRequired,
  albums: PropTypes.array.isRequired,
  navigation: PropTypes.any.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeAlbums);