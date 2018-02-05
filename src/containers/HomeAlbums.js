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

class HomeAlbums extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      lastPosition: 0
    }

    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderRowAlbum = this._renderRowAlbum.bind(this);
    this._renderCardAlbum = this._renderCardAlbum.bind(this);
    this._handleOnEndReached = this._handleOnEndReached.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.albums && this.state.lastPosition === 0) {
      this.setState({
        albums: nextProps.albums.slice(0, FETCH_NUMBER),
        lastPosition: FETCH_NUMBER
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.itemViewMode !== this.props.itemViewMode
      || nextProps.albums !== this.props.albums
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
              data={this.state.albums}
              showsVerticalScrollIndicator={false}
              onEndReached={this._handleOnEndReached}
              onEndReachedThreshold={0.5}
              renderItem={({ item }) => this._renderAlbum(item)}
              keyExtractor={(item, index) => index}
              getItemLayout={(data, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
              style={{ flexDirection: 'column' }}
              numColumns={this.props.itemViewMode === 'row' ? 1 : 2}
              key={this.props.itemViewMode} />
        }
      </Body>
    );
  }

  _renderAlbum(album) {
    if (this.props.itemViewMode === 'row') {
      return this._renderRowAlbum(album);
    } else {
      return this._renderCardAlbum(album);
    }
  }

  _renderRowAlbum(album) {
    return (
      <RowCoverCard
        title={album.album}
        detail={album.artist + ' - ' + album.songs.length + ' ' + this.props.dictionary.getWord('songs')}
        cover={album.cover}
        isFavorite={album.isFavorite}
        onPress={() => this.props.navigation.navigate('Album', { album })}
        onLikePress={() => this.props.like('album', album)} />
    );
  }

  _renderCardAlbum(album) {
    return (
      <CoverCard
        onPress={() => this.props.navigation.navigate('Album', { album })}
        source={require('../images/default-cover.png')}
        imageUri={album.cover}
        title={album.album}
        detail={album.artist} />
    );
  }

  _handleOnEndReached(info) {
    if (this.state.albums.length < this.props.albums.length) {
      let albums = this.state.albums.concat(this.props.albums.slice(this.state.lastPosition, this.state.lastPosition + FETCH_NUMBER));
      this.setState({
        albums,
        lastPosition: this.state.lastPosition + FETCH_NUMBER
      });
    }
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    language: state.app.language,
    isReady: state.app.homeAlbumsReady,
    albums: state.app.albums,
    itemViewMode: state.home.itemViewMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    like: (type, album) => dispatch(favoritesActions.like(type, album))
  }
}

HomeAlbums.propTypes = {
  navigation: PropTypes.object.isRequired,
  dictionary: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  isReady: PropTypes.bool.isRequired,
  albums: PropTypes.array.isRequired,
  itemViewMode: PropTypes.string.isRequired,
  like: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeAlbums);