import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        >
            <SafeAreaView style={styles.SafeAreaViewContainer}>
                <View style={styles.ViewContainer}>
                    <TextInput
                    style={styles.TextInputContainer}
                    value={StateName}
                    placeholder={'State Name'}
                    onChangeText={setStateName}
                    />
                    <Button
                    title="Save"
                    onPress={addState}
                    />
                    <Button
                    title="Cancel"
                    onPress={props.onCancel}
                    />
                </View>
            </SafeAreaView>
        </Modal>
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
        borderWidth:1,
        margin:10
    }

})

export default AddStateModal;