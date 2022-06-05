import { Icon, Overlay } from '@rneui/themed';
import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View, Text} from 'react-native';

function OrderdetailsModal(props) {
    const[data, setData] = useState([]);

    const getOrder = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Orders/${props.orderId}`);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOrder();
    }, []);

    return (
        <Overlay
        animationType="slide"
        onBackdropPress={props.onClose}
        isVisible={props.visible}
        fullScreen={true}
        overlayStyle={{height:"40%",width:"80%",borderRadius:10}}
        >
            <SafeAreaView style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <Icon name='close' type='antdesign' size={30} onPress={props.onClose}/>
            </SafeAreaView>
            <SafeAreaView style={styles.SafeAreaViewContainer}>
                    <Text style={styles.TextStyle}>OrderId: {data.orderId}</Text>
                    <Text style={styles.TextStyle}>PaymentId: {data.paymentId}</Text>
                    <Text style={styles.TextStyle}>Amount: ₹{data.amount}</Text>
                    <Text style={styles.TextStyle}>Package: {data.package}</Text>
                    <Text style={styles.TextStyle}>Username: {data.freelancerusername}</Text>
                    <Text style={styles.TextStyle}>Status: {data.status}</Text>
            </SafeAreaView>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    SafeAreaViewContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    ViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextStyle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 10
    }
})

export default OrderdetailsModal;