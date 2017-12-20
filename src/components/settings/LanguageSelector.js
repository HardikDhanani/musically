import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Text
} from 'react-native';
import Option from './Option';
import RadioButton from './RadioButton';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionOptionText: {
    fontSize: 16
  },
  sectionOptionTextSelected: {
    color: '$elementActive'
  },
  sectionOptionTextUnselected: {
    color: '$elementInactive'
  }
});

class LanguageSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: this.props.selectedOption
    }

    this._renderOptions = this._renderOptions.bind(this);
    this._selectOption = this._selectOption.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderOptions()}
      </View>
    );
  }

  _renderOptions() {
    return this.props.items.map((item, index) => {
      let color = this.state.selectedOption === item.value ? styles.sectionOptionTextSelected : styles.sectionOptionTextUnselected;
      return (
        <Option key={index} onPress={() => this._selectOption(item.value)} style={styles.option}>
          <LeftColumn>
            <Text style={[styles.sectionOptionText, color]}>{item.text}</Text>
          </LeftColumn>
          <RightColumn>
            <View>
              <RadioButton selected={this.state.selectedOption === item.value} />
            </View>
          </RightColumn>
        </Option>
      );
    });
  }

  _selectOption(selectedOption) {
    this.setState({ selectedOption }, () => {
      if (this.props.onOptionChanged) {
        this.props.onOptionChanged(this.state.selectedOption);
      }
    })
  }
}

LanguageSelector.propTypes = {
  onOptionChanged: PropTypes.func
};

export default LanguageSelector;