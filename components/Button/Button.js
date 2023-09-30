import { ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/colors';
import styled from 'styled-components/native';
import CustomText from '../CustomText/CustomText';
import Fonts from '../../constants/fonts';

const BtnWrap = styled.TouchableOpacity`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.bgColor};
  border-radius: ${(props) => props.borderRadius};
  justify-content: ${(props) => props?.jc || 'center'};
  margin-top: ${(props) => props?.top || 0}px;
  margin-bottom: ${(props) => props?.bottom || 0}px;
  align-items: center;
  ${(props) => props.style};
  z-index: 1;
`;

const ViewWrap = styled.View`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.bgColor};
  border-radius: ${(props) => props.borderRadius};
  justify-content: ${(props) => props?.jc || 'center'};
  align-items: center;
  margin-top: ${(props) => props?.top || 0}px;
  margin-bottom: ${(props) => props?.bottom || 0}px;
  ${(props) => props.style};
  padding-top: ${Platform.OS === 'ios' ? '10px' : '0px'};
  z-index: 1;
`;

const DisabledWrap = styled.View`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.bgColor};
  justify-content: ${(props) => props?.jc || 'center'};
  align-items: center;
  ${(props) => props.style};
  padding-top: ${Platform.OS === 'ios' ? '10px' : '0px'};
  position: absolute;
  bottom: 0px;
  z-index: 3;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Button = ({
  text,
  textComponent,
  children,
  bgColor = COLORS.primary,
  textColor = COLORS.white,
  width = '100%',
  height = '56px',
  borderRadius = '5px',
  jc = 'center',
  style,
  top,
  bottom,
  loading = false,
  disabled = false,
  textSize = 14,
  icon = null,
  iconRight = true,
  fontWeight,
  fontFamily,
  onPress = () => {},
  textTop = 0,
}) => {
  return (
    <>
      <BtnWrap
        textColor={textColor}
        width={width}
        height={height}
        style={style}
        borderRadius={borderRadius}
        justifyContent={jc}
        bgColor={bgColor}
        top={top}
        bottom={bottom}
        onPress={onPress}
        disabled={loading || disabled}
      >
        {loading ? (
          <ActivityIndicator
            style={{ alignSelf: 'center' }}
            size="small"
            color={COLORS.white}
          />
        ) : (
          <Row>
            {icon && !iconRight && icon}
            {textComponent ? (
              textComponent
            ) : children ? (
              children
            ) : (
              <CustomText
                color={textColor}
                align="center"
                fontFamily={Fonts?.EuclidMedium}
                fontSize={textSize}
                top={textTop}
                text={text}
              />
            )}
            {icon && iconRight && icon}
          </Row>
        )}
        {disabled && (
          <DisabledWrap
            width={'100%'}
            height={height}
            bgColor={'rgba(255,255,255, 0.1)'}
          />
        )}
      </BtnWrap>
    </>
  );
};

export default Button;
