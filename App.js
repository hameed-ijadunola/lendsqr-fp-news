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

const App = () => {
  let persistor = persistStore(store);

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
                fontSize: 11,
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
                fontSize: 11,
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
              fontSize: 11,
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
              fontSize: 11,
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
      // placement='bottom | top'
      // duration={5000}
      // animationType='slide-in | zoom-in'
      // animationDuration={250}
      offsetTop={120} // offset for both top and bottom toasts
      offsetBottom={100} // offset for both top and bottom toasts
      // offsetTop={30}
      // offsetBottom={40}
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

export default App;