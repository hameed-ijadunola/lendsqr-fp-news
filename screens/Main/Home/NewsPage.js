import {
  View,
  BackHandler,
  Alert,
  Pressable,
  Image,
  useWindowDimensions,
  StyleSheet,
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
  PressableRow,
  Row,
} from '../../../components/CustomGrid/CustomGrid';
import { useGetLatestHeadlinesMutation } from '../../../redux/features/newsApi';
import crashlytics from '@react-native-firebase/crashlytics';
import { setNewsFeed } from '../../../redux/features/newsSlice';
import BackSvg from '../../../assets/svgs/Back.svg';
import WebView from 'react-native-webview';

const NewsPage = ({ route }) => {
  const params = route.params;
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const toast = useToast();

  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(true);

  return (
    <SafeAreaWrap
      style={{
        justifyContent: 'space-between',
      }}
    >
      <Col style={{ flexGrow: 1, justifyContent: 'flex-start' }}>
        <Row marginBottom={16} paddingHorizontal={16} justify="flex-start">
          <Pressable
            style={{
              alignItems: 'center',
              paddingRight: 15,
            }}
            onPress={() =>
              navigation.navigate('BottomTabStack', {
                screen: 'Home',
              })
            }
          >
            <BackSvg />
          </Pressable>

          <CustomText
            color={COLORS.primarytext}
            align="left"
            fontSize={20}
            fontFamily={fonts.EuclidMedium}
          >
            {params?.title}
          </CustomText>
        </Row>
        <Row
          style={{ flexGrow: 1, justifyContent: 'center', marginBottom: 30 }}
        >
          <WebView style={styles.webview} source={{ uri: params?.url }} />
        </Row>
      </Col>
    </SafeAreaWrap>
  );
};

export default NewsPage;
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
});
