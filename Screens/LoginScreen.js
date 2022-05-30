import React,{useState} from 'react';
import {SafeAreaView, StyleSheet,ActivityIndicator} from 'react-native';
import {Block, Text, Input, Button} from 'galio-framework';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen() {
    const navigation = useNavigation();
    const[username, setUsername] = useState(null);
    const[password, setPassword] = useState(null);
    const[isLoading, setLoading] = useState(false);

    const onLogin = async() => {
        setLoading(true);
        if(username === null || password === null) {
            setLoading(false);
            alert('Yor can not leave any field empty');
        } else {
            try{
            const response = await fetch("https://wedlancer.azurewebsites.net/api/Auth/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                        })
                });
                if(response.status === 200) {
                    const json = await response.json();
                    AsyncStorage.setItem('token', json.token);
                    AsyncStorage.setItem('username', username);
                    setUsername(null);
                    setPassword(null);
                    setLoading(false);
                    navigation.navigate('Drawer');
                } else {
                    setLoading(false);
                    alert('Wrong username or password');
                }
            } catch(error) {
                console.error(error);
            }
        }
    }

    return (
        
        <SafeAreaView style={styles.container}>
            {isLoading?<ActivityIndicator/>:(
            <SafeAreaView style={styles.container}>
                <Text h1 bold>Login</Text>
                <Input placeholder='Username' rounded onChangeText={setUsername}/>
                <Input placeholder='Password' password viewPass rounded onChangeText={setPassword}/>
                <Button round onPress={onLogin} >Login</Button>
            </SafeAreaView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
})

export default LoginScreen;