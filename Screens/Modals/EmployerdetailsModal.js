import { Icon, Overlay, Switch } from '@rneui/themed';
import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View, Text, ScrollView} from 'react-native';
import {Avatar} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EmployerdetailsModal(props) {
    const[data, setData] = useState([]);
    const[switchtoggle, setSwitch] = useState(false);

    const profiledetails = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/profiledetails?username=${props.username}`);
            const json = await response.json();
            setData(json);
            setSwitch(json.isActive);
        } catch (error) {
            console.error(error);
        }
    }

    const changeaccountstatus = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/changeaccountstatus?username=${props.username}`,{
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                    });
                    setSwitch(!switchtoggle);
                } catch (error) {
                    console.error(error);
                }
    }

    useEffect(() => {
        profiledetails();
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
            <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center',justifyContent:'center'}}>
                <Avatar rounded size={100} source={{uri: "https://picsum.photos/200/300"}} />
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
                <Switch color='#b04ff9' value={switchtoggle} onValueChange={() => changeaccountstatus()}/>
            </ScrollView>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    TextStyle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 10
    }
})

export default EmployerdetailsModal;