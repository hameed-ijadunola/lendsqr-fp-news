import { View, Text } from 'react-native'
import React from 'react'
import { PressableCol, Row } from '../../../components/CustomGrid/CustomGrid'
import CustomText from '../../../components/CustomText/CustomText'
import BackSvg from '../../../assets/svgs/arrow-left.svg'
import { COLORS } from '../../../constants/colors'
import fonts from '../../../constants/fonts'
const HeaderBackArrow = ({
    navigation,
    onBackPress,
    title = '',
    rightComponent,
}) => {
    return (
        <Row marginBottom={16} paddingHorizontal={16} justify="center">
            {navigation && (
                <PressableCol
                    width={'30px'}
                    style={{
                        position: 'absolute',
                        left: 24,
                        height: 30,
                    }}
                    justify="center"
                    align="center"
                    onPress={
                        onBackPress ? onBackPress : () => navigation.goBack()
                    }
                >
                    <BackSvg />
                </PressableCol>
            )}
            <CustomText
                color={COLORS.primarytext}
                align="left"
                fontSize={16}
                fontFamily={fonts.EuclidMedium}
            >
                {title}
            </CustomText>
            {rightComponent && rightComponent}
        </Row>
    )
}

export default HeaderBackArrow
