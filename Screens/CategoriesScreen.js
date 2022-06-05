import React, {useEffect, useState, useLayoutEffect} from 'react';
import { RefreshControl, ActivityIndicator, View, StyleSheet, ScrollView, Modal, TextInput, Alert,SafeAreaView} from 'react-native';
import {ListItem} from "@rneui/themed";
import { Block, Text, Button, Icon} from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import EditCategoryModal from './Modals/EditCategoryModal';
import AddCategoryModal from './Modals/AddCategoryModal';

const wait = (timeout) => {
    return new Promise(resolve => { setTimeout(resolve, timeout) });
}


function CategoriesScreen() {
    const navigation = useNavigation();
    const[isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[ModalVisible, setModalVisible] = useState(false);
    const[categoryId, setCategoryId] = useState(0);
    const[AddModalVisible, setAddModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onlyIcon icon='plus' iconFamily='Entypo' iconColor='black' color='white'
                onPress={() => setAddModalVisible(true)}/>
            )
        });
    }, [navigation]);

    const getCategories = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/Categories');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteCategory = async(categoryId) => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Categories/${categoryId}`, {
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

    const DeleteAlert = (categoryId) => {
        Alert.alert(
            'Delete Category',
            'Are you sure you want to delete this category?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => deleteCategory(categoryId)},
            ],
            {cancelable: false},
        );
    }



    const onRefresh = async() => {
        setLoading(true);
        await wait(2000);
        getCategories();
        setRefreshing(false);
    }

    useEffect(() => {
        getCategories();
    }, []);

    function ActivateModal(CategoryId) {
        setCategoryId(CategoryId);
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

    const rightswipe = (categoryId,categoryName) => (
        <SafeAreaView style={{backgroundColor:'dodgerblue',alignSelf:'flex-end',height:'100%',justifyContent:'center'}}>
            <Button icon="pencil" iconFamily="Entypo" iconColor="white" color='dodgerblue' 
            onPress={() => ActivateModal(categoryId)}>
                Edit
            </Button>
        </SafeAreaView>
    );

    const leftswipe = (categoryId,categoryName) => (
        <SafeAreaView style={{alignItems:'flex-end',backgroundColor:'red',alignSelf:'flex-end',height:'100%',justifyContent:'center'}}>
        <Button icon="trash" iconFamily="Entypo" iconColor="white" color='red' onPress={() => DeleteAlert(categoryId)}>
            Delete
        </Button>
        </SafeAreaView>
    );


    return (
        <View>
            {AddModalVisible && <AddCategoryModal
            visible={AddModalVisible}
            onCancel={DeactivateAddModel}
            onSuccess={DeactivateAddModel}
            />}
            {ModalVisible && <EditCategoryModal 
            categoryId={categoryId} 
            visible={ModalVisible}
            onSuccess={DeactivateModal}
            onCancel={DeactivateModal}/>}
                <ScrollView
                refreshControl={
                    <RefreshControl
                    
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }>          
                        {isLoading?<ActivityIndicator size={30} color={"#b04ff9"}/>:(
                            data.map((l) => (
                                <ListItem.Swipeable key={l.categoryId} bottomDivider topDivider
                                leftContent={() => rightswipe(l.categoryId,l.categoryName)}
                                rightContent={() => leftswipe(l.categoryId,l.categoryName)}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title>{l.categoryName}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem.Swipeable>
                            ))
                        )}
                </ScrollView>
            </View>
    );
}



export default CategoriesScreen;