import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as homeActions from '../actions/homeActions';
import { connect } from 'react-redux';

class Home extends Component {
    render() {
        // const { state, actions } = this.props;
        return (
            // <Counter
            //     counter={state.count}
            //     {...actions} />
            <View>
                <Text>This is my Home</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {

}

const mapDispatchToProps = dispatch => {
    load: homeActions.load
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);