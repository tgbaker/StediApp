import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, TextInput, Button, Alert } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContentScrollView } from '@react-navigation/drawer';




const AppStack = createNativeStackNavigator();

const App = () =>{
  const [isFirstLaunch, setFirstLaunch] = React.useState(true);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // edit in this line
  const [homeTodayScore, setHomeTodayScore] = React.useState(0);
  const [tempCode, setTempCode] = React.useState(null);

   if (isFirstLaunch == true){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
 
);
  }else if(isLoggedIn){ //start here
    return <Navigation/>
  } else { 
    return (
      <View>
        <TextInput 
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        placeholderTextColor='#4251f5'
        placeholder='Cell Phone'>
        </TextInput>
        <Button
          title='Send'
          style={styles.button}
          onPress={async() => {
            console.log('Button was pressed')

            await fetch(
              "https://dev.stedi.me/twofactorlogin/" + phoneNumber,
              {
                method: "POST",
                headers:{
                  "content-type" : "application/text"
                }
              }
            )

          }}
          />
{/* ADDED ME */}
<TextInput 
        value={tempCode}
        onChangeText={setTempCode}
        style={styles.input2}
        placeholderTextColor='#4251f5'
        placeholder='Enter Code'>
        </TextInput>
        <Button
          title='Verify'
          style={styles.button}
          onPress={async() => {
            console.log('Button 2 was pressed')

            const loginResponse=await fetch(
              "https://dev.stedi.me/twofactorlogin",
              {
                method: "POST",
                headers:{
                  "content-type" : "application/text"
                },
                body:JSON.stringify({
                  phoneNumber,
                  oneTimePassword:tempCode
                })
              }
            )
            console.log(loginResponse.status)

            if(loginResponse.status == 200){
              const sessionToken = await loginResponse.text();
              console.log('Session Token', sessionToken)
              setIsLoggedIn(true);
            }
            else{
              Alert.alert('Warning', 'An invalid Code was entered.')
            }
          }}
          />
      </View>
    )
  } //and edit here
}
 export default App;

 
 const styles = StyleSheet.create({
  container:{
      flex:1, 
      alignItems:'center',
      justifyContent: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 250
  },
  input2: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 50
  },
  margin:{
    marginTop:100
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }    
})