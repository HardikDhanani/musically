import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HeaderCenterSection from './HeaderLeftSection';
import HeaderTitle from './HeaderTitle';

class HeaderCenterSectionWithTitle extends PureComponent {
  render() {
    return (
      <HeaderCenterSection>
        <HeaderTitle>{this.props.title}</HeaderTitle>
      </HeaderCenterSection>
    );
  }
}

HeaderCenterSectionWithTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default HeaderCenterSectionWithTitle;