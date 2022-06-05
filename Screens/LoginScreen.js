import React,{useState} from 'react';
import {SafeAreaView, StyleSheet,ActivityIndicator,View,StatusBar} from 'react-native';
import {Block, Button} from 'galio-framework';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Text} from '@rneui/themed';

function LoginScreen() {
    const navigation = useNavigation();
    const[username, setUsername] = useState(null);
    const[password, setPassword] = useState(null);
    const[isLoading, setLoading] = useState(false);
    const[passwordvisible, setPasswordvisible] = useState(true);

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
            {isLoading?<ActivityIndicator size={50} color={"#b04ff9"}/>:(
            <SafeAreaView style={styles.container}>
                <Text style={{alignSelf:'center',fontSize:50,fontFamily:'sans-serif-light',fontWeight:'100',paddingBottom: 20}}>LOGIN</Text>
                <Input placeholder='Username' style={{height:10,width: 20}} rightIcon={{type:'Ionicons',name:'person'}} onChangeText={setUsername}/>
                <Input placeholder='Password' rightIcon={{type:'feather',name:(passwordvisible?'eye':'eye-off'),onPress:() => setPasswordvisible(!passwordvisible)}} secureTextEntry={passwordvisible} onChangeText={setPassword}/>
                <Button onPress={onLogin} style={{alignSelf:'center',backgroundColor:'#b04ff9'}} uppercase>Login</Button>
            </SafeAreaView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        padding: 20
    },
})

export default LoginScreen;