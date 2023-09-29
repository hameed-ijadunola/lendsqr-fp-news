import {
  View,
  BackHandler,
  Alert,
  Text,
  useWindowDimensions,
  FlatList,
  Image,
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
import {
  Col,
  PressableCol,
  Row,
} from '../../../components/CustomGrid/CustomGrid';
import { logout, saveToken } from '../../../redux/features/auth/authSlice';
import AccountPng from '../../../assets/svgs/account-circle.png';
import RightSvg from '../../../assets/svgs/arrow-right2.svg';
import PersonalSvg from '../../../assets/svgs/personal.svg';
import LogoutSvg from '../../../assets/svgs/logout.svg';
import { capitalize } from '../../../helpers/formatText';

const MySettings = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const { user } = useSelector((state) => state.userAuth);
  console.log('user', user?.user);
  const dispatch = useDispatch();

  const Logout = ({ item }) => (
    <Pressable
      style={{
        borderWidth: 2,
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginTop: 10,
        borderRadius: 6,
        borderColor: 'rgba(0, 0, 0, 0.05)',
      }}
      onPress={() => {
        item?.route ? navigation.navigate(item?.route) : dispatch(logout());
      }}
    >
      {item?.image}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width - 100,
          alignItems: 'center',
        }}
      >
        <View style={{ marginLeft: 16 }}>
          {item?.title && (
            <CustomText
              color={COLORS.primarytext}
              align="left"
              fontSize={13}
              fontFamily={fonts.EuclidMedium}
            >
              {item?.title}
            </CustomText>
          )}
          {item?.subtitle && (
            <CustomText
              color={COLORS.secondarytext}
              align="left"
              top={2}
              fontSize={11}
              fontFamily={fonts.EuclidRegular}
            >
              {item?.subtitle}
            </CustomText>
          )}
        </View>
        {item?.route && (
          <View style={{ marginLeft: 16 }}>
            <RightSvg />
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaWrap style={{ paddingBottom: 66 }}>
      <Col style={{ flex: 1, justifyContent: 'flex-start' }}>
        <Row marginBottom={16} paddingHorizontal={16}>
          <CustomText
            color={COLORS.primarytext}
            align="left"
            fontSize={20}
            fontFamily={fonts.EuclidMedium}
          >
            {'Profile'}
          </CustomText>
        </Row>
        <Row marginBottom={16} paddingHorizontal={16}>
          <CustomText
            color={COLORS.primarytext}
            align="left"
            fontSize={13}
            fontFamily={fonts.EuclidRegular}
          >
            Your personal information and settings
          </CustomText>
        </Row>

        <View
          style={{
            borderWidth: 2,
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingHorizontal: 10,
            paddingVertical: 13,
            marginTop: 10,
            borderRadius: 6,
            borderColor: 'rgba(0, 0, 0, 0.05)',
            width: width - 40,
            backgroundColor: COLORS.primary,
          }}
        >
          <Image
            source={
              user?.user?.photoURL ? { uri: user?.user?.photoURL } : AccountPng
            }
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ marginLeft: 16 }}>
              <CustomText
                color={COLORS.white}
                align="left"
                fontSize={16}
                fontFamily={fonts.EuclidMedium}
              >
                {capitalize(`${user?.user?.displayName}`)}
              </CustomText>
              <CustomText
                color={COLORS.white}
                align="left"
                top={2}
                fontSize={12}
                fontFamily={fonts.EuclidRegular}
              >
                {user?.user?.email}
              </CustomText>
              {user?.user?.phoneNumber && (
                <CustomText
                  color={COLORS.white}
                  align="left"
                  top={2}
                  fontSize={12}
                  fontFamily={fonts.EuclidRegular}
                >
                  {user?.user?.phoneNumber}
                </CustomText>
              )}
            </View>
          </View>
        </View>
      </Col>
      <Logout
        item={{
          route: null,
          image: <LogoutSvg />,
          title: 'Logout',
          subtitle: null,
        }}
      />
    </SafeAreaWrap>
  );
};

export default MySettings;
