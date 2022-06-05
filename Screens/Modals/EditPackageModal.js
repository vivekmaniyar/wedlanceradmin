import React,{useState,useEffect} from 'react';
import {SafeAreaView,Modal, TextInput,Button,ActivityIndicator,StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Overlay } from '@rneui/themed';

function EditPackageModal(props) {
    const[PackageName, setPackageName] = useState(null);
    const[PackageId, setPackageId] = useState(0);
    const[description, setDescription] = useState(null);
    const[Price, setPrice] = useState(null);
    const[ModalsVisible, setModalsVisible] = useState(props.visible);

    const getPackage = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Packages/${props.packageId}`);
            const json = await response.json();
            setPackageId(json.packageId);
            setPackageName(json.packageName);
            setDescription(json.description);
            setPrice(json.price.toString());
        } catch (error) {
            console.error(error);
        }
    }

    const updatePackage = async() => {
        try {
            const response = await fetch(`https://wedlancer.azurewebsites.net/api/Packages/${props.packageId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    packageId: PackageId,
                    packageName: PackageName,
                    price: Price,
                    description: description
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
        getPackage();
    }, []);

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
                    value={Price}
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
                        title="Update"
                        color={'#b04ff9'}
                        onPress={updatePackage}
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

export default EditPackageModal;