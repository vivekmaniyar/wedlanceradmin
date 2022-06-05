import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert, Pressable} from 'react-native';
import {ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import OrderdetailsModal from './Modals/OrderdetailsModal';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function OrdersScreen() {
    const[isLoading, setLoading] = useState(true);
    const[OrderId, setOrderId] = useState(0);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);

    const getOrders = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Orders');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    const onRefresh = async() => {
        setLoading(true);
        await wait(1000);
        getOrders();
        setRefreshing(false);
    }

    const ActivateModal = (orderId) => {
        setOrderId(orderId);
        setModalVisible(true);
    }

    const DeactivateAddModel = () => {
        setModalVisible(false);
    }

    return (
        <View>
            {ModalVisible && <OrderdetailsModal
                orderId={OrderId}
                visible={ModalVisible}
                onClose={DeactivateAddModel}
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
                            key={l.orderId}
                            bottomDivider
                            topDivider
                            >
                            <Pressable onPress={() => ActivateModal(l.orderId)}>
                                <ListItem.Content>
                                    <ListItem.Title>{l.orderId}</ListItem.Title>
                                    <ListItem.Subtitle>Amount: ₹{l.amount}</ListItem.Subtitle>
                                </ListItem.Content>
                            </Pressable>
                        </ListItem>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default OrdersScreen;