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
import SpinnerSvg from '../../../assets/svgs/spinnerbig.svg'
import SuccessSvg from '../../../assets/svgs/successful.svg'
import HeaderBackArrow from '../headers/HeaderBackArrow'
import { useNavigation } from '@react-navigation/native'
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

const LoadingModal = ({
    visible,
    setVisible = () => {},
    text = '',
    onClose = () => {},
}) => {
    const { height } = useWindowDimensions()
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
            <BlackBg
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Animated.View
                    style={{
                        transform: [{ translateY }],
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    <SpinnerSvg />
                    <CustomText>{text}</CustomText>
                </Animated.View>
            </BlackBg>
        </Modal>
    )
}

export default LoadingModal
