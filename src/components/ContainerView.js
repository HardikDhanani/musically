import React, { Component } from 'react';

import { StyleSheet, ScrollView, StatusBar, View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import Header from '../components/Header';
import FloatMenu from '../components/FloatMenu';
import HeaderTitle from '../components/HeaderTitle';
import Container from '../components/Container';
import Body from '../components/Body';
import ContainerViewHeader from '../components/ContainerViewHeader';
import ContainerViewCover from '../components/ContainerViewCover';

export default class ContainerView extends Component {
  constructor(props) {
    super(props);

    this._renderContent = this._renderContent.bind(this);
    this._renderMenu = this._renderMenu.bind(this);

    throw new Error('Finish this');
  }

  render() {
    return (
      <Container>
        <ContainerViewHeader
          title={this.props.title}
          liked={this.props.like}
          onBackPress={() => this.props.onBackPress()}
          onSearchPress={() => this.props.onSearchPress()}
          onLikePress={() => this.props.onLikePress()}
          onMenuPress={() => this.props.onMenuPress()} />
        <Body>
          <ContainerViewCover
            coverContent={this.props.coverContent}
            source={this.props.imageUri ? { uri: this.props.imageUri } : this.props.source} />
          <View style={{ alignItems: 'center', alignSelf: 'center', height: this._getHeight() }}>
            <ScrollView>
              {this._renderContent()}
            </ScrollView>
          </View>
        </Body>
        <TouchableOpacity style={styles.mixButton} onPress={this.props.onPlayPress} />
        {this._renderMenu()}
        {this.props.footer}
      </Container>
    );
  }

  _getHeight() {
    let footerHeight = 60;
    let headerHeight = Header.currentHeight;
    let statusBarHeight = StatusBar.currentHeight;
    let windowHeight = Dimensions.get('window').height;
    let coverHeight = ContainerView.currentCoverHeight;

    return windowHeight - (headerHeight + footerHeight + statusBarHeight + coverHeight);
  }

  _renderContent() {
    let ret = [];

    if (this.props.sections) {
      this.props.sections.map((section, i) => {
        ret.push(
          <View key={i} style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={[styles.coverText, { color: 'gray', fontSize: 15 }]}>{section.title}</Text>
            </View>
            <View style={styles.page}>
              <FlatList data={section.data} renderItem={section.renderItem} keyExtractor={(item, index) => index} />
            </View>
          </View>
        );
      });
    }

    return ret;
  }

  _renderMenu() {
    if (!this.props.showMenu)
      return null;

    return (
      <FloatMenu positionY={this.props.menuPositionY} positionX={this.props.menuPositionX} onPress={() => this.props.onMenuPress()}>
        {this.props.menuContent}
      </FloatMenu>
    );
    return null;
  }

  static get currentCoverHeight() {
    return Dimensions.get('window').height * 0.21;
  }
}

const styles = StyleSheet.create({
  section: {
    flex: 1
  },
  sectionTitle: {
    width: Dimensions.get('window').width,
    height: Header.currentHeight * 0.8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'center'
  },
  mixButton: {
    position: 'absolute',
    top: 153,
    right: 20,
    height: Header.currentHeight,
    width: Header.currentHeight,
    borderRadius: 100,
    backgroundColor: '#ffa500',
  }
});