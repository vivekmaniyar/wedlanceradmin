import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert, Pressable} from 'react-native';
import {ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function InquiriesScreen(props) {
    const[isLoading, setLoading] = useState(true);
    const[InquiryId, setInquiryId] = useState(0);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);

    const getInquiries = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Inquiries',{
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
        getInquiries();
    }, []);

    const onRefresh = async() => {
        setLoading(true);
        await wait(1000);
        getInquiries();
        setRefreshing(false);
    }

    const ActivateModal = (id) => {
        setInquiryId(id);
        setModalVisible(true);
    }

    const rightswipe = (id) => {
        <Button icon='info' iconFamily='Feather' iconColor='white' color='dodgerblue'
        onPress={() => console.log("pressed")}>
            Info
        </Button>
    }

    const leftswipe = (id) => {
        <Block bottom>
        <Button icon='check' iconFamily='Feather' iconColor='white' color='dodgerblue'>
            Check
        </Button>
        </Block>
    }


    return (
        <View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {isLoading?<ActivityIndicator /> :(
                    data.map((l) => (
                        <ListItem
                            key={l.id}
                            bottomDivider
                            topDivider
                            >
                            <Pressable onPress={() => console.log(l.name)}>
                                <ListItem.Content>
                                    <ListItem.Title>{l.name}</ListItem.Title>
                                    <ListItem.Subtitle>Status: {l.status}</ListItem.Subtitle>
                                </ListItem.Content>
                            </Pressable>
                        </ListItem>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default InquiriesScreen;