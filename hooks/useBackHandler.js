import { useCallback, useEffect } from 'react'
import { Alert, BackHandler } from 'react-native'

const useBackHandler = (
    message,
    title,
    onYesCallback,
    navigation,
    redirectRouteName
) => {
    return useCallback(() => {
        const onBackPress = () => {
            if (title === '' && message === '') {
                navigation.navigate(redirectRouteName)
                return true
            } else {
                Alert.alert(title, message, [
                    {
                        text: 'No',
                        onPress: () => null,
                        style: 'cancel',
                    },
                    { text: 'Yes', onPress: onYesCallback },
                ])
                return true
            }
        }

        BackHandler.addEventListener('hardwareBackPress', onBackPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }
    }, [message, onYesCallback, title, redirectRouteName])
}

export default useBackHandler
