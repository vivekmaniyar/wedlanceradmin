import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { Button } from 'galio-framework';
import WelcomeScreen from '../Screens/WelcomeScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import CitiesScreen from '../Screens/CitiesScreen';
import StatesScreen from '../Screens/StatesScreen';
import AddCategoryModal from '../Screens/Modals/AddCategoryModal';
import PackageScreen from '../Screens/PackageScreen';
import InquiriesScreen from '../Screens/InquiriesScreen';
import OrdersScreen from '../Screens/OrdersScreen';
import ProfilesScreen from '../Screens/ProfilesScreen';
import Logout from '../Screens/Logout';
import FreelancersScreen from '../Screens/FreelancersScreen';
import EmployersScreen from '../Screens/EmployersScreen';
import FreelancerTab from '../Screens/Tabs/FreelancerTab';

function DrawerNavigator() {
    const drawer = createDrawerNavigator();
    return (
        <drawer.Navigator initialRouteName='Home' screenOptions={{drawerActiveTintColor:"#b04ff9"}}>
            <drawer.Screen name='Home' component={WelcomeScreen} />
            <drawer.Screen name='Categories' component={CategoriesScreen} />
            <drawer.Screen name='Cities' component={CitiesScreen} />
            <drawer.Screen name='States' component={StatesScreen} />
            <drawer.Screen name='Packages' component={PackageScreen} />
            <drawer.Screen name='Freelancers' component={FreelancersScreen} />
            <drawer.Screen name='Employers' component={EmployersScreen} />
            <drawer.Screen name="Inquiries" component={InquiriesScreen} />
            <drawer.Screen name="Orders" component={OrdersScreen} />
            <drawer.Screen name="Profile details" component={ProfilesScreen} />
            <drawer.Screen name="Logout" component={Logout} />
        </drawer.Navigator>
    );
}

export default DrawerNavigator;