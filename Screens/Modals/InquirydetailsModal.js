import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View, Text, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Overlay } from '@rneui/themed';

function InquirydetailsModal(props) {
    const[data, setData] = useState([]);
    const[Buttondisabled, setButtondisabled] = useState(false);

    const getInquiry = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Inquiries/${props.inquiryId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                    });
            const json = await response.json();
            {json.status.trim() === 'Pending' ? setButtondisabled(false) : setButtondisabled(true)}
            setData(json);
        } catch (error) {
            console.error(error);
        }
    }

    const markascomplete = async(inquiryId) => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Inquiries/${inquiryId}?status=Complete`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                    });
            props.onClose();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getInquiry();
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
            <ScrollView style={styles.SafeAreaViewContainer}>
                    <Text style={styles.TextStyle}>Inquiry ID: {data.id}</Text>
                    <Text style={styles.TextStyle}>
                        <Icon name='user' type='entypo' size={15} style={{paddingRight:5}}/>
                         {data.name}
                    </Text>
                    <Text style={styles.TextStyle}>
                        <Icon name='phone' type='entypo' size={15} style={{paddingRight: 5}}/>
                         {data.phoneNumber}
                    </Text>
                    <Text style={styles.TextStyle}>
                        <Icon name='mail' type='entypo' size={15} style={{paddingRight: 5}}/>
                         {data.email}
                    </Text>
                    <Text style={styles.TextStyle}>
                        <Icon name='message' type='entypo' size={15} style={{paddingRight: 5}}/>
                         "{data.message}"
                    </Text>
                    <Text style={styles.TextStyle}>Status: {data.status}</Text>
                    <Button disabled={Buttondisabled} title="Mark as Complete" color={'#b04ff9'} onPress={() => markascomplete(data.id)} />
            </ScrollView>
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
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginTop: 10
    }
})

export default InquirydetailsModal;