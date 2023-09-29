import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet } from 'react-native';

import fonts from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';
import HomeStack from './HomeStack/HomeStack';
import SettingsStack from './SettingsStack/SettingsStack';
import HomeSvg from '../../../assets/svgs/home3.svg';
import Home4Svg from '../../../assets/svgs/home4.svg';
import PersonalSvg from '../../../assets/svgs/personal3.svg';
import Personal4Svg from '../../../assets/svgs/personal4.svg';

const Tab = createBottomTabNavigator();

export default function BottomTabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [styles.tabBar, { height: 72 }],
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.black,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="News"
    >
      <Tab.Screen
        name="News"
        component={HomeStack}
        options={({ route }) => ({
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIconStyle: styles.iconStyleBottomBar,
          tabBarIcon: ({ focused }) => (focused ? <Home4Svg /> : <HomeSvg />),
        })}
      />

      <Tab.Screen
        name="Profile"
        component={SettingsStack}
        options={({ route }) => ({
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIconStyle: styles.iconStyleBottomBar,
          tabBarIcon: ({ focused }) =>
            focused ? <Personal4Svg /> : <PersonalSvg />,
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  iconStyleBottomBar: {
    marginVertical: 15,
  },
  textStyleBottomBar: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: fonts.EuclidRegular,
    marginBottom: 10,
  },
});
