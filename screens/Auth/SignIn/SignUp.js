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
import { Formik, useFormik } from 'formik';
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
import BackSvg from '../../../assets/svgs/Back.svg';

GoogleSignin.configure({
  webClientId:
    '657469516814-9o8p7uelpngkdttekvfbtm0elkae810t.apps.googleusercontent.com',
});

const SignUp = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastMssg, setToastMssg] = useState('');
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [page, setPage] = useState(1);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email address is required'),
    phone: Yup.string()
      .matches(/^\+?\d{10,14}$/, 'Invalid phone number')
      .required('Phone number is required'),
    fullName: Yup.string().required('Full name is required'),
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    isValid,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
    },
    validateOnMount: false,
    validateOnBlur: true,
    validateOnChange: validateOnChange,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const resolveValues = {
        ...values,
        email: values?.email.replace(' ', '').toLowerCase(),
      };
      onSubmitHandler(resolveValues);
    },
  });

  const checkIfEmailExists = async (email) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();

      return !snapshot.empty;
    } catch (error) {
      toast.show('Network error', {
        placement: 'top',
        duration: 5000,
      });
      return false;
    }
  };

  const saveUserToFirestore = async ({ user, data }) => {
    try {
      const userRef = firestore().collection('users').doc(user.uid);
      const userData = {
        fullName: data?.fullName,
        email: data?.email,
        phoneNumber: data?.phone,
        photoURL: user?.photoURL,
        additionalInfo: JSON.stringify(user),
      };

      // Set user data in Firestore
      await userRef.set(userData);

      // Retrieve the newly created user data from Firestore
      const newUserSnapshot = await userRef.get();
      const newUser = newUserSnapshot.data();

      return newUser;
    } catch (error) {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (val) => {
    try {
      if (page === 1) {
        setLoading(true);
        const emailExists = await checkIfEmailExists(val?.email);
        if (emailExists) {
          toast.show(
            'This email is already registered, Please proceed to\n sign in instead',
            {
              placement: 'top',
              duration: 4000,
            }
          );
          setLoading(false);
          return;
        }
        GoogleSignin.signOut();
        setPage(2);
        setLoading(false);
      } else if (page === 2) {
        onGoogleButtonPress(val);
      }
    } catch (error) {
      crashlytics().recordError(error);
      toast.show('Sign up failed', {
        placement: 'top',
        duration: 5000,
      });
      setLoading(false);
      return false;
    }
  };

  const onGoogleButtonPress = async (data) => {
    setLoading(true);
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken, user } = await GoogleSignin.signIn();
      if (user.email !== data?.email) {
        setLoading(false);
        toast.show(
          'You must sign up with the email provided\non the form or change it',
          {
            placement: 'top',
            duration: 5000,
          }
        );
        return;
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user_sign_in = auth().signInWithCredential(googleCredential);
      user_sign_in
        .then(async (user) => {
          const newUser = await saveUserToFirestore({ user: user?.user, data });
          if (!newUser) {
            setLoading(false);
            toast.show('Sign up failed unexpectedly', {
              placement: 'top',
              duration: 5000,
            });
            return;
          }
          setLoading(false);
          dispatch(saveUser(newUser));
          dispatch(saveToken(googleCredential.token));
          toast.show('Signed up successfully', {
            placement: 'top',
            duration: 5000,
            backgroundColor: COLORS.green,
          });
        })
        .catch((err) => {
          setLoading(false);
          dispatch(saveUser(null));
          dispatch(saveToken(null));
          GoogleSignin.revokeAccess();
          crashlytics().recordError(err);
          toast.show('Sign up failed', {
            placement: 'top',
            duration: 5000,
          });
        });
    } catch (error) {
      toast.show(
        (error?.message !== 'Sign in action cancelled'
          ? error?.message
          : 'Sign up cancelled') || 'Sign up failed',
        {
          placement: 'top',
          duration: 5000,
        }
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrap
      style={{
        paddingTop: page == 1 ? 36 : 16,
        paddingBottom: 66,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
      }}
    >
      {page === 2 && (
        <Row>
          <Pressable
            style={{
              alignItems: 'center',
              padding: 15,
              paddingLeft: 0,
            }}
            onPress={() => setPage(1)}
          >
            <BackSvg />
          </Pressable>
        </Row>
      )}
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps={'handled'}
      >
        <Row marginBottom={13}>
          <CustomText
            color={COLORS.primarytext}
            align="flex-start"
            fontSize={32}
            fontFamily={fonts.EuclidMedium}
          >
            {'Create\nAccount,'}
          </CustomText>
        </Row>
        <Row marginBottom={35}>
          <CustomText
            color={COLORS.primarytext}
            align="flex-start"
            fontSize={14}
            fontFamily={fonts.EuclidRegular}
          >
            {page === 1 ? 'Enter your details' : 'Complete Sign up with Google'}
          </CustomText>
        </Row>

        {page === 1 && (
          <Col marginTop={10}>
            <TextInput
              label={'Full Name'}
              placeholder="John Doe"
              handleChange={handleChange('fullName')}
              value={values.fullName}
              errors={errors?.fullName}
            />

            <TextInput
              label={'Email Address'}
              placeholder="example@gmail.com"
              handleChange={handleChange('email')}
              value={values.email}
              errors={errors?.email}
              marginTop={18}
            />
            <TextInput
              label={'Phone Number'}
              placeholder="0800 000 0000"
              handleChange={handleChange('phone')}
              value={values.phone}
              errors={errors?.phone}
              marginTop={18}
            />
          </Col>
        )}

        <View style={styles.bottomBtn}>
          {page == 1 ? (
            <Button
              text="Continue"
              top={16}
              onPress={() => {
                setValidateOnChange(true);
                handleSubmit();
              }}
              disabled={!isValid}
              loading={loading}
            />
          ) : (
            <Button
              style={
                !loading
                  ? Platform.OS === 'ios'
                    ? [styles.googleBtnIos]
                    : [styles.googleBtnAndr]
                  : [styles.grayBtn]
              }
              onPress={() => {
                handleSubmit();
              }}
            >
              {!loading ? (
                <>
                  <GoogleSvg width={25} height={25} marginRight={15} />
                  <Text style={styles.googleBtnTxt}>Complete Sign up</Text>
                </>
              ) : (
                <ActivityIndicator size="small" color={COLORS.white} />
              )}
            </Button>
          )}
          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <CustomText
              color={COLORS.primarytext}
              align="flex-start"
              fontSize={14}
              fontFamily={fonts.EuclidRegular}
            >
              Have a registered account?
            </CustomText>
            <Pressable
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            >
              <CustomText
                color={COLORS.primarytext}
                align="flex-start"
                fontSize={14}
                fontFamily={fonts.EuclidRegular}
              >
                {` Sign in`}
              </CustomText>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaWrap>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  bottomBtn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    top: 0,
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
