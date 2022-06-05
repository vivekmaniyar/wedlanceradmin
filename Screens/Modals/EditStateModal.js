import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Overlay } from '@rneui/themed';

function EditStateModal(props) {
    const[StateName, setStateName] = useState(null);
    const[StateId, setStateId] = useState(0);
    const[ModalsVisible, setModalsVisible] = useState(props.visible);

    const getState = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/States/${props.stateId}`);
            const json = await response.json();
            setStateId(json.stateId);
            setStateName(json.stateName);
        } catch (error) {
            console.error(error);
        }
    }

    const updateState = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/States/${props.stateId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    stateId: StateId,
                    stateName: StateName
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
        getState();
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
                    value={StateName}
                    placeholder={'State Name'}
                    onChangeText={setStateName}
                    />
                    <SafeAreaView style={{width:'100%',flexDirection:'row',paddingTop:20,justifyContent:'space-evenly'}}>
                        <Button
                        title="Update"
                        color={'#b04ff9'}
                        onPress={updateState}
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

export default EditStateModal;