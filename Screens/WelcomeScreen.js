import React,{useState,useEffect} from 'react';
import {Block, Text} from 'galio-framework';
import {SafeAreaView,StatusBar,View,ScrollView,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WelcomeScreen() {
    const [username, setUsername] = useState('');
    const[freelancers, setFreelancers] = useState([]);
    const[employers, setEmployers] = useState([]);
    const[bookings, setBookings] = useState([]);
    const[revenue, setRevenue] = useState(0);

    const getbookings = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Bookings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
                    }
                    });
            const json = await response.json();
            setBookings(json);
        } catch (error) {
            console.error(error);
        }
    }

    const getorders = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
                    }
                    });
            const json = await response.json();
            let money = 0;
            json.forEach(element => {
                money += element.amount;
            });
            setRevenue(money);
        } catch (error) {
            console.error(error);
        }
    }

    const getfreelancers = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Profiles/freelancers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
                    }
                    });
            const json = await response.json();
            setFreelancers(json);
        } catch (error) {
            console.error(error);
        }
    }

    const getemployers = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Profiles/employers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
                    }
                    });
            const json = await response.json();
            setEmployers(json);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        AsyncStorage.getItem('username').then(value => {
            setUsername(value);
        });
        getbookings();
        getorders();
        getfreelancers();
        getemployers();
    }, []);

    return (    
        <ScrollView style={{marginTop: 20}}>
            <Text style={styles.title}>Welcome, {username}</Text>
            <View style={styles.box}>
                <Text h6>Total Freelancers</Text>
                <Text>{freelancers.length}</Text>
            </View>
            <View style={styles.box}>
                <Text h6>Total employers</Text>
                <Text>{employers.length}</Text>
            </View>
            <View style={styles.box}>
                <Text h6>Total bookings</Text>
                <Text>{bookings.length}</Text>
            </View>
            <View style={styles.box}>
                <Text h6>Total Revenue</Text>
                <Text>₹{revenue}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        alignSelf:'center',
        fontSize:30,
        fontFamily:'sans-serif-light',
        fontWeight:'700'
    },
    box:{
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30,
        width: '70%',
        marginTop: 20
    }
})

export default WelcomeScreen;