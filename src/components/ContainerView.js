import React, { Component } from 'react';

import { StyleSheet, ScrollView, StatusBar, Image, View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import Header from '../components/Header';
import FloatMenu from '../components/FloatMenu';
import Title from '../components/Title';

export default class ContainerView extends Component {
  constructor(props) {
    super(props);

    this._keyExtractor = this._keyExtractor.bind(this);
    this._renderCover = this._renderCover.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <View style={styles.body}>
          {this._renderCover()}
          <View style={{ alignItems: 'center', alignSelf: 'center', height: this._getHeight() }}>
            <ScrollView>
              {this._renderContent()}
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity style={styles.mixButton} onPress={this.props.onPlayPress}></TouchableOpacity>
        {this._renderMenu()}
        {this.props.footer}
      </View>
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

  _renderHeader() {
    return (
      <Header style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.onBackPress()}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignSelf: 'center', flex: 1 }}>
          <Title style={styles.title}>{this.props.title}</Title>
        </View>
        <View style={[styles.right, styles.row]}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.onSearchPress()}>
            <Text style={styles.buttonText}>{'S'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.onLikePress()}>
            <Text style={[styles.buttonText, { color: this.props.like ? 'orange' : 'white' }]}>{'L'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.onMenuPress()}>
            <Text style={styles.buttonText}>{'+'}</Text>
          </TouchableOpacity>
        </View>
      </Header>
    );
  }

  _renderCover() {
    return (
      <View style={styles.cover}>
        <Image source={this.props.imageUri ? { uri: this.props.imageUri } : this.props.source} style={styles.image} />
        <View style={{ flex: 1, paddingLeft: 15 }}>
          {this.props.coverContent}
        </View>
      </View>
    );
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
              <FlatList data={section.data} renderItem={section.renderItem} keyExtractor={this._keyExtractor} />
            </View>
          </View>
        );
      });
    }

    return ret;
  }

  _keyExtractor(item, index) {
    return index;
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
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E2E2E'
  },
  body: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
  },
  left: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    height: Header.currentHeight * 0.7,
    width: Header.currentHeight * 0.7,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  cover: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: ContainerView.currentCoverHeight,
    backgroundColor: '#2E2E2E',
  },
  image: {
    width: Header.currentHeight * 2,
    height: Header.currentHeight * 2,
    marginLeft: 20,
  },
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