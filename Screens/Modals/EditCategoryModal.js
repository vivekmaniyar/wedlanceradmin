import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Overlay,Icon } from '@rneui/themed';

function EditCategoryModal(props) {
    const[CategoryName, setCategoryName] = useState(null);
    const[CategoryId, setCategoryId] = useState(0);
    const[ModalsVisible, setModalsVisible] = useState(props.visible);

    const getCategory = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Categories/${props.categoryId}`);
            const json = await response.json();
            setCategoryId(json.categoryId);
            setCategoryName(json.categoryName);
        } catch (error) {
            console.error(error);
        }
    }

    const updateCategory = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Categories/${props.categoryId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    categoryId: CategoryId,
                    categoryName: CategoryName
                })
            });
            if(response.status === 204) {
                props.onSuccess();
            }
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getCategory();
    }, []);

    return (
        <Overlay
        animationType="slide"
        onBackdropPress={props.onCancel}
        isVisible={props.visible}
        fullScreen={true}
        overlayStyle={{height:"40%",width:"80%",borderRadius:10}}
        >
            <SafeAreaView style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <Icon name='close' type='antdesign' size={30} onPress={props.onCancel}/>
            </SafeAreaView>
            <SafeAreaView style={styles.SafeAreaViewContainer}>
                    <TextInput
                    style={styles.TextInputContainer}
                    value={CategoryName}
                    placeholder={'Category Name'}
                    onChangeText={setCategoryName}
                    />
                    <SafeAreaView style={{width:'100%',flexDirection:'row',paddingTop:20,justifyContent:'space-evenly'}}>
                    <Button
                    title="Update"
                    color={'#b04ff9'}
                    onPress={updateCategory}
                    />
                    <Button
                    title="Cancel"
                    color={'#b04ff9'}
                    onPress={props.onCancel}
                    />
                    </SafeAreaView>
                    
            </SafeAreaView>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    SafeAreaViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    ViewContainer: {
        width:300,
        height:300,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'
    },
    TextInputContainer: {
        width:200,
        height:40,
        borderColor:'gray',
        borderBottomWidth:1,
        margin:10
    }

})

export default EditCategoryModal;