import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ScrollView,
  View
} from 'react-native';
import FloatMenu from './FloatMenu';
import Container from './Container';
import Body from './Body';
import ContainerViewHeader from './ContainerViewHeader';
import ContainerViewCover from './ContainerViewCover';
import ContainerViewSection from './ContainerViewSection';
import MixButton from './common/buttons/MixButton';

class ContainerView extends Component {
  constructor(props) {
    super(props);

    this._renderMenu = this._renderMenu.bind(this);
  }

  render() {
    return (
      <Container>
        <ContainerViewHeader
          title={this.props.title}
          liked={this.props.like}
          onBackPress={this.props.onBackPress}
          onSearchPress={this.props.onSearchPress}
          onLikePress={this.props.onLikePress}
          onMenuPress={this.props.onMenuPress} />
        <Body>
          <ContainerViewCover
            coverContent={this.props.coverContent}
            source={this.props.imageUri ? { uri: this.props.imageUri } : this.props.source} />
          <ScrollView>
            {this._renderContent(this.props.sections)}
          </ScrollView>
        </Body>
        <MixButton style={{ top: 153, right: 20 }} onPress={this.props.onPlayPress} />
        {this._renderMenu()}
        {this.props.footer}
      </Container>
    );
  }

  _renderContent(sections) {
    let ret = [];

    if (sections) {
      sections.map((section, i) => {
        ret.push(
          <ContainerViewSection
            key={i}
            title={section.title}
            data={section.data}
            renderItem={section.renderItem}
            keyExtractor={(item, index) => index} />
        );
      });
    }

    return ret;
  }

  _renderMenu() {
    if (!this.props.showMenu)
      return null;

    return this.props.menuContent;
  }
}

ContainerView.propTypes = {
  title: PropTypes.string,
  imageUri: PropTypes.string,
  like: PropTypes.bool,
  onBackPress: PropTypes.func,
  onSearchPress: PropTypes.func,
  onLikePress: PropTypes.func,
  onMenuPress: PropTypes.func,
  onPlayPress: PropTypes.func
};

export default ContainerView;