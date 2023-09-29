import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MySettings from '../../../../screens/Main/Settings/MySettings';

const Stack = createStackNavigator();

export default function SettingsStack({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault();
      navigation.navigate('MySettings');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="MySettings"
    >
      <Stack.Screen name="MySettings" component={MySettings} />
    </Stack.Navigator>
  );
}
