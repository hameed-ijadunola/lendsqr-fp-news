import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  BackHandler,
  ToastAndroid,
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
  validateName,
  validatePhoneNumber,
} from '../../../helpers/validation/validation';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import GoogleSvg from '../../../assets/images/google.svg';
import crashlytics from '@react-native-firebase/crashlytics';

const SignUp = ({navigation}) => {
  const window = useWindowDimensions();
  // const screenWidth = window.width;
  const toast = useToast();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: '',
    email: '',
    phonenumber: '',
  });
  const [error, setError] = useState({
    name: null,
    email: null,
    phonenumber: null,
  });

  ///handle back action

  const onSubmit = async () => {
    try {
      if (page === 1) {
        setLoading(true);

        const nameError = validateName(state.name);
        const emailError = validateEmail(state.email);
        const phoneNumberError = validatePhoneNumber(state.phonenumber);
        if (emailError || nameError || phoneNumberError) {
          setError({
            ...error,
            name: nameError,
            email: emailError,
            phonenumber: phoneNumberError,
          });
          toast.show('Enter correct details', {
            placement: 'bottom',
            duration: 5000,
          });
          setLoading(false);
          return;
        } else {
          setError({
            ...error,
            name: null,
            email: null,
            phonenumber: null,
          });
          setPage(2);
          setLoading(false);
        }
      } else if (page === 2) {
        onGoogleButtonPress();
      }
    } catch (error) {
      crashlytics().recordError(error);
      toast.show('Sign up failed', {
        placement: 'bottom',
        duration: 5000,
      });
      setLoading(false);
      return false;
    }
  };

  const onGoogleButtonPress = async () => {
    setLoading(true);
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(user => {
        setLoading(false);
      })
      .catch(err => {
        crashlytics().recordError(err);
        setLoading(false);
      });
    return auth().signInWithCredential(googleCredential);
  };

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
          onPress={() => {
            page === 1 ? navigation.goBack() : setPage(1);
          }}>
          <MaterialCommunityIcons
            name='keyboard-backspace'
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.safeArea, {marginTop: 60}]}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{'Create\nAccount'}</Text>
          {page === 1 ? (
            <Text style={styles.desc}>
              Enter your personal details and continue.
            </Text>
          ) : (
            <Text style={styles.desc}>Complete Sign up with Google</Text>
          )}

          {page === 1 && (
            <KeyboardAvoidingWrapper>
              <View>
                <MyTextInput
                  label='Name'
                  placeholder='Name'
                  placeholderTextColor={COLORS.placeholderTxt}
                  onChangeText={text => setState({...state, name: text})}
                  value={state.name}
                />
                {error.name !== null && (
                  <Text style={styles.errorText}>{error.name}</Text>
                )}

                <MyTextInput
                  label='Email'
                  placeholder='Enter email'
                  placeholderTextColor={COLORS.placeholderTxt}
                  onChangeText={text => setState({...state, email: text})}
                  value={state.email}
                />
                {error.email !== null && (
                  <Text style={styles.errorText}>{error.email}</Text>
                )}
                <MyTextInput
                  label='Phone number'
                  placeholder='Enter phone number'
                  placeholderTextColor={COLORS.placeholderTxt}
                  onChangeText={text => setState({...state, phonenumber: text})}
                  value={state.phonenumber}
                />
                {error.phonenumber !== null && (
                  <Text style={styles.errorText}>{error.phonenumber}</Text>
                )}
              </View>
            </KeyboardAvoidingWrapper>
          )}
          <View style={styles.bottomBtn}>
            <TouchableOpacity
              style={
                !loading
                  ? page === 1
                    ? [styles.redBtn]
                    : Platform.OS === 'ios'
                    ? [styles.googleBtnIos]
                    : [styles.googleBtnAndr]
                  : [styles.grayBtn]
              }
              onPress={onSubmit}>
              {!loading ? (
                <>
                  {page === 2 && (
                    <GoogleSvg width={25} height={25} marginRight={15} />
                  )}
                  <Text
                    style={page === 1 ? styles.btnTxt : styles.googleBtnTxt}>
                    {page === 1 ? 'Continue' : 'Complete Sign up'}
                  </Text>
                </>
              ) : (
                <ActivityIndicator size='small' color={COLORS.white} />
              )}
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
              }}>
              <Text style={styles.desc}>Account registered? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignIn');
                }}>
                <Text style={styles.linkTxt}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SignUp;

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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bottomBtn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    bottom: 0,
    flexGrow: 1,
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
  redBtn: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    marginVertical: 24,
    flexDirection: 'row',
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
  googleBtnTxt: {
    ...FONTS.btn,
    color: COLORS.black,
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
