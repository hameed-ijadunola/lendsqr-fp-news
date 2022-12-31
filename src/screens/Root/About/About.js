import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {StatusBar} from 'expo-status-bar';
import BackArrow from '../../../assets/images/left_arrow.svg';
import {COLORS} from '../../../constants';
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
import SignOutSvg from '../../../assets/images/sign-out.svg';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const FormattedParagraph = ({text, type, noLine}) => {
  return type == 'body' ? (
    <View
      style={{
        marginBottom: noLine ? 0 : 10,
      }}>
      <Text style={styles.text}>
        {text
          .replace(/[\r\n]/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim()}
      </Text>
    </View>
  ) : type == 'heading' ? (
    <View
      style={{
        marginTop: noLine ? 0 : 10,
        marginBottom: 2,
      }}>
      <Text style={[styles.heading, noLine && {textDecorationLine: 'none'}]}>
        {text
          .replace(/[\r\n]/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim()}
      </Text>
    </View>
  ) : (
    type == 'bullet' && (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          paddingRight: 15,
        }}>
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: 'black',
            marginRight: 15,
            marginTop: 5,
          }}></View>
        <Text style={styles.bulletText}>
          {text
            .replace(/[\r\n]/gm, ' ')
            .replace(/\s+/g, ' ')
            .trim()}
        </Text>
      </View>
    )
  );
};
const About = ({navigation}) => {
  const dispatch = useDispatch();

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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackArrow />
            </TouchableOpacity>
            <Text style={styles.title}>About me</Text>
          </View>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              GoogleSignin.signOut();
              auth().signOut();
            }}>
            <Text style={styles.title}>Log out</Text>
            <SignOutSvg marginLeft={5} />
          </TouchableOpacity>
        </View>

        <View style={[styles.halfModal]}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <Image
              style={{
                width: 200,
                height: 250,
                borderRadius: 50,
                alignSelf: 'center',
                marginVertical: 20,
              }}
              resizeMode='contain'
              source={require('../../../assets/images/passportHameedpreview.png')}
            />
            <FormattedParagraph type={'heading'} text={'Personal Info.'} />
            <FormattedParagraph
              type={'body'}
              text={`A spirited software developer, IoT engineer and researcher that aims
                    to contribute to software, IoT solutions and research using built up
                    knowledge and experience.`}
            />

            <FormattedParagraph type={'heading'} text={`Contact Info`} />
            <FormattedParagraph
              type={'body'}
              text={`Email: ijadunolahameed@gmail.com`}
            />
            <FormattedParagraph type={'body'} text={`Phone: +2349024547592`} />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default About;

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
  cancel: {
    right: 20,
    position: 'absolute',
  },
  heading: {
    color: COLORS.black,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins_600SemiBold',
    textDecorationLine: 'underline',
  },
  text: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
  },
  redtext: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
  },
  redBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: COLORS.red,
  },
  crash: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
});
