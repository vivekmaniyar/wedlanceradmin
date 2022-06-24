import React,{useState,useEffect} from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, ScrollView, RefreshControl, FlatList } from 'react-native';
import {ListItem, Text, Avatar, Divider, Icon} from "@rneui/themed";
import { Block, Button} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function ProfilesScreen() {
    const[isLoading, setLoading] = useState(true);
    const[refreshing, setRefreshing] = useState(false);
    const[data, setData] = useState([]);
    //const BASE_URL = 'https://res.cloudinary.com/dvml1uyhb/image/upload/';

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
        <SafeAreaView style={styles.container}>
            <Avatar rounded size={100} source={{uri: data.profilePicture}} />
            <Text style={styles.TextStyle}>
                {data.firstname} {data.lastname}
            </Text>
            <Text style={{fontSize:15,color:'gray'}}>@{data.userName}</Text>
            <Text style={styles.TextStyle}>
                <Icon name='mail' type='entypo' size={15} style={{paddingRight: 5}}/>
                    {data.email}
            </Text>
            <Text style={styles.TextStyle}>
                <Icon name='phone' type='entypo' size={15} style={{paddingRight: 5}}/>
                    {data.phonenumber}
            </Text>
            <Text style={styles.TextStyle}>
                <Icon name='location-pin' type='entypo' size={15} style={{paddingRight: 5}}/>
                    {data.city}, {data.state}
            </Text>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    TextStyle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 10
    }
})

export default ProfilesScreen;