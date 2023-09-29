import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabStack from './BottomTabStack/BottomTabStack';
import NewsPage from '../../screens/Main/Home/NewsPage';

const Stack = createStackNavigator();

export default function MainStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabStack"
      listeners={({ navigation }) => ({
        blur: () => navigation.setParams({ screen: undefined }),
      })}
    >
      <Stack.Screen
        name="BottomTabStack"
        component={BottomTabStack}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="NewsPage"
        component={NewsPage}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
    </Stack.Navigator>
  );
}
