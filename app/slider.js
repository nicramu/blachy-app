import { View, Text, FlatList, Dimensions, Image, Pressable, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useTheme } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../contexts/auth';

const slider = () => {
    const theme = useTheme()
    const { width, height } = Dimensions.get('window');
    const { i18n } = useAuth()
    const [generatedPass, setGeneratedPass] = useState()
    const flatlistRef = useRef(null)
    const [copyButtonVisible, setCopyButtonVisible] = useState(true)

    const generatePassword = async () => {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generatePassword`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
            }
        })

        const res = await req.json()

        if (req.ok) {
            setGeneratedPass(res.message)
        } else {
            alert(res.message)
        }
    }

    useEffect(() => {
        generatePassword()
    }, [])

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(generatedPass);
    };


    const data = [
        { title: 'blachy app', desc: i18n.t('appdesc'), img: 'a' },
        // { title: '', desc: 'generate qr code and stick it to your car to get notification when someone has scanned it', ico: 'qrcode-scan' },
        { title: i18n.t('tos'), desc: i18n.t('tosdesc'), ico: 'cookie' },
        { title: i18n.t('uniquepass'), desc: i18n.t('passdesc'), ico: 'shield-key' }

    ]
    return (
        <FlatList
            horizontal
            ref={flatlistRef}
            data={data}
            pagingEnabled
            initialScrollIndex={0}
            onContentSizeChange={() => flatlistRef.current.scrollToIndex({ index: 0, animated: true })}
            getItemLayout={(data, index) => (
                { length: width, offset: width * index, index }
            )}
            renderItem={({ item, index }) =>
                <View style={{ width: width, flexDirection: 'column', height: height, justifyContent: 'space-between', padding: 20 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        {item.img &&
                            <View style={{ height: 200, width: width, overflow: 'hidden', marginBottom: 10 }}>
                                <Image source={require('../styles/startimg.jpg')} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                            </View>}
                        {item.ico && <Icon name={item.ico} size={64} color={theme.iconDark} />}
                        <Text style={[theme.textVariants.header, { fontSize: 32, marginBottom: 10 }]}>{item.title}</Text>
                        <ScrollView style={[theme.plateTile, { maxHeight: height / 2, flexShrink: 0, flexGrow: 0, padding:20 }]} >
                            <Text style={[theme.textVariants.body, { fontSize: 18, textAlign: 'center',overflow:'visible' }]}>{item.desc}</Text>
                        </ScrollView>

                        {index === data.length - 1 &&
                            <View style={[theme.plateTile, { flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}>
                                <Text style={[theme.textVariants.body, { fontSize: 18, textAlign: 'center', fontWeight: 'bold', marginRight: 10 }]}>{generatedPass}</Text>
                                {copyButtonVisible && <Pressable style={theme.button} onPress={() => [copyToClipboard(), setCopyButtonVisible(false)]}><Icon name={'content-copy'} size={32} color={theme.iconDark} /></Pressable>}
                            </View>
                        }
                    </View>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Pressable onPress={() => index == data.length - 1 ? router.replace('/register') : flatlistRef.current.scrollToIndex({ index: index + 1, animated: true })} >
                            <Icon name={'arrow-right-bold-circle'} size={64} color={theme.iconDark} />
                        </Pressable>
                    </View>
                </View>
            }
        />
    )
}

export default slider