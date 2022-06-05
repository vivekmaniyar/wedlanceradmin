import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Overlay } from '@rneui/themed';

function AddPackageModal(props) {
    const[PackageName, setPackageName] = useState(null);
    const[Price, setPrice] = useState(null);
    const[description, setDescription] = useState(null);

    const addPackage = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Packages`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    packageName: PackageName,
                    price: Price,
                    description: description
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
        overlayStyle={{height:"65%",width:"80%",borderRadius:10}}
        >
            <SafeAreaView style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <Icon name='close' type='antdesign' size={30} onPress={props.onCancel}/>
            </SafeAreaView>
            <SafeAreaView style={styles.SafeAreaViewContainer}>
                    <TextInput
                    style={styles.TextInputContainer}
                    value={PackageName}
                    placeholder={'Package Name'}
                    onChangeText={setPackageName}
                    />
                    <TextInput
                    style={styles.TextInputContainer}
                    keyboardType={'numeric'}
                    defaultValue={Price}
                    placeholder={'Price'}
                    onChangeText={setPrice}
                    />
                    <TextInput
                    style={styles.TextInputContainer}
                    value={description}
                    multiline={true}
                    placeholder={'Description'}
                    onChangeText={setDescription}
                    />
                    <SafeAreaView style={{width:'100%',flexDirection:'row',paddingTop:20,justifyContent:'space-evenly'}}>
                        <Button
                        title="Add Package"
                        color={'#b04ff9'}
                        onPress={addPackage}
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
        borderBottomWidth: 1,
        margin:10
    }

})

export default AddPackageModal;