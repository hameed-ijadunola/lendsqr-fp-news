import {
  View,
  BackHandler,
  Alert,
  Pressable,
  Image,
  useWindowDimensions,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
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
import moment from 'moment';

const Home = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const toast = useToast();
  const { newsFeed } = useSelector((state) => state.newsFeed);
  const [range, setRange] = useState({ no1: 0, no2: 100 });
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [getLatestHeadlines, { isLoading: isGettingLatestHeadlines }] =
    useGetLatestHeadlinesMutation();

  const fetchLatestHeadlines = async () => {
    setRefreshing(true);
    const res = await getLatestHeadlines({
      page: 1,
      pageSize: range.no2,
    });
    if (res?.data) {
      dispatch(setNewsFeed(res?.data?.articles));
      setRefreshing(false);
      return;
    }
    crashlytics().log(res?.error?.data?.message);
    toast.show(res?.error?.data?.message, {
      placement: 'top',
      duration: 5000,
    });
    setRefreshing(false);
  };

  ///handle back action
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit QC News!', 'Are you sure you want to exit?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  useEffect(() => {
    fetchLatestHeadlines();
  }, [range, refetch]);

  return (
    <SafeAreaWrap
      style={{
        justifyContent: 'space-between',
      }}
    >
      <Col style={{ flexGrow: 1 }}>
        <Row marginBottom={16} paddingHorizontal={16} justify="flex-start">
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() =>
              navigation.navigate('MainStack', {
                screen: 'NewsPage',
              })
            }
          >
            <CustomText
              color={COLORS.primarytext}
              align="left"
              fontSize={20}
              fontFamily={fonts.EuclidMedium}
            >
              {`News Headlines`}
            </CustomText>
          </Pressable>
        </Row>
        <Row marginBottom={16} paddingHorizontal={16} justify="flex-start">
          <FlatList
            data={[...newsFeed]
              ?.sort(
                (a, b) =>
                  moment(b?.published_date).format('x') -
                  moment(a?.published_date).format('x')
              )
              .slice(range.no1, range.no2)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.newsContainer}
                  key={item?._id}
                  onPress={() =>
                    navigation.navigate('NewsPage', {
                      url: item?.url || item?.link,
                      title: item?.title,
                    })
                  }
                >
                  <View style={styles.newsSubContainer}>
                    <Image
                      source={{ uri: item?.urlToImage }}
                      style={styles.img}
                      resizeMode={'cover'}
                    />
                    <View style={styles.imgloader}>
                      <ActivityIndicator size={'large'} color={'#dddddd90'} />
                    </View>
                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {item?.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Text style={styles.text}>
                        By: {item?.author || item?.authors || '___'}
                      </Text>
                      <Text style={styles.text}>
                        {moment().isSame(item?.publishedAt, 'day')
                          ? moment(item?.publishedAt).format('hh:mm a') +
                            ' Today'
                          : moment(item?.publishedAt).format(
                              'hh:mma | DD/MM/YY'
                            )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => setRefetch(!refetch)}
              />
            }
          />
        </Row>
      </Col>
    </SafeAreaWrap>
  );
};

export default Home;
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
  img: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: COLORS.black,
  },
  imgloader: {
    position: 'absolute',
    top: 85,
    alignSelf: 'center',
    zIndex: -1,
  },
  halfModal: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 30,
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
    fontFamily: fonts.EuclidMedium,
    fontSize: 16,
  },
  newsTitle: {
    color: 'black',
    fontFamily: fonts.EuclidMedium,
    fontSize: 14,
    marginTop: 10,
  },
  cancel: {
    right: 20,
    position: 'absolute',
  },
  newsContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: COLORS.gray4,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
  },
  newsSubContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    width: '90%',
  },
  redBtnTxt: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: fonts.EuclidRegular,
  },
  text: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 24,
    fontFamily: fonts.EuclidRegular,
  },
  no: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.EuclidRegular,
  },
});
