/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import RootStack from './navigation/RootStack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { ToastProvider } from 'react-native-toast-notifications';
import { COLORS } from './constants/colors';
import { View, Text } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import remoteConfig from '@react-native-firebase/remote-config';
import { API_BASE_URL, API_KEY, API_ROUTE } from '@env';
import codePush from 'react-native-code-push';

console.log('first', { API_BASE_URL, API_KEY, API_ROUTE });

const App = () => {
  let persistor = persistStore(store);

  React.useEffect(() => {
    remoteConfig()
      .setDefaults({
        baseUrl: API_BASE_URL,
        key: API_KEY,
        route: API_ROUTE,
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then((fetchedRemotely) => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated'
          );
        }
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      });
  }, []);

  const Toast = (props) => {
    return (
      <View
        style={{
          borderRadius: props.borderRadius ? props.borderRadius : 20,
          paddingVertical: props.paddingVertical ? props.paddingVertical : 10,
          paddingHorizontal: props.paddingHorizontal
            ? props.paddingHorizontal
            : 10,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : COLORS.red_light2,
          marginTop: props.offsetTop ? props.offsetTop : 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          {props.title && (
            <Text
              style={{
                color: props.titleColor,
                fontSize: 14,
                fontFamily: 'Poppins_500Medium',
              }}
            >
              {props.title}
            </Text>
          )}
          {props.text && (
            <Text
              style={{
                color: props.textColor,
                fontSize: 14,
                fontFamily: 'Poppins_400Regular',
              }}
            >
              {props.text}
            </Text>
          )}
        </View>
        {props.action && (
          <Text
            style={{
              color: props.actionColor,
              fontSize: 14,
              fontFamily: 'Poppins_600SemiBold',
            }}
          >
            {props.action}
          </Text>
        )}
        {/* {props.message&& */}
        {props.message !== '' && (
          <Text
            style={{
              color: props.textColor ? props.textColor : COLORS.black,
              fontSize: 14,
              fontFamily: 'Poppins_400Regular',
            }}
          >
            {props.message}
          </Text>
        )}
      </View>
    );
  };
  return (
    <ToastProvider
      // placement={'top'}
      // duration={5000}
      animationType={'slide-in'}
      animationDuration={500}
      offsetTop={20}
      offsetBottom={100}
      swipeEnabled={true}
      renderToast={(toast) => <Toast {...toast} />}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <RootStack />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
};

export default codePush(App);
