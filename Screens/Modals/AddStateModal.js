import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Overlay } from '@rneui/themed';

function AddStateModal(props) {
    const[StateName, setStateName] = useState(null);

    const addState = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/States`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    stateName: StateName
                })
            });
            if(response.status === 201) {
                props.onSuccess();
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                        title="Add State"
                        color={'#b04ff9'}
                        onPress={addState}
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

export default AddStateModal;