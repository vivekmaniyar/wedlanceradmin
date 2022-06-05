import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon, Overlay } from '@rneui/themed';

function EditCityModal(props) {

    const[states, setStates] = useState([]);
    const[CityName, setCityName] = useState(null);
    const[CityId, setCityId] = useState(0);
    const[stateId, setStateId] = useState(0);

    const getStates = async() => {
        try {
            const response = await fetch('https://wedlancer.azurewebsites.net/api/States');
            const json = await response.json();
            setStates(json);
        } catch (error) {
            console.error(error);
        }
    }

    const getCity = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Cities/${props.cityId}`);
            const json = await response.json();
            setCityId(json.cityId);
            setCityName(json.cityName);
            setStateId(json.stateId);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getStates();
        getCity();
    }, []);

    const updateCity = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Cities/${props.cityId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    cityId: CityId,
                    cityName: CityName,
                    stateId: stateId
                })
            });
            if(response.status === 204) {
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
        overlayStyle={{height:"50%",width:"80%",borderRadius:10}}
        >
            <SafeAreaView style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <Icon name='close' type='antdesign' size={30} onPress={props.onCancel}/>
            </SafeAreaView>
            <SafeAreaView style={styles.SafeAreaViewContainer}>
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
                    value={stateId}
                    placeholder={'Select State'}
                    placeholderStyle={styles.placeholderStyle}
                    onChange={(item) => {
                        console.log(item.stateId);
                        setStateId(item.stateId);
                    }}
                    />
                    <SafeAreaView style={{width:'100%',flexDirection:'row',paddingTop:20,justifyContent:'space-evenly'}}>
                        <Button
                        title="Update"
                        color={'#b04ff9'}
                        onPress={updateCity}
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

export default EditCityModal;