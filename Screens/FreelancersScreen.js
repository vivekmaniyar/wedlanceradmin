import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert, Pressable} from 'react-native';
import {Avatar, ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import FreelancerdetailsModal from './Modals/FreelancerdetailsModal';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function FreelancersScreen(props) {
    const[isLoading, setLoading] = useState(true);
    const[username, setUsername] = useState(null);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const BASE_URL = 'https://res.cloudinary.com/dvml1uyhb/image/upload/';

    const getFreelancers = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Profiles/freelancers',{
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                    });
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFreelancers();
    }, []);

    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getFreelancers();
        setRefreshing(false);
    }

    const ActivateModal = (username) => {
        setUsername(username);
        setModalVisible(true);
    }

    const DeactivateModal = () => {
        setModalVisible(false);
    }

    return (
        <View>
            {ModalVisible && <FreelancerdetailsModal
                username={username}
                visible={ModalVisible}
                onClose={DeactivateModal}
            />}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {isLoading ? (
                    <ActivityIndicator size={30} color={"#b04ff9"}/>
                ) : (
                    data.map((l) => (
                        <ListItem
                            key={l.id}
                            bottomDivider
                            topDivider
                            >
                                <Avatar rounded source={{uri: BASE_URL+l.profilePicture}} />
                                <Pressable onPress={() => navigation.navigate('Freelancer details',{username: l.userName})}>
                                    <ListItem.Content>
                                        <ListItem.Title>{l.firstname} {l.lastname}</ListItem.Title>
                                        <ListItem.Subtitle style={{color:'gray'}}>@{l.userName}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </Pressable>
                        </ListItem>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default FreelancersScreen;