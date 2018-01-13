import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Option from './Option';
import RadioButton from './RadioButton';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import Text from '../common/Text';

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0
  },
  sectionOptionText: {
    fontSize: 16
  },
  sectionOptionTextSelected: {
    color: '$textMainColor'
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
          <Text style={[styles.sectionOptionText, color]}>{item.text}</Text>
        </Option>
      );
    });
  }

  _selectOption(selectedOption) {
    this.setState({ selectedOption }, () => {
      this.props.onOptionChanged(this.state.selectedOption);
    })
  }
}

LanguageSelector.propTypes = {
  onOptionChanged: PropTypes.func.isRequired
};

export default LanguageSelector;