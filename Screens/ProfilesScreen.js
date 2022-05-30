import React,{useState,useEffect} from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, ScrollView, RefreshControl, FlatList } from 'react-native';
import {ListItem, Text, Avatar, Divider} from "@rneui/themed";
import { Block, Button, Icon} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function ProfilesScreen() {
    const[isLoading, setLoading] = useState(true);
    const[refreshing, setRefreshing] = useState(false);
    const[data, setData] = useState([]);

    const profiledetails = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/profiledetails?username=${await AsyncStorage.getItem('username')}`);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        profiledetails();
    }, []);

    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getPackages();
        setRefreshing(false);
    }

    const renderItem = (item) => {
        <Text>Username: {item.userName}</Text>
    }

    return (
        <View style={styles.container}>
            <Avatar rounded size={100} source={{uri: "https://picsum.photos/200/300"}} />
            <Text style={styles.TextStyle}>FirstName: {data.firstname}</Text>
            <Text style={styles.TextStyle}>LastName: {data.lastname}</Text>
            <Text style={styles.TextStyle}>Username: {data.userName}</Text>
            <Text style={styles.TextStyle}>Email: {data.email}</Text>
            <Text style={styles.TextStyle}>Phone: {data.phonenumber}</Text>
            <Text style={styles.TextStyle}>City: {data.city}</Text>
            <Text style={styles.TextStyle}>State: {data.state}</Text>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextStyle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 10
    }
})

export default ProfilesScreen;