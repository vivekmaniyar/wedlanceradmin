import React,{useState,useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {Text,View,FlatList, SafeAreaView,ActivityIndicator, StyleSheet,Image,ScrollView} from 'react-native';
import {ListItem,Icon,Switch,Badge,Avatar} from '@rneui/themed';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {WebView} from 'react-native-webview';

function FreelancerTab({route}) {
    const[data, setData] = useState([]);
    const[switchtoggle, setSwitch] = useState(true);
    const[Portfolio, setPortfolio] = useState([]);
    const[review, setReview] = useState([]);
    const[booking, setBooking] = useState([]);
    const BASE_URL = 'https://res.cloudinary.com/dvml1uyhb/image/upload/';

    const profiledetails = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/profiledetails?username=${route.params.username}`);
            const json = await response.json();
            setData(json);
            setSwitch(json.isActive);
        } catch (error) {
            console.error(error);
        }
    }

    const portfolio = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/searchportfolio?username=${route.params.username}`);
            const json = await response.json();
            setPortfolio(json);
        } catch (error) {
            console.error(error);
        }
    }

    const reviews = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Reviews/freelancerreviews?username=${route.params.username}`);
            const json = await response.json();
            setReview(json);
        } catch (error) {
            console.error(error);
        }
    }

    const bookings = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/freelancerbookings?username=${route.params.username}`,{
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                    });
            const json = await response.json();
            setBooking(json);
        } catch (error) {
            console.error(error);
        }
    }

    const changeaccountstatus = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Profiles/changeaccountstatus?username=${route.params.username}`,{
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
        bookings();
    },[]);

    const Tab = createMaterialTopTabNavigator();

    function Freelancerdetails(){
        return(
            <SafeAreaView style={styles.SafeAreaViewContainer}>
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
            </SafeAreaView>
        );
    }

    function Photos(){
        return(
            <ScrollView>
                {Portfolio.map((l) => (
                        <ListItem
                            key={l.portfolioId}
                            bottomDivider
                            topDivider
                            >
                                <ListItem.Content>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: BASE_URL+l.image,
                                    }}
                                />
                                </ListItem.Content>
                        </ListItem>
                    ))}
            </ScrollView>
        );
    }

    function Videos(){
        return(
            <ScrollView>
                {Portfolio.map((l) => (
                        <ListItem
                            key={l.portfolioId}
                            bottomDivider
                            topDivider
                            >
                                <ListItem.Content>
                                    <WebView
                                    style={{width: 320,height: 200}}
                                    source={{uri: l.video}}
                                    />
                                </ListItem.Content>
                        </ListItem>
                    ))}
            </ScrollView>
        );
    }

    function Reviews(){
        return(
            <ScrollView>
            {review.map((l) => 
                (
                    <ListItem
                        key={l.freelancerusername}
                        bottomDivider
                        topDivider
                        >
                            <ListItem.Content>
                                <ListItem.Title>
                                <SafeAreaView style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:15}}>@{l.employeerusername}</Text>
                                    <Text style={{fontSize:15}}> - </Text>
                                    <Icon name='star' type='antdesign' size={12} color={'#ffd700'} />
                                    <Text style={{fontSize:15}}>{l.rating}</Text>
                                </SafeAreaView>
                                </ListItem.Title>
                                <ListItem.Subtitle>"{l.message}"</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>)
            )}
            </ScrollView>
        );
    }

    function Bookings(){
        return(
            <ScrollView>
            {booking.map((l) => 
                (
                    <ListItem
                        key={l.bookingId}
                        bottomDivider
                        topDivider
                        >
                            
                            <ListItem.Content>
                                <ListItem.Title>
                                <SafeAreaView style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:15}}>@{l.employerusername}</Text>
                                <Badge containerStyle={{position:'relative'}} status={l.status.trim()=='Complete'?'success':'warning'} value={l.status.trim()} />
                                </SafeAreaView>
                                </ListItem.Title>
                                <ListItem.Subtitle>
                                    {moment(l.startDate).format('DD/MM/YYYY')}
                                     - 
                                    {moment(l.endDate).format('DD/MM/YYYY')}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>)
            )}
            </ScrollView>
        );
    }

    return (
        <NavigationContainer independent={true}>
            <SafeAreaView style={{backgroundColor:'#fff',alignItems:'center'}}>
                <Avatar containerStyle={{marginTop:20}} rounded size={100} source={{uri: BASE_URL+data.profilePicture}}/>
                <Text style={styles.TextStyle}>
                    {data.firstname} {data.lastname}
                </Text>
                <Text style={{fontSize:15,color:'gray'}}>@{data.userName}</Text>
            </SafeAreaView>
            <Tab.Navigator initialRouteName='Details' screenOptions={{tabBarIndicatorStyle:{backgroundColor:'#b04ff9'}}}>
                <Tab.Screen name="Details" component={Freelancerdetails} options={{tabBarIcon:() => (
                    <Icon name='account-details' type='material-community' size={24}/>
                ),tabBarShowLabel:false}}/>
                <Tab.Screen name="Photos" component={Photos} options={{tabBarIcon:() => (
                    <Icon name='photo' type='foundation' size={24}/>
                ),tabBarShowLabel:false}} />
                <Tab.Screen name="Videos" component={Videos} options={{tabBarIcon:() => (
                    <Icon name='video' type='feather' size={24}/>
                ),tabBarShowLabel:false}}/>
                <Tab.Screen name="Reviews" component={Reviews} options={{tabBarIcon:() => (
                    <Icon name='rate-review' type='material' size={24}/>
                ),tabBarShowLabel:false}}/>
                <Tab.Screen name="Bookings" component={Bookings} options={{tabBarIcon:() => (
                    <Icon name='ticket-account' type='material-community' size={24}/>
                ),tabBarShowLabel:false}}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    list: {
      width: '100%',
      backgroundColor: '#000',
    },
    item: {
      aspectRatio: 1,
      width: '100%',
      flex: 1,
    },
    container: {
        paddingTop: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextStyle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 10
    },
    image: {
        alignItems:'center',
        alignSelf:'center',
        width: 320,
        height: 200,
        resizeMode: 'contain',
      },
      video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
      },
      SafeAreaViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    }
    });

export default FreelancerTab;