import React,{useState,useEffect,useLayoutEffect} from 'react';
import { ActivityIndicator, ScrollView, View, RefreshControl, Alert,SafeAreaView } from 'react-native';
import {ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import EditCityModal from './Modals/EditCityModal';
import {useNavigation} from '@react-navigation/native';
import AddCityModal from './Modals/AddCityModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function CitiesScreen() {
    const[isLoading, setLoading] = useState(true);
    const[refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);
    const[cityId, setCityId] = useState(0);
    const[ModalVisible, setModalVisible] = useState(false);
    const[AddModalVisible, setAddModalVisible] = useState(false);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onlyIcon icon='plus' iconFamily='Entypo' iconColor='black' color='white'
                onPress={() => setAddModalVisible(true)}/>
            )
        });
    }, [navigation]);

    const getCities = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Cities');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteCity = async(cityId) => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Cities/${cityId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                }
            });
            if(response.status === 200) {
                onRefresh();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const DeleteAlert = (cityId) => {
        Alert.alert(
            'Delete City',
            'Are you sure you want to delete this city?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => deleteCity(cityId)}
            ],
            { cancelable: false }
        );
    }

    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getCities();
        setRefreshing(false);
    }

    useEffect(() => {
        getCities();
    }, []);

    function ActivateModal(CityId) {
        setCityId(CityId);
        setModalVisible(true);
    }

    function DeactivateModal() {
        setModalVisible(false);
        onRefresh();
    }

    function DeactivateAddModel(){
        setAddModalVisible(false);
        onRefresh();
    }

    const rightswipe = (cityId,cityName) => ( 
        <SafeAreaView style={{backgroundColor:'dodgerblue',alignSelf:'flex-end',height:'100%',justifyContent:'center'}}>      
            <Button icon="pencil" iconFamily="Entypo" iconColor="white" color='dodgerblue' onPress={() => ActivateModal(cityId)}>
                Edit
            </Button>
        </SafeAreaView>
    );

    const leftswipe = (cityId,cityName) => (
        <SafeAreaView style={{alignItems:'flex-end',backgroundColor:'red',alignSelf:'flex-end',height:'100%',justifyContent:'center'}}>
        <Button icon="trash" iconFamily="Entypo" iconColor="white" color='red' onPress={() => DeleteAlert(cityId)}>
            Delete
        </Button>
        </SafeAreaView>
    );

    return (
        <View>
            {AddModalVisible && <AddCityModal
            visible={AddModalVisible}
            onCancel={DeactivateAddModel}
            onSuccess={DeactivateAddModel}
            />}
            {ModalVisible && <EditCityModal
            cityId={cityId}
            visible={ModalVisible}
            onSuccess={DeactivateModal}
            onCancel={DeactivateModal}
            />}
            <ScrollView
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }>          
                {isLoading?<ActivityIndicator size={30} color={"#b04ff9"}/>:(
                    data.map((l) => (
                        <ListItem.Swipeable key={l.cityId} bottomDivider topDivider
                        leftContent={() => rightswipe(l.cityId,l.cityName)}
                        rightContent={() => leftswipe(l.cityId,l.cityName)}
                        >
                            <ListItem.Content>
                                <ListItem.Title>{l.cityName}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem.Swipeable>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default CitiesScreen;