import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert,SafeAreaView} from 'react-native';
import {ListItem} from "@rneui/themed";
import { Block, Text, Icon,Button} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import AddPackageModal from './Modals/AddPackageModal';
import EditPackageModal from './Modals/EditPackageModal';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}

function PackageScreen(props) {
    const navigation = useNavigation();
    const[isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);
    const[packageId, setPackageId] = useState(0);
    const[AddModalVisible, setAddModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onlyIcon icon='plus' iconFamily='Entypo' iconColor='black' color='white'
                onPress={() => setAddModalVisible(true)}/>
            )
        });
    }, [navigation]);

    const getPackages = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Packages');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPackages();
    }, []);

    const deletePackage = async(packageId) => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Packages/${packageId}`, {
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

    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getPackages();
        setRefreshing(false);
    }

    const DeleteAlert = (packageId) => {
        Alert.alert(
            'Delete Package',
            'Are you sure you want to delete this package?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => deletePackage(packageId)},
            ],
            {cancelable: false},
        );
    }

    function ActivateModal(packageId) {
        setPackageId(packageId);
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

    const leftswipe = (packageId) => (
        <SafeAreaView style={{alignItems:'flex-end',backgroundColor:'red',alignSelf:'flex-end',height:'100%',justifyContent:'center'}}>
        <Button style={{borderColor:'red'}} icon="trash" iconFamily="Entypo" iconColor="white" color='red' onPress={() => DeleteAlert(packageId)}>
            Delete
        </Button>
        </SafeAreaView>
    );

    const rightswipe = (packageId,packageName) => (
        <SafeAreaView style={{backgroundColor:'dodgerblue',alignSelf:'flex-end',height:'100%',justifyContent:'center'}}>
            <Button icon="pencil" iconFamily="Entypo" iconColor="white" color='dodgerblue' 
            onPress={() => ActivateModal(packageId)}>
                Edit
            </Button>
        </SafeAreaView>
    );

    return (
        <View>
            {AddModalVisible && <AddPackageModal
                visible={AddModalVisible}
                onCancel={DeactivateAddModel}
                onSuccess={DeactivateAddModel}
            />}
            {ModalVisible && <EditPackageModal
                visible={ModalVisible}
                onCancel={DeactivateModal}
                onSuccess={DeactivateModal}
                packageId={packageId}
            />}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {isLoading?<ActivityIndicator size={30} color={"#b04ff9"}/>:(
                    data.map((l) => (
                        <ListItem.Swipeable
                            key={l.packageId}
                            bottomDivider
                            topDivider
                            leftContent={() => rightswipe(l.packageId,l.packageName)}
                            rightContent={() => leftswipe(l.packageId)}
                        >
                            <ListItem.Content>
                                <ListItem.Title>{l.packageName}</ListItem.Title>
                                <ListItem.Subtitle>Price: ₹{l.price}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem.Swipeable>
                    ))
                    )}
            </ScrollView>
        </View>
    );
}



export default PackageScreen;