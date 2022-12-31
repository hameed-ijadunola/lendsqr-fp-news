import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabStack from './BottomTabStack/BottomTabStack';
import {useSelector} from 'react-redux';
import AuthStack from '../AuthStack/AuthStack';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

export default function RootStack({navigation}) {
  const {credentials} = useSelector(state => state.userAuth);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // if (!user) {
  //   return (
  //     <View>
  //       <Text>Login</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View>
  //     <Text>Welcome {user.email}</Text>
  //   </View>
  // );
  useEffect(() => {
    console.log('credentials\n\n\n', credentials);
  }, [credentials]);

  if (initializing) return null;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {credentials || user ? (
        <Stack.Screen
          name='BottomTabStack'
          component={BottomTabStack}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
      ) : (
        <Stack.Screen
          name='AuthStack'
          component={AuthStack}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
      )}
    </Stack.Navigator>
  );
}
