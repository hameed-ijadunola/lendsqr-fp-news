import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {theme} from '../../../constants';

const {COLORS, SIZES, FONTS} = theme;
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';

import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';

import AppLoading from 'expo-app-loading';
import {StatusBar} from 'expo-status-bar';

import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';

import {
  validateEmail,
  validatePassword,
} from '../../../helpers/validation/validation';
import {useFocusEffect} from '@react-navigation/native';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import GoogleSvg from '../../../assets/images/google.svg';
import crashlytics from '@react-native-firebase/crashlytics';

const SignIn = ({navigation}) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastMssg, setToastMssg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    email: null,
    password: null,
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit QC News!', 'Are you sure you want to exit?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  async function onSubmit() {
    setLoading(true);
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const {idToken} = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(user => {
        setLoading(false);
      })
      .catch(err => {
        crashlytics().recordError(err);
        toast.show('Signin failed', {
          placement: 'bottom',
          duration: 5000,
        });
        setLoading(false);
      });
  }

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{backgroundColor: COLORS.white, flex: 1}}>
      <StatusBar style='dark' />
      <View
        style={{
          position: 'absolute',
          left: 15,
          top: 60,
          zIndex: 1,
        }}>
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name='keyboard-backspace'
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: 70,
              flex: 1,
            }}>
            <Text style={styles.title}>{'Welcome\nBack'}</Text>
            <Text style={styles.desc}>
              Login in with your registered Google account
            </Text>

            <View style={styles.bottomBtn}>
              <TouchableOpacity
                style={
                  !loading
                    ? Platform.OS === 'ios'
                      ? [styles.googleBtnIos]
                      : [styles.googleBtnAndr]
                    : [styles.grayBtn]
                }
                onPress={onSubmit}>
                {!loading ? (
                  <>
                    <GoogleSvg width={25} height={25} marginRight={15} />
                    <Text style={styles.googleBtnTxt}>Sign in</Text>
                  </>
                ) : (
                  <ActivityIndicator size='small' color={COLORS.white} />
                )}
              </TouchableOpacity>

              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <Text style={styles.desc}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}>
                  <Text style={styles.linkTxt}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              <Text style={styles.desc}>Forgot password?</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SignIn;

const MyTextInput = ({
  label,
  shift,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <TextInput style={styles.textInput} {...props} />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? 'eye-off' : 'eye'}
            size={24}
            color={COLORS.eyeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontSize: 40,
  },
  bottomBtn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    bottom: 0,
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: COLORS.white,
  },
  title: {
    ...FONTS.title,
    color: COLORS.black,
    paddingTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    ...FONTS.h2,
    color: COLORS.black,
    fontStyle: 'normal',
    marginTop: 30,
    marginBottom: 16,
  },
  desc: {
    ...FONTS.h3,
    color: COLORS.gray,
    paddingVertical: 10,
  },
  linkTxt: {
    ...FONTS.h3,
    fontFamily: 'Poppins_700Bold',
    color: COLORS.gray,
    paddingVertical: 10,
  },
  backIcon: {
    marginBottom: 30,
  },
  googleBtnIos: {
    width: '100%',
    height: 48,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#dddddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginVertical: 24,
    flexDirection: 'row',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  googleBtnAndr: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginVertical: 24,
    flexDirection: 'row',
    borderColor: '#dddddd',
    shadowColor: 'rgba(0,0,0,10)',
    elevation: 3,
  },
  googleBtnTxt: {
    ...FONTS.btn,
    color: COLORS.black,
  },
  grayBtn: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.inactive_btn,
    marginVertical: 24,
    flexDirection: 'row',
  },
  btnTxt: {
    ...FONTS.btn,
    color: COLORS.white,
  },
  textInput: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    width: '100%',
    height: 48,
    backgroundColor: COLORS.placeholder_gray,
    borderColor: COLORS.placeholder_border,
    borderWidth: 1,
    borderRadius: 5,
    ...FONTS.placeholder,
  },
  placeholderTxt: {
    ...FONTS.h4,
    color: COLORS.placeholder_gray,
  },
  eyeIcon: {
    right: 16,
    position: 'absolute',
    bottom: 12,
    zIndex: 1,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 11,
  },
});
