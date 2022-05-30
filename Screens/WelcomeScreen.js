import React from 'react';
import {Block, Text} from 'galio-framework';
import {SafeAreaView} from 'react-native';

function WelcomeScreen() {
    return (    
        <Block flex safe middle center fluid>
            <Text h3 bold italic>Welcome</Text>
        </Block>
    );
}

export default WelcomeScreen;