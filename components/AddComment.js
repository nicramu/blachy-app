import { View, TextInput, Pressable, Text, ActivityIndicator, Image } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../contexts/auth";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { InfoModal } from './Modals';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { TextBody } from './StyledComponents';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


export function AddComment({ props, getPlate, ScrollToX }) {
  const theme = useTheme()
  const { user, guest, i18n } = useAuth()
  const [commentValue, setCommentValue] = useState("")
  const [guestName, setGuestName] = useState("")
  const commentInputRef = useRef()
  const [isVisible, setIsVisible] = useState(false)
  const question = useRef("")
  const [disableAddComment, setDisableAddComment] = useState(false)
  const addCommentBoxPosition = useRef()
  const [image, setImage] = useState(null);

  useEffect(() => {
    setDisableAddComment(false)
  }, [props])

  const compressImage = async (img) => {
    //console.log(img.uri)
    const manipResult = await manipulateAsync(
      img.localUri || img.uri,
      [{ resize: { height: img.height / 2, width: img.width / 2 } }],
      { compress: 0.5, format: SaveFormat.JPEG, base64: true }
    );
    setImage(manipResult);
  }


  const handleAddComment = async () => {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/plate/${props.value}/addComment`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: user?.token,
        guestName: guestName,
        guestId: guest,
        comment: commentValue,
        image: image ? image.base64 : null
      })
    })

    const res = await req.json()

    if (req.ok) {
      // console.log(res.message)
      setDisableAddComment(true)
      clearPickedImage()
      setCommentValue("")
      setGuestName("")
      getPlate()
    } else {
      alert(res.message)
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true
    });

    if (!result.canceled) {
      await compressImage(result.assets[0])
    }
  };

  const clearPickedImage = async () => {
    setImage(null);
  }

  if (disableAddComment) { return <ActivityIndicator size={'large'} /> }


  return (
    <View>

      {!user &&
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextBody>{i18n.t('username')}: </TextBody>
          <TextInput
            style={[theme.addComment.textInput, { flex: 1, height: 'auto', padding: 15 }]}
            placeholderTextColor={theme.placeholder.color}
            maxLength={33}
            placeholder={i18n.t('usernameplaceholder')}
            multiline={false}
            value={guestName}
            onSubmitEditing={() => commentInputRef.current.focus()}
            onChangeText={text => setGuestName(text)}
          />
        </View>
      }

      <View style={[theme.plateComment, { flexDirection: 'column' }]}>
        <TextInput
          ref={commentInputRef}
          //blurOnSubmit={false} 
          onLayout={() => commentInputRef.current.measure((fx, fy, width, height, px, py,) => { addCommentBoxPosition.current = py })}
          onFocus={() => ScrollToX(addCommentBoxPosition.current / 2)}
          placeholder={i18n.t('commentplaceholder')}
          style={[theme.addComment.textInput, { flex: 1, outline: 'none', textAlignVertical: 'top', marginBottom: 10 }]}
          placeholderTextColor={theme.placeholder.color}
          multiline={true}
          numberOfLines={5}
          maxLength={500}
          value={commentValue}
          onChangeText={text => setCommentValue(text)} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 50 }}>
          {/*      TODO add image  */}
          <Pressable style={[theme.button, { flex: 1, marginHorizontal: 2, alignItems: 'center' }]} onPress={pickImage}>
            <Text><Icon name="image" color={theme.iconDark} size={32} /></Text>
          </Pressable>

          <Pressable style={[theme.button, { flex: 2, marginHorizontal: 2, alignItems: 'center' }]} onPress={handleAddComment}>
            <Text><Icon name="send-circle" color={theme.iconDark} size={32} /></Text>
          </Pressable>
        </View>

        <Pressable style={{ marginTop: 15 }} onPress={() => [setIsVisible(true), question.current = i18n.t('allowedurls')]}>
          <TextBody style={{ fontSize: 14 }}><Icon name={"information"} style={[theme.commentMenu.icon, { marginRight: 5 }]} />{commentValue?.length}/500</TextBody>
        </Pressable>

        {image &&
          <View style={[{ alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }]}>
            <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, borderRadius: 20 }} />
            <Pressable style={theme.button} onPress={clearPickedImage}>
              <Text><Icon name="delete" color={theme.iconDark} size={32} /></Text>
            </Pressable>
          </View>
        }


      </View>
      <InfoModal info={question.current} isVisible={isVisible} setIsVisible={setIsVisible} />

    </View>
  )
}