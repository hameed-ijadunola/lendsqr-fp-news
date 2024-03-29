import {
  View,
  BackHandler,
  Alert,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LoadingScreen from '../../../components/LoadingScreen';
import { COLORS } from '../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaWrap from '../../../components/SafeAreaWrap/SafeAreaWrap';
import { Formik } from 'formik';
import Button from '../../../components/Button/Button';
import CustomText from '../../../components/CustomText/CustomText';
import * as Yup from 'yup';
import fonts from '../../../constants/fonts';
import TextInput from '../../../components/Input/TextInput';
import { Col, Row } from '../../../components/CustomGrid/CustomGrid';
import { useLoginMutation } from '../../../redux/features/auth/authApi';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GoogleSvg from '../../../assets/svgs/google.svg';
import crashlytics from '@react-native-firebase/crashlytics';
import { saveToken, saveUser } from '../../../redux/features/auth/authSlice';
import firestore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';

GoogleSignin.configure({
  webClientId:
    '657469516814-9o8p7uelpngkdttekvfbtm0elkae810t.apps.googleusercontent.com',
});

const SignIn = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit FP News!', 'Are you sure you want to exit?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  useEffect(() => {
    (async function () {
      try {
        setLoading(false);
        await GoogleSignin.revokeAccess();
      } catch (error) {
        console.log('error', error);
      }
    })();
  }, []);

  const checkIfEmailExists = async (email) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
      if (!snapshot.empty) {
        return { exists: true, document: snapshot.docs[0].data() };
      } else {
        return { exists: false, document: null };
      }
    } catch (error) {
      toast.show('Network error', {
        placement: 'top',
        duration: 5000,
      });
      return false;
    }
  };

  async function onSubmit() {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const authInfo = await GoogleSignin.signIn();
      const { idToken } = authInfo;
      const emailExists = await checkIfEmailExists(authInfo?.user?.email);
      if (emailExists.exists) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const user_sign_in = auth().signInWithCredential(googleCredential);
        user_sign_in
          .then(async (user) => {
            setLoading(false);
            dispatch(saveUser(emailExists?.document));
            dispatch(saveToken(googleCredential.token));
            await analytics().logEvent('app_signed_in', {
              timeStamp: new Date().toISOString(),
            });
            toast.show('Signed in successfully', {
              placement: 'bottom',
              duration: 5000,
              backgroundColor: COLORS.green,
            });
          })
          .catch(async (err) => {
            setLoading(false);
            dispatch(saveUser(null));
            dispatch(saveToken(null));
            GoogleSignin.revokeAccess();
            crashlytics().recordError(err);
            await analytics().logEvent('app_sign_in_failed', {
              timeStamp: new Date().toISOString(),
            });
            toast.show('Signin failed', {
              placement: 'bottom',
              duration: 5000,
            });
          });
      } else {
        toast.show(
          'This email is not registered, Please proceed to\n sign up instead',
          {
            placement: 'top',
            duration: 4000,
          }
        );
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
    }
  }
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={'handled'}
    >
      <SafeAreaWrap
        style={{
          paddingTop: 36,
          paddingBottom: 66,
          paddingHorizontal: 24,
          justifyContent: 'space-between',
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Row marginBottom={13}>
            <CustomText
              color={COLORS.primarytext}
              align="flex-start"
              fontSize={32}
              fontFamily={fonts.EuclidMedium}
            >
              {'Welcome\nback,'}
            </CustomText>
          </Row>
          <Row marginBottom={35}>
            <CustomText
              color={COLORS.primarytext}
              align="flex-start"
              fontSize={14}
              fontFamily={fonts.EuclidRegular}
            >
              Sign in to continue
            </CustomText>
          </Row>

          <View style={styles.bottomBtn}>
            <Button
              style={
                !loading
                  ? Platform.OS === 'ios'
                    ? [styles.googleBtnIos]
                    : [styles.googleBtnAndr]
                  : [styles.grayBtn]
              }
              onPress={onSubmit}
            >
              {!loading ? (
                <>
                  <GoogleSvg width={25} height={25} marginRight={15} />
                  <Text style={styles.googleBtnTxt}>Sign in with Google</Text>
                </>
              ) : (
                <ActivityIndicator size="small" color={COLORS.white} />
              )}
            </Button>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <CustomText
                color={COLORS.primarytext}
                align="flex-start"
                fontSize={14}
                fontFamily={fonts.EuclidRegular}
              >
                Don't have an account?
              </CustomText>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignUp');
                }}
              >
                <CustomText
                  color={COLORS.primarytext}
                  align="flex-start"
                  fontSize={14}
                  fontFamily={fonts.EuclidRegular}
                >
                  {` Sign up`}
                </CustomText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaWrap>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
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

  title: {
    color: COLORS.black,
    paddingTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.black,
    fontStyle: 'normal',
    marginTop: 30,
    marginBottom: 16,
  },
  desc: {
    color: COLORS.gray,
    paddingVertical: 10,
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
    shadowOffset: { width: -2, height: 4 },
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
    color: COLORS.black,
  },
  grayBtn: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
    marginVertical: 24,
    flexDirection: 'row',
  },
  btnTxt: {
    color: COLORS.white,
  },
});
