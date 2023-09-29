import styled from 'styled-components/native';
import React from 'react';
import { COLORS } from '../../constants/colors';
import fonts from '../../constants/fonts';
import { Text } from 'react-native';

const CustomText = ({
  fontSize = 14,
  fontFamily = fonts.EuclidRegular,
  children,
  text,
  fontWeight,
  color = COLORS.black,
  top,
  right,
  left,
  bottom,
  align,
  style,
  maxWidth,
  transform,
}) => {
  return (
    <Text
      style={{
        marginTop: top,
        marginRight: right,
        marginLeft: left,
        fontWeight: fontWeight,
        color: color,
        bottom: bottom,
        fontSize: fontSize,
        fontFamily: fontFamily,
        transform: transform,
        maxWidth: maxWidth,
        alignItems:
          align == 'left'
            ? 'flex-start'
            : align === 'right'
            ? 'flex-end'
            : align,
        ...style,
      }}
    >
      {children || text}
    </Text>
  );
};

export default CustomText;
