import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert, Pressable} from 'react-native';
import {Avatar, ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmployerdetailsModal from './Modals/EmployerdetailsModal';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function EmployersScreen(props) {
    const[isLoading, setLoading] = useState(true);
    const[username, setUsername] = useState(null);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);

    const getEmployers = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Profiles/employers',{
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
        getEmployers();
    }, []);

    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getEmployers();
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
            {ModalVisible && <EmployerdetailsModal
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
                                
                                <Avatar rounded source={{uri: "https://picsum.photos/200/300"}} />
                                <Pressable onPress={() => ActivateModal(l.userName)}>                               
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

export default EmployersScreen;