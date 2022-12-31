import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import BackArrow from '../../../assets/images/left_arrow.svg';
import {COLORS} from '../../../constants/index';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import {WebView} from 'react-native-webview';

const NewsDetails = ({navigation, route}) => {
  const params = route.params;
  console.log(params);
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style='light' />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => navigation.goBack()}>
              <BackArrow />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Text numberOfLines={1} style={styles.title}>
                {params?.title}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.halfModal]}>
          <WebView style={styles.webview} source={{uri: params.url}} />
        </View>
      </View>
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  webview: {
    backgroundColor: COLORS.white,
    flex: 1,
    borderRadius: 40,
  },
  halfModal: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingTop: 15,
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 54,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.white,
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
});
