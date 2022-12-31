import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import RightArrow from '../../../assets/images/right__arrow.svg';
import LeftArrow from '../../../assets/images/left__arrow.svg';
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
import {setNewsFeed} from '../../../redux/features/newsSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useGetLatestHeadlinesMutation} from '../../../redux/features/newsApi2';
import crashlytics from '@react-native-firebase/crashlytics';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const {newsFeed} = useSelector(state => state.newsFeed);
  const [range, setRange] = useState({no1: 0, no2: 50});
  const [refreshing, setRefreshing] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const [getLatestHeadlines, {isLoading: isGettingLatestHeadlines}] =
    useGetLatestHeadlinesMutation();

  const fetchDetails = async arrIds => {
    let result = [];
    for (let i = 0; i < arrIds.length; i++) {
      const id = arrIds[i];
      const det = await getNewsDetails(id);
      if (det?.data) {
        result.push(det?.data);
      }
    }
    dispatch(setNewsFeed(result));
  };

  const fetchNewsBySearch = async () => {
    const res = await getNewsBySearch({
      q: 'Technology',
      page: 1,
      page_size: 10000,
    });
    console.log(res);
  };
  const fetchLatestHeadlines = async () => {
    const res = await getLatestHeadlines({
      page: 1,
      page_size: 10000,
    });
    if (res?.data) {
      dispatch(setNewsFeed(res?.data?.articles));
      console.log(res?.data?.articles);
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
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  useEffect(() => {
    fetchLatestHeadlines();
    console.log(range);
  }, [range, refetch]);

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
            <Text style={styles.title}>Global News Headlines</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={refreshing}
              onPress={() => {
                if (range.no1 !== 0) {
                  setRange({no1: range.no1 - 50, no2: range.no2 - 50});
                }
              }}>
              <LeftArrow marginRight={5} />
            </TouchableOpacity>
            <Text style={styles.no}>{range.no1}</Text>
            <Text style={styles.no}> - </Text>
            <Text style={styles.no}>{range.no2}</Text>
            <TouchableOpacity
              style={{
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={refreshing}
              onPress={() => {
                setRange({
                  no1: range.no2,
                  no2: range.no2 + 50,
                });
              }}>
              <RightArrow marginRight={10} marginLeft={10} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.halfModal]}>
          <FlatList
            data={[...newsFeed]
              ?.sort(
                (a, b) =>
                  moment(b?.published_date).format('x') -
                  moment(a?.published_date).format('x'),
              )
              .slice(range.no1, range.no2)}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.newsContainer}
                  key={item?._id}
                  onPress={() =>
                    navigation.navigate('NewsDetails', {
                      url: item?.link,
                      title: item?.title,
                    })
                  }>
                  <View style={styles.newsSubContainer}>
                    <Image
                      source={{uri: item?.media}}
                      style={styles.img}
                      resizeMode={'contain'}
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
                      }}>
                      <Text style={styles.text}>
                        By: {item?.author || item?.authors || '___'}
                      </Text>
                      <Text style={styles.text}>
                        {moment().isSame(item?.published_date, 'day')
                          ? moment(item?.published_date).format('hh:mm a') +
                            ' Today'
                          : moment(item?.published_date).format(
                              'hh:mma | DD/MM/YY',
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
        </View>
      </View>
    </>
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
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  newsTitle: {
    color: 'black',
    fontFamily: 'Poppins_500Medium',
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
    borderColor: COLORS.gray1,
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
    fontFamily: 'Poppins_400Regular',
  },
  text: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  no: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Montserrat_400Regular',
  },
});
