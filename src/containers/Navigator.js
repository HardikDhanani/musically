import { StackNavigator } from 'react-navigation';

import Splash from './Splash';
import Home from './Home';
import Search from './Search';
import Artist from './Artist';
import Album from './Album';
import Genre from './Genre';
import Player from './Player';
import Queue from './Queue';
import Favorites from './Favorites';
import Playlist from './Playlist';

const AppNavigator = StackNavigator(
    {
        Splash: { screen: Splash },
        Home: { screen: Home },
        Search: { screen: Search },
        Artist: { screen: Artist },
        Album: { screen: Album },
        Genre: { screen: Genre },
        Player: { screen: Player },
        Queue: { screen: Queue },
        Favorites: { screen: Favorites },
        Playlist: { screen: Playlist },
    },
    {
        initialRouteName: "Splash",
        headerMode: 'none',
    }
);

export default AppNavigator;
