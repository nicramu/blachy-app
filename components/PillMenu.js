import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useState, useRef, useEffect, memo } from 'react'
import { useTheme } from "@react-navigation/native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/auth';
import { useLocalSearchParams } from 'expo-router';

export const PillMenu = memo(function PillMenu({ props, action }) {
    //console.log("pill menu")
    const theme = useTheme()
    const { router, setIsLoading } = useAuth();
    const [isActive, setIsActive] = useState(0)
    const refs = props.map(() => useRef(null));
    const elWidth = useSharedValue(0);
    const parentRef = useRef(null)
    const [isFirstRender, setIsFirstRender] = useState(true)

    const isHomeView = useLocalSearchParams().plate === undefined

    const translateX = useSharedValue(0)
    const activeStyle = useAnimatedStyle(() => {
        return {
            width: elWidth.value,
            transform: [{ translateX: translateX.value }],
        }
    })

    function playAnim() {
        refs[isActive].current.measureLayout(parentRef.current, (x, y, width, height) => {
            elWidth.value = withTiming(width),
                translateX.value = withSpring(x)
        }
        )
    }

    useEffect(() => {
        if (isFirstRender) {
            setTimeout(() => { playAnim() }, 100)
            setIsFirstRender(false)
        } else {
            playAnim()
        }
    }, [isActive, parentRef.current]);


    return (
        <View style={[theme.pillMenuContainer, {}]}>

            <View style={[theme.pillMenu, theme.shadowDefault, { alignSelf: 'stretch', justifyContent: 'center' }]}>
                {!isHomeView &&
                    <Pressable
                        style={[theme.pillMenu.pressable, { width: 48, alignItems: 'center', }]}
                        onPress={() => router.push("/plates")}>
                        <Icon name='home' color={theme.iconDark} size={16} />
                    </Pressable>
                }
            </View>
            <View style={{ alignSelf: 'stretch' }}>

                <View ref={parentRef} style={[theme.pillMenu, theme.shadowDefault]}>

                    <Animated.View style={[activeStyle, theme.pillMenuIndicator]} />

                    <FlatList
                        scrollEnabled={false}
                        horizontal={true}
                        contentContainerStyle={{ flexDirection: 'row', marginHorizontal: 20, }}
                        data={props}
                        renderItem={({ item, index }) =>
                            <Pressable
                                ref={refs[index]}
                                style={theme.pillMenu.pressable}
                                key={item.sorting}
                                onPress={() => [setIsActive(index), setIsLoading(true),
                                setTimeout(() => {
                                    action(item.sorting)
                                }, 100)
                                ]}>
                                <Text style={theme.pillMenuText}>{item.name}</Text>
                            </Pressable>
                        } />

                </View>
            </View>
        </View>
    )
})