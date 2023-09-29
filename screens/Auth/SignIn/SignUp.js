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
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^\+?\d{10,14}$/, 'Invalid phone number')
      .required('Phone number is required'),
    fullName: Yup.string().required('First Name is required'),
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
    onSubmit: (values) => onSubmit(values),
  });

  const onSubmit = async () => {
    try {
      if (page === 1) {
        setLoading(true);

        GoogleSignin.signOut();
        setPage(2);
        setLoading(false);
      } else if (page === 2) {
        onGoogleButtonPress();
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

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn();
      console.log('idToken', idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);
      const user_sign_in = auth().signInWithCredential(googleCredential);
      user_sign_in
        .then((user) => {
          console.log('user', user);
          setLoading(false);
          dispatch(saveUser(user));
          dispatch(saveToken(googleCredential.token));
          toast.show('Signed up successfully', {
            placement: 'bottom',
            duration: 5000,
            backgroundColor: COLORS.green,
          });
        })
        .catch((err) => {
          console.log('err\n\n', err);
          setLoading(false);
          dispatch(saveUser(null));
          dispatch(saveToken(null));
          GoogleSignin.revokeAccess();
          crashlytics().recordError(err);
          toast.show('Sign up failed', {
            placement: 'bottom',
            duration: 5000,
          });
        });
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };

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
              {page === 1
                ? 'Enter your details'
                : 'Complete Sign up with Google'}
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
                onPress={onSubmit}
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
        </ScrollView>
      </SafeAreaWrap>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

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
