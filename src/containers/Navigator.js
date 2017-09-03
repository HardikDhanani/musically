import { StackNavigator } from 'react-navigation';

import Home from './Home';
import Search from './Search';
import Artist from './Artist';
import Album from './Album';
import Genre from './Genre';
import Player from './Player';
import Queue from './Queue';
import Favorites from './Favorites';

const AppNavigator = StackNavigator(
    {
        Home: { screen: Home },
        Search: { screen: Search },
        Artist: { screen: Artist },
        Album: { screen: Album },
        Genre: { screen: Genre },
        Player: { screen: Player },
        Queue: { screen: Queue },
        Favorites: { screen: Favorites },
    },
    {
        initialRouteName: "Home",
        headerMode: 'none',
    }
);

export default AppNavigator;

// import React from 'react';
// // import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { addNavigationHelpers, StackNavigator } from 'react-navigation';

// export const AppNavigator = StackNavigator({
//     Home: { screen: Home }
// });

// const Navigator = ({ dispatch, nav }) => (
//     <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );

// // AppWithNavigationState.propTypes = {
// //     dispatch: PropTypes.func.isRequired,
// //     nav: PropTypes.object.isRequired,
// // };

// const mapStateToProps = state => ({
//     nav: state.nav,
// });

// export default connect(mapStateToProps)(Navigator);
