import { StackNavigator } from 'react-navigation';

import Splash from './Splash';
import Home from './Home';
import Search from './Search';
import Artist from './Artist';
import Album from './Album';
import Player from './Player';
import Queue from './Queue';
import Favorites from './Favorites';
import Playlist from './Playlist';
import Settings from './Settings';
import MostPlayedSettings from './MostPlayedSettings';
import RecentlyPlayedSettings from './RecentlyPlayedSettings';

const AppNavigator = StackNavigator(
    {
        Splash: { screen: Splash },
        Home: { screen: Home },
        Search: { screen: Search },
        Artist: { screen: Artist },
        Album: { screen: Album },
        Player: { screen: Player },
        Queue: { screen: Queue },
        Favorites: { screen: Favorites },
        Playlist: { screen: Playlist },
        Settings: { screen: Settings },
        MostPlayedSettings: { screen: MostPlayedSettings },
        RecentlyPlayedSettings: { screen: RecentlyPlayedSettings }
    },
    {
        initialRouteName: 'Splash',
        headerMode: 'none',
    }
);

export default AppNavigator;
