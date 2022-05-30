import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';

function AddCityModal(props) {
    const[states, setStates] = useState([]);
    const[CityName, setCityName] = useState(null);
    const[StateId, setStateId] = useState(0);

    const getStates = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/States');
            const json = await response.json();
            setStates(json);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getStates();
    }, []);

    const addCity = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Cities`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    cityName: CityName,
                    stateId: StateId
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
                    value={CityName}
                    placeholder={'City Name'}
                    onChangeText={setCityName}
                    />
                    <Dropdown
                    style={styles.dropdown}
                    maxHeight={300}
                    data={states}
                    labelField="stateName"
                    valueField="stateId"
                    value={StateId}
                    placeholder={'Select State'}
                    placeholderStyle={styles.placeholderStyle}
                    onChange={(item) => {
                        console.log(item.stateId);
                        setStateId(item.stateId);
                    }}
                    />
                    <Button
                    title="Save"
                    onPress={addCity}
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
    },
    placeholderStyle: {
        fontSize: 16,
    },
    dropdown: {
        width:200,
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      }

})

export default AddCityModal;