import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../Screens/Auth/OnboardingScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import VerifyScreen from '../Screens/Auth/VerifyScreen';
import ResetPasswordScreen from '../Screens/Auth/ResetPasswordScreen';
import AddPhoneScreen from '../Screens/Auth/AddPhoneScreen';
import TicketSaleScreen from '../Screens/Main/Stacks/TicketSaleScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

const AuthNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  console.log('isFirstLaunch:', isFirstLaunch);
  

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLauched = await AsyncStorage.getItem('hasLauched')
        console.log('hasLauched:', hasLauched);

        if (hasLauched == null) {
          AsyncStorage.setItem('hasLauched', 'true')
          setIsFirstLaunch(true)
        } else {
          setIsFirstLaunch(false)
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkFirstLaunch()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ?
        <Stack.Screen name="Onboarding" >
          {props => <OnboardingScreen {...props} setIsFirstLaunch={setIsFirstLaunch} />}
        </Stack.Screen> :
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="AddPhone" component={AddPhoneScreen} />
        </>
      }
    </Stack.Navigator>
  );
};

export default AuthNavigation;

const styles = StyleSheet.create({});
