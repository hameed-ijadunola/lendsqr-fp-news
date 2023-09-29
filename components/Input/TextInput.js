/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'
import fonts from '../../constants/fonts'
import CustomText from '../CustomText/CustomText'
import EyeOff from '../../assets/svgs/eye-off.svg'
import EyeOn from '../../assets/svgs/eye-on.svg'
import { Col, Row } from '../CustomGrid/CustomGrid'

const Wrapper = styled.View`
    height: ${(props) => '58px'};
    width: ${(props) => props?.width || '100%'};
    border-width: 1px;
    border-color: ${(props) => props?.borderColor || COLORS?.secondarytext};
    border-radius: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: ${(props) => props?.marginTop || 0}px;
    padding-horizontal: 12px;
`

const TextWrap = styled.TextInput`
    height: 100%;
    width: 100%;
    font-family: ${fonts?.EuclidRegular};
    font-size: ${(props) => props?.fontSize || '13px'};
    color: ${COLORS?.black};
    align-items: center;
    padding-vertical: ${(props) => props?.paddingVertical || '0px'};
    padding-left: ${(props) =>
        props?.showNaira
            ? '55px'
            : props?.paddingLeft
            ? props?.paddingLeft
            : '0px'};
    padding-right: ${(props) =>
        props?.paddingRight ? props?.paddingRight : '0px'};
`

const Container = styled.View`
    align-items: flex-start;
    margin-top: ${(props) => props?.marginTop || 0}px;
    width: ${(props) => props?.width || '100%'};
    /* height: ${(props) => props?.height || '100px'}; */
`

const ShowWrap = styled.TouchableOpacity`
    position: absolute;
    right: 15px;
    height: 24px;
    padding-horizontal: 4px;
    border-radius: 2px;
    justify-content: center;
`

const TextInput = ({
    marginTop = 0,
    width,
    height,
    label,
    placeholder = '',
    placeholderTextColor = COLORS.secondarytext,
    inputType = 'default',
    returnValue = true,
    handleChange = () => {},
    name = '',
    errors = '',
    touched = '',
    value,
    showNaira = false,
    disabled = false,
    inputBg,
    fontSize = '13px',
    labelFontSize = 13,
    multiline = false,
    numberOfLines,
    textAlignVertical,
    paddingVertical,
    isPassword,
    labelComponent,
    leftComponent,
    rightComponent,
    paddingLeft,
    paddingRight,
    onBlur = () => {},
    onFocus = () => {},
}) => {
    const [focused, setFocused] = useState(false)
    const [hidden, setHidden] = useState(!isPassword)

    useEffect(() => {
        if (errors.length > 0) {
            setFocused(false)
        }
    }, [errors])

    return (
        <Container marginTop={marginTop} width={width}>
            {label && (
                <Row justify="flex-start">
                    <CustomText
                        color={
                            focused
                                ? COLORS?.primary
                                : errors
                                ? COLORS.error
                                : COLORS?.secondarytext
                        }
                        align="left"
                        fontSize={labelFontSize}
                        bottom={5}
                        fontFamily={fonts.EuclidMedium}
                    >
                        {label}
                    </CustomText>
                    {labelComponent && labelComponent}
                </Row>
            )}
            <Wrapper
                active={focused}
                width={width}
                inputBg={inputBg}
                borderColor={
                    focused
                        ? COLORS?.primary
                        : errors
                        ? COLORS.error
                        : COLORS?.secondarytext
                }
            >
                {showNaira && (
                    <Col
                        width={'55px'}
                        style={{ position: 'absolute', left: 0, height: 55 }}
                        bgColor={'#F4F5F7'}
                        align="center"
                        justify="center"
                    >
                        <CustomText
                            color={COLORS.primarytext}
                            align="left"
                            fontSize={24}
                            fontFamily={fonts.EuclidRegular}
                        >
                            ₦
                        </CustomText>
                    </Col>
                )}
                {leftComponent && leftComponent}
                <TextWrap
                    placeholderTextColor={placeholderTextColor}
                    placeholder={placeholder}
                    keyboardType={inputType}
                    onChangeText={
                        returnValue
                            ? (e) => {
                                  handleChange(e)
                              }
                            : handleChange(name)
                    }
                    onFocus={() => {
                        setFocused(true)
                        onFocus()
                    }}
                    onBlur={() => {
                        setFocused(false)
                        onBlur()
                        // setFieldTouched(name);
                    }}
                    secureTextEntry={!hidden}
                    value={value}
                    editable={!disabled}
                    fontSize={fontSize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={textAlignVertical}
                    paddingVertical={paddingVertical}
                    errors={errors}
                    showNaira={showNaira}
                    paddingLeft={paddingLeft}
                    paddingRight={paddingRight}
                />
                {isPassword && (
                    <ShowWrap onPress={() => setHidden(!hidden)}>
                        {hidden ? <EyeOff /> : <EyeOn />}
                    </ShowWrap>
                )}
                {rightComponent && rightComponent}
            </Wrapper>
            {!!errors && (
                <CustomText
                    align="left"
                    fontSize={labelFontSize}
                    top={3}
                    fontFamily={fonts.EuclidMedium}
                    color={COLORS.error}
                >
                    {errors}
                </CustomText>
            )}
        </Container>
    )
}

export default TextInput
