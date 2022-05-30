import React,{useState,useEffect,useLayoutEffect} from 'react';
import { ActivityIndicator, ScrollView, View, RefreshControl, Alert } from 'react-native';
import {ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import {useNavigation} from '@react-navigation/native';
import EditStateModal from './Modals/EditStateModal';
import AddStateModal from './Modals/AddStateModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function StatesScreen() {
    const navigation = useNavigation();
    const[isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);
    const[stateId, setStateId] = useState(0);
    const[AddModalVisible, setAddModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onlyIcon icon='plus' iconFamily='Entypo' iconColor='black' color='white'
                onPress={() => setAddModalVisible(true)}/>
            )
        });
    }, [navigation]);


    const getStates = async() => {
        try {
            setLoading(true);
            const response = await fetch('https://wedlancer.azurewebsites.net/api/States');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteState = async(stateId) => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/States/${stateId}`, {
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

    const DeleteAlert = (stateId) => {
        Alert.alert(
            'Delete State',
            'Are you sure you want to delete this state?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => deleteState(stateId)},
            ],
        );
    }

    useEffect(() => {
        getStates();
    }, []);

    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getStates();
        setRefreshing(false);
    }

    function ActivateModal(stateId) {
        setStateId(stateId);
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

    const rightswipe = (stateId,stateName) => (       
        <Button icon="pencil" iconFamily="Entypo" iconColor="white" color='dodgerblue'
        onPress={() => ActivateModal(stateId)}>
            Edit
        </Button>
    );

    const leftswipe = (stateId,stateName) => (
        <Block bottom>
        <Button icon="trash" iconFamily="Entypo" iconColor="white" color='red' onPress={() => DeleteAlert(stateId)}>
            Delete
        </Button>
        </Block>
    );

    return (
        <View>
            {AddModalVisible && <AddStateModal
            visible={AddModalVisible}
            onCancel={DeactivateAddModel}
            onSuccess={DeactivateAddModel}
            />}
            {ModalVisible && <EditStateModal
            stateId={stateId}
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
                {isLoading?<ActivityIndicator/>:(
                    data.map((l) => (
                        <ListItem.Swipeable key={l.stateId} bottomDivider topDivider
                        leftContent={() => rightswipe(l.stateId,l.stateName)}
                        rightContent={() => leftswipe(l.stateId,l.stateName)}
                        >
                            <ListItem.Content>
                                <ListItem.Title>{l.stateName}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem.Swipeable>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default StatesScreen;