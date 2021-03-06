import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert, Pressable,SafeAreaView} from 'react-native';
import {ListItem,Badge} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InquirydetailsModal from './Modals/InquirydetailsModal';

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

    const DeactivateModal = () => {
        setModalVisible(false);
        setLoading(true);
        getInquiries();
    }


    return (
        <View>
            {ModalVisible && <InquirydetailsModal
                inquiryId={InquiryId}
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
                {isLoading?<ActivityIndicator size={30} color={"#b04ff9"}/> :(
                    data.map((l) => (
                        <ListItem
                            key={l.id}
                            bottomDivider
                            topDivider
                            >
                            <Pressable onPress={() => ActivateModal(l.id)}>
                                <ListItem.Content>
                                    <SafeAreaView style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:15}}>{l.name}</Text>
                                        <Badge containerStyle={{position:'relative'}} status={l.status.trim()=='Complete'?'success':'warning'} value={l.status.trim()} />
                                    </SafeAreaView>
                                    <ListItem.Subtitle>"{l.message}"</ListItem.Subtitle>
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