import { StackNavigator } from 'react-navigation';

import { Animated, Easing } from 'react-native';

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
import PlaylistSelector from './PlaylistSelector';
import RecentlyPlayed from './RecentlyPlayed';
import MostPlayed from './MostPlayed';

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
        RecentlyPlayedSettings: { screen: RecentlyPlayedSettings },
        RecentlyPlayed: { screen: RecentlyPlayed },
        MostPlayed: { screen: MostPlayed }
    },
    {
        initialRouteName: 'Splash',
        headerMode: 'none',
        mode: 'none'
    }
);

const _modalNavigator = StackNavigator(
    {
        Main: { screen: AppNavigator },
        PlaylistSelector: { screen: PlaylistSelector }
    },
    {
        headerMode: 'none',
        mode: 'modal'
    }
);

export default _modalNavigator;
