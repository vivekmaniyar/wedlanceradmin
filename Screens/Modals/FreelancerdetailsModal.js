import { Switch } from '@rneui/themed';
import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View, Text, FlatList, ScrollView} from 'react-native';
import {Avatar,Tab, Image, ListItem, Icon,Overlay} from '@rneui/themed';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FreelancerTab from '../Tabs/FreelancerTab';
import { TabBar } from 'react-native-tab-view';

function FreelancerdetailsModal(props) {
    const[data, setData] = useState([]);
    const[Portfolio, setPortfolio] = useState([]);
    const[Reviews, setReviews] = useState([]);
    const[Bookings, setBookings] = useState([]);
    const[switchtoggle, setSwitch] = useState(false);
    const BASE_URL = 'https://res.cloudinary.com/dvml1uyhb/image/upload/';

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

    const portfolio = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/searchportfolio?username=${props.username}`);
            const json = await response.json();
            setPortfolio(json);
        } catch (error) {
            console.error(error);
        }
    }

    const reviews = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Reviews/freelancerreviews?username=${props.username}`);
            const json = await response.json();
            setReviews(json);
        } catch (error) {
            console.error(error);
        }
    }

    const bookings = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Bookings/freelancerbookings?username=${props.username}`,{
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                    });
            const json = await response.json();
            setBookings(json);
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
        portfolio();
        reviews();
    }, []);

    const Tab = createMaterialTopTabNavigator();

    function Test(){
        return(
            <View>
                <Text>{data.firstName}</Text>    
            </View>
        );
    }

    return (
        <Overlay
        isVisible={props.visible}
        animationType='slide'
        onBackdropPress={props.onClose}
        fullScreen={true}
        overlayStyle={{height:"40%",width:"80%",borderRadius:10}}
        >
            <SafeAreaView style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <Icon name='close' type='antdesign' size={30} onPress={props.onClose}/>
            </SafeAreaView>
            <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center',justifyContent:'center'}}>
                <Avatar rounded size={100} source={{uri: BASE_URL+data.profilePicture}} />
                <Text style={styles.TextStyle}>
                     {data.firstname} {data.lastname}
                </Text>
                <Text style={{fontSize:15,color:'gray'}}>@{data.userName}</Text>
                <Text style={styles.TextStyle}>
                    <Icon name='camera' type='entypo' size={15} style={{paddingRight: 5}}/>
                    {data.category}
                </Text>
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
                <Switch color='#b04ff9' value={switchtoggle} onValueChange={() => changeaccountstatus()}></Switch>             
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
    },
    item: {
        aspectRatio: 1,
        width: '50%',
        flex: 1,
    },
    list: {
        width: '100%',
        backgroundColor: '#000',
      }
})

export default FreelancerdetailsModal;