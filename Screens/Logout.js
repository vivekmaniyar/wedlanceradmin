import React,{useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {View, Text} from 'react-native';

function Logout() {

    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('username');
    const navigation = useNavigation();

    useEffect(() => {
        navigation.navigate('Login');
    }, []);
    
    return null;
}

export default Logout;