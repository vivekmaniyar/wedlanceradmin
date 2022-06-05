import React,{useState,useEffect} from 'react';
import {Block, Text} from 'galio-framework';
import {SafeAreaView,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WelcomeScreen() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('username').then(value => {
            setUsername(value);
        });
    }, []);

    return (    
        <SafeAreaView>
            <Text style={{alignSelf:'center',fontSize:30,fontFamily:'sans-serif-light',fontWeight:'700'}}>Welcome, {username}</Text>
        </SafeAreaView>
    );
}

export default WelcomeScreen;