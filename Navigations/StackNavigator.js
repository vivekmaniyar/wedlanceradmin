import React from 'react';
import {Block} from 'galio-framework';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import WelcomeScreen from '../Screens/WelcomeScreen';
import DrawerNavigator from './DrawerNavigator';

function StackNavigator() {
    const stack = createNativeStackNavigator();
    return (
            <NavigationContainer>
                <stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false,gestureEnabled: false}}>
                    <stack.Screen name='Login' component={LoginScreen}/>
                    <stack.Screen name='Drawer' component={DrawerNavigator} options={{gestureEnabled: false}}/>
                </stack.Navigator>
            </NavigationContainer>
    );
}

export default StackNavigator;