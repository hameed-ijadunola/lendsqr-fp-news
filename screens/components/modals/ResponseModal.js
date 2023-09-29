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
    PressableRow,
    Row,
    ScrollCol,
} from '../../../components/CustomGrid/CustomGrid'
import SuccessSvg from '../../../assets/svgs/successful.svg'
import Button from '../../../components/Button/Button'

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
    width: 90%;
    padding-top: 20px;
    padding-horizontal: 24px;
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

const ResponseModal = ({
    visible,
    setVisible,
    onClose = () => {
        return true
    },
    details,
}) => {
    const { height } = useWindowDimensions()
    const translateY = useRef(new Animated.Value(height)).current

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
        if (onClose()) {
            Animated.spring(translateY, {
                toValue: height,
                duration: 1000,
                useNativeDriver: true,
            }).start()
            setTimeout(() => {
                setVisible(false)
            }, 300)
        }
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
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 80,
                        }}
                    >
                        <WhiteBg>
                            <Col
                                marginTop={10}
                                marginBottom={40}
                                width={'100%'}
                                paddingTop={40}
                                align="center"
                            >
                                {details?.type ? <SuccessSvg /> : <></>}
                                <CustomText
                                    color={COLORS.primarytext}
                                    align="center"
                                    fontSize={16}
                                    top={20}
                                    fontFamily={fonts.EuclidBold}
                                >
                                    {details?.title}
                                </CustomText>
                                <CustomText
                                    color={COLORS.primarytext}
                                    align="center"
                                    fontSize={13}
                                    top={20}
                                    width={'200px'}
                                    fontFamily={fonts.EuclidLight}
                                >
                                    {details?.subtitle}
                                </CustomText>
                            </Col>
                            {details?.btn1text && (
                                <Button
                                    text={details?.btn1text}
                                    top={16}
                                    onPress={details?.btn1Click}
                                    bgColor={COLORS.primary}
                                />
                            )}
                            {details?.btn2text && (
                                <Button
                                    text={details?.btn2text}
                                    top={16}
                                    onPress={details?.btn2Click}
                                    bgColor={COLORS.blue}
                                />
                            )}
                        </WhiteBg>
                    </Animated.View>
                </BlackBg>
            </KeyboardAwareScrollView>
        </Modal>
    )
}

export default ResponseModal
