import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../../../screens/Main/Home/Home';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createStackNavigator();

export default function HomeStack({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'HomeMain'}
    >
      <Stack.Screen name="HomeMain" component={Home} />
    </Stack.Navigator>
  );
}
