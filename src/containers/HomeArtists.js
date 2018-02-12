import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as favoritesActions from '../redux/actions/favoritesActions';

import {
  FlatList,
  View
} from 'react-native';
import Body from '../components/Body';
import CoverCard from '../components/common/cards/CoverCard';
import RowCoverCard from '../components/common/cards/RowCoverCard';
import BodyActivityIndicator from '../components/common/BodyActivityIndicator';

const styles = EStyleSheet.create({
  coverCard: {
    height: '$coverCardHeight',
  },
  rowCard: {
    height: '$rowCardHeight',
  }
});

const FETCH_NUMBER = 40;

class HomeArtists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: [],
      lastPosition: 0
    }

    this._renderArtist = this._renderArtist.bind(this);
    this._renderRowArtist = this._renderRowArtist.bind(this);
    this._renderCardArtist = this._renderCardArtist.bind(this);
    this._handleOnEndReached = this._handleOnEndReached.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.artists && this.state.lastPosition === 0) {
  //     this.setState({
  //       artists: nextProps.artists.slice(0, FETCH_NUMBER),
  //       lastPosition: FETCH_NUMBER
  //     });
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.itemViewMode !== this.props.itemViewMode
      || nextProps.artists !== this.props.artists
      || nextProps.language !== this.props.language
      || nextState.lastPosition !== this.state.lastPosition;
  }

  render() {
    let itemHeight = this.props.itemViewMode === 'row' ? styles._rowCard.height : styles._coverCard.height;

    return (
      <Body hasPaginationHeader={true}>
        {
          !this.props.isReady ?
            <BodyActivityIndicator /> :
            <FlatList
              data={this.state.artists}
              showsVerticalScrollIndicator={false}
              onEndReached={this._handleOnEndReached}
              onEndReachedThreshold={0.5}
              renderItem={({ item }) => this._renderArtist(item)}
              keyExtractor={(item, index) => index}
              getItemLayout={(data, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
              style={{ flexDirection: 'column', alignSelf: 'flex-start' }}
              numColumns={this.props.itemViewMode === 'row' ? 1 : 2}
              key={this.props.itemViewMode} />
        }
      </Body>
    );
  }

  _renderArtist(artist) {
    if (this.props.itemViewMode === 'row') {
      return this._renderRowArtist(artist);
    } else {
      return this._renderCardArtist(artist);
    }
  }

  _renderRowArtist(artist) {
    let songsCount = artist.albums.reduce(((sum, array) => sum + array.songs.length), 0);

    return (
      <RowCoverCard
        title={artist.artist}
        detail={artist.albums.length + ' ' + this.props.dictionary.getWord('albums') + ' - ' + songsCount + ' ' + this.props.dictionary.getWord('songs')}
        cover={artist.cover}
        isFavorite={artist.isFavorite}
        onPress={() => this.props.navigation.navigate('Artist', { album: artist })}
        onLikePress={() => this.props.like('artist', artist)} />
    );
  }

  _renderCardArtist(artist) {
    return (
      <CoverCard
        onPress={() => this.props.navigation.navigate('Artist', { artist: artist })}
        source={require('../images/default-cover.png')}
        imageUri={artist.cover}
        title={artist.artist} />
    );
  }

  _handleOnEndReached(info) {
    if (this.state.artists.length < this.props.artists.length) {
      let artists = this.state.artists.concat(this.props.artists.slice(this.state.lastPosition, this.state.lastPosition + FETCH_NUMBER));
      this.setState({
        artists,
        lastPosition: this.state.lastPosition + FETCH_NUMBER
      });
    }
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    language: state.app.language,
    isReady: state.app.homeArtistsReady,
    artists: state.app.artists,
    itemViewMode: state.home.itemViewMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    like: (type, artist) => dispatch(favoritesActions.like(type, artist))
  }
}

HomeArtists.propTypes = {
  navigation: PropTypes.object.isRequired,
  dictionary: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  isReady: PropTypes.bool.isRequired,
  artists: PropTypes.array.isRequired,
  itemViewMode: PropTypes.string.isRequired,
  like: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeArtists);