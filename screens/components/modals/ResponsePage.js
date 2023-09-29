/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import {
    Modal,
    Dimensions,
    Animated,
    ScrollView,
    View,
    useWindowDimensions,
} from 'react-native'
import styled from 'styled-components'
import { COLORS } from '../../../constants/colors'
import CustomText from '../../../components/CustomText/CustomText'
import fonts from '../../../constants/fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    Col,
    PressableCol,
    PressableRow,
    Row,
    ScrollCol,
} from '../../../components/CustomGrid/CustomGrid'
import ShareSvg from '../../../assets/svgs/share.svg'
import SuccessSvg from '../../../assets/svgs/successful.svg'
import HeaderBackArrow from '../headers/HeaderBackArrow'
import { useNavigation } from '@react-navigation/native'
import Button from '../../../components/Button/Button'
import ViewShot from 'react-native-view-shot'
import Share from 'react-native-share'

const BlackBg = styled.View`
    justify-content: space-between;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 8, 15, 0.74);
`

const CloseView = styled.TouchableOpacity`
    flex: 1;
`

const WhiteBg = styled.View`
    background-color: ${COLORS.white};
    width: 100%;
    padding-top: 20px;
    padding-bottom: 40px;
    border-radius: 3px;
    justify-content: center;
    align-items: center;
`

const SpacedRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const ResponsePage = ({
    visible,
    setVisible,
    details = [],
    buttons = [],
    onClose = () => {},
}) => {
    const { height, width } = useWindowDimensions()
    const translateY = useRef(new Animated.Value(height)).current
    const navigation = useNavigation()

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 20,
                delay: 50,
                duration: 200,
                useNativeDriver: true,
            }).start()
        }
    }, [visible])

    const closeModal = () => {
        Animated.spring(translateY, {
            toValue: height,
            duration: 1000,
            useNativeDriver: true,
        }).start()
        setTimeout(() => {
            onClose()
            setVisible(false)
        }, 300)
    }

    return (
        <Modal transparent={true} visible={visible}>
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps={'handled'}
                scrollEnabled={false}
            >
                <BlackBg>
                    <CloseView onPress={closeModal} />
                    <Animated.View
                        style={{
                            transform: [{ translateY }],
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <WhiteBg>
                            <Col
                                marginTop={10}
                                marginBottom={40}
                                width={'100%'}
                                paddingTop={23}
                                align="center"
                                justify="flex-start"
                                style={{ height: '100%' }}
                            >
                                <Row paddingBottom={10}>
                                    <HeaderBackArrow
                                        title={'Transaction Details'}
                                        rightComponent={
                                            <PressableCol
                                                width={'30px'}
                                                style={{
                                                    position: 'absolute',
                                                    right: 24,
                                                    height: 30,
                                                }}
                                                justify="center"
                                                align="center"
                                                onPress={() => {
                                                    const currentDate =
                                                        new Date()
                                                    const formattedDate = `${currentDate.getDate()}-${
                                                        currentDate.getMonth() +
                                                        1
                                                    }-${currentDate.getFullYear()}`
                                                    const snapshotName = `etransaction_receipt_${formattedDate}.png`

                                                    this.viewShotRef
                                                        .capture({
                                                            format: 'png',
                                                            quality: 0.8,
                                                            result: 'data-uri',
                                                            snapshotContentContainer: false,
                                                            fileName:
                                                                snapshotName,
                                                        })
                                                        .then((uri) => {
                                                            console.log(
                                                                'uri:',
                                                                uri
                                                            )
                                                            Share.open({
                                                                url: uri,
                                                            })
                                                        })
                                                }}
                                            >
                                                <ShareSvg />
                                            </PressableCol>
                                        }
                                    />
                                </Row>
                                <ViewShot
                                    ref={(ref) => (this.viewShotRef = ref)}
                                >
                                    <View
                                        style={{
                                            width: width,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <SuccessSvg marginTop={30} />
                                        <CustomText
                                            color={COLORS.primarytext}
                                            align="center"
                                            fontSize={16}
                                            top={20}
                                            fontFamily={fonts.EuclidBold}
                                        >
                                            Transaction Successful
                                        </CustomText>
                                        {details?.map((x) =>
                                            x?.value ? (
                                                <Col
                                                    key={x?.id}
                                                    paddingHorizontal={52}
                                                    marginBottom={24}
                                                >
                                                    <Row showBorder key={x?.id}>
                                                        {typeof x?.title ==
                                                        'string' ? (
                                                            <CustomText
                                                                color={
                                                                    COLORS.secondarytext
                                                                }
                                                                align="left"
                                                                fontSize={14}
                                                                fontFamily={
                                                                    fonts.EuclidRegular
                                                                }
                                                            >
                                                                {x?.title}
                                                            </CustomText>
                                                        ) : (
                                                            x?.title
                                                        )}
                                                        {typeof x?.value ==
                                                        'string' ? (
                                                            <CustomText
                                                                key={x?.id}
                                                                color={
                                                                    COLORS.gray2
                                                                }
                                                                align="right"
                                                                fontSize={14}
                                                                fontFamily={
                                                                    fonts.EuclidSemiBold
                                                                }
                                                                maxWidth={'50%'}
                                                            >
                                                                {x?.value}
                                                            </CustomText>
                                                        ) : (
                                                            x?.value
                                                        )}
                                                    </Row>
                                                </Col>
                                            ) : (
                                                <></>
                                            )
                                        )}
                                    </View>
                                </ViewShot>
                                {buttons.map((button) =>
                                    button?.text || button?.onPress ? (
                                        <Col
                                            key={button?.id}
                                            paddingHorizontal={52}
                                            marginBottom={24}
                                        >
                                            <Button
                                                key={button?.id}
                                                text={button?.text}
                                                style={button?.style}
                                                onPress={button?.onPress}
                                                textColor={button?.textColor}
                                            />
                                        </Col>
                                    ) : (
                                        <></>
                                    )
                                )}
                            </Col>
                        </WhiteBg>
                    </Animated.View>
                </BlackBg>
            </KeyboardAwareScrollView>
        </Modal>
    )
}

export default ResponsePage
