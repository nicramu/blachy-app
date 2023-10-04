import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { useTheme } from "@react-navigation/native";
import { PillMenu } from '../../components/PillMenu';
import { useAuth } from '../../contexts/auth';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { PlateBlock } from '../../components/PlateBlock';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, } from 'react-native-reanimated';

export function plate() {

  const { user, guest, setIsLoading, isLoading, router, i18n } = useAuth()
  const { plate, qr } = useLocalSearchParams()
  const [plateData, setPlateData] = useState(null)
  const [isCommentAdded, setIsCommentAdded] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    //clear current data
    setPlateData(null);
    //get the new data
    getPlateFromUrl()
  }, [plate]);

  useEffect(() => {
    if (isCommentAdded) {
      getPlateFromUrl()
    }
  }, [isCommentAdded])

  const setCommentsSorting = useCallback(
    (sorting) => {
      //console.log(sorting)
      if (sorting === "best") {
        setPlateData(prevData => ({
          ...prevData,
          comments: [...prevData.comments].sort((a, b) => b.points.value - a.points.value)
        }))

      } else if (sorting === "latest") {
        setPlateData(prevData => ({
          ...prevData,
          comments: [...prevData.comments].sort((a, b) => new Date(b.date) - new Date(a.date))
        }))

      }
      setIsLoading(false)
    },
    [],
  )

  async function getPlateFromUrl() {
    //console.log("getting plates")
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/plate/${plate}?qr=${qr}`, {
      method: "GET",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user ? user.id : guest
      }
    })
    const res = await req.json()

    if (req.ok) {
      setPlateData(res.plate)
      //console.log(res.plate)
    } else {
      router.replace("/plate/404")
      //setPlateData({ value: plate })
    }
    setIsCommentAdded(false)
    setIsLoading(false)
  }

  const scrollViewRef = useRef(null);
  const toTop = () => {
    // Scroll to the target element
    scrollViewRef.current.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const ScrollToX = (x) => {
    // Scroll to the target element
    scrollViewRef.current.scrollTo({
      y: x,
      animated: true,
    });
  };


  const toTopOpacity = useSharedValue(0)
  const toTopDisplay = useSharedValue('none')
  const toTopOpacityStyle = useAnimatedStyle(() => { return { opacity: withTiming(toTopOpacity.value) } })
  const toTopDisplayStyle = useAnimatedStyle(() => { return { display: toTopDisplay.value } })


  //console.log("plate screen render", plate)
  return (
    <View style={theme.container} >
      <Animated.View style={[theme.shadowDefault, theme.floatingButton, toTopOpacityStyle, toTopDisplayStyle]}>
        <Pressable onPress={() => toTop()}>
          <Icon name="arrow-up-bold" size={48} color={theme.iconLight} style={{ alignSelf: 'center' }} />
        </Pressable>
      </Animated.View>

      {plateData?.comments && <PillMenu action={setCommentsSorting} props={[{ name: i18n.t('latest'), sorting: 'latest' }, { name: i18n.t('best'), sorting: 'best' }]} />}

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{ paddingTop: 75, paddingBottom: 90 }}
        scrollEventThrottle={1000}
        onScroll={(event) => { if (event.nativeEvent.contentOffset.y > 370) { toTopOpacity.value = 1; toTopDisplay.value = 'flex' } else { toTopOpacity.value = 0; setTimeout(() => { toTopDisplay.value = 'none' }, 100) } }}
      >
        {isLoading && <ActivityIndicator size={'large'} />}
        {plateData && !isLoading &&
          <PlateBlock item={plateData} showActions={true} showAddComment={true} showVoting={true} getPlate={getPlateFromUrl} toTop={toTop} ScrollToX={ScrollToX} />
        }
      </ScrollView>

    </View>
  )
}
export default plate