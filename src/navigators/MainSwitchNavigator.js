import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// import Splash from '../screens/SplashScreen';
import Login from '../screens/login';
import { AuthStackNavigator } from './AuthStackNavigator';
import { AppStackNavigator } from './AppStackNavigator';

export const MainSwitchNavigator = createAppContainer(createSwitchNavigator(
    {
        Login,
        Auth: AuthStackNavigator,
        App: AppStackNavigator
    },
    {
        initialRouteName: 'Login',
    }
));
