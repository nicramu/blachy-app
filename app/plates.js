import { View, Text, FlatList, RefreshControl, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useCallback, useRef } from 'react'
import { PlateList } from '../components/Lists'
import { PlateTile } from '../components/StyledComponents'
import { useTheme } from "@react-navigation/native";
import { PillMenu } from '../components/PillMenu';
import { useAuth } from '../contexts/auth';
import { useFocusEffect } from 'expo-router';

export default function plates() {
    const theme = useTheme()
    const { isLoading, setIsLoading,i18n } = useAuth()
    const [data, setData] = useState()
    const [itemsToRender, setItemsToRender] = useState([0, 5, 1])
    const platesRef = useRef()

    const getPlates = useCallback(async function getPlates(sorting) {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/plates?sorting=${sorting}`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
            }
        })

        const res = await req.json()

        if (req.ok) {
           // console.log(res.plate)
            setData(res.plate)
        } else {
            alert(res.message)
        }
        setIsLoading(false)

    }, [])

    useFocusEffect(useCallback(() => {
        setIsLoading(true)
        getPlates()
    }, []))

    const onRefresh = useCallback(() => {
        setIsLoading(true);
        getPlates()
    }, []);

    return (
        <View style={theme.container}>
            <PillMenu action={getPlates} props={[{ name: i18n.t('latest'), sorting: 'latest comments' }, { name: i18n.t('best'), sorting: 'best plates' }, { name: i18n.t('worst'), sorting: 'worst plates' }]} />
            {isLoading && <ActivityIndicator size={'large'} />}
            {!isLoading && data &&
                <FlatList
                    contentContainerStyle={{ paddingTop: 75 }}
                    ref={platesRef}
                    data={data?.slice(itemsToRender[0], itemsToRender[1])}
                    renderItem={(props) => PlateList({ ...props, getPlate: getPlates })}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                    }
                    initialNumToRender={5}
                    windowSize={3}
                    ListFooterComponent={
                        <View style={{ paddingVertical: 20 }}>
                            <PlateTile>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {Array.from({ length: Math.ceil(data.length / 5) }, (_, i) => i + 1).map((item) => (
                                        <Pressable key={item} style={[theme.button, item === itemsToRender[2] && theme.buttonAlt]} onPress={() => [setItemsToRender([item * 5 - 5, item * 5, item]), platesRef.current.scrollToOffset({ animated: true, y: 0 })]}>
                                            <Text style={[{ textAlign: 'center' }, theme.buttonText, item === itemsToRender[2] && theme.buttonAltText, { fontWeight: 'bold' }]}>{item}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </PlateTile>
                        </View>
                    }
                />
            }
        </View>
    )
}