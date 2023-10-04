import { View, Text, FlatList, Pressable, TextInput } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from "@react-navigation/native";
import { useAuth } from '../contexts/auth';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { Voting } from './Voting';
import { Header, Divider, PlateTile, Plate, TextBody } from './StyledComponents';
import { AddComment } from './AddComment';
import { PlateComments } from './Lists';
import { ClaimModal, InfoModal } from './Modals';

const ActionsMenu = ({ item, getPlate }) => {
  const theme = useTheme()
  const { user, guest, i18n } = useAuth();
  const [isVisible, setIsVisible] = useState(false)
  const [isDescChangeVisible, setIsDescChangeVisible] = useState(false)

  const txtArea = useRef()
  const [plateDescription, setPlateDescription] = useState(item.description ? item.description : "")
  const [descEditable, setDescEditable] = useState(false)

  async function changeDescription() {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/plate/${item.value}/setDesc`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user.token
      },
      body: JSON.stringify({
        description: plateDescription.trim(),
      })
    })

    const res = await req.json()

    if (req.ok) {
      setIsDescChangeVisible(true)
    } else {
      alert(res.message)
    }
  }

  const ClaimButton = () => {
    if (item.owner?.user?.username) {
      return //claimed
    } else if (item.owner.requestedBy?.includes(user?.id)) {
      return <Pressable style={[theme.plateMenu]} ><Icon name="send-clock" size={24} color={theme.iconDark} /></Pressable>
    } else {
      return <Pressable style={[theme.plateMenu]} onPress={() => setIsVisible(true)}><Icon name="check-decagram-outline" size={24} color={theme.iconDark} /></Pressable>
    }
  }

  const NotifyButton = () => {
    return <Pressable style={[theme.plateMenu]} onPress={() => setIsVisible(true)}><Icon name="bell" size={24} color={theme.iconDark} /></Pressable>
  }

  const QrButton = () => {
    return <Pressable style={[theme.plateMenu]} onPress={() => setIsVisible(true)}><Icon name="qrcode" size={24} color={theme.iconDark} /></Pressable>
  }

  const EditButton = () => {
    if (item.owner?.user?._id === user?.id || (user?.role === "Admin" || user?.role === "Moderator")) {
      if (!descEditable) {
        return <Pressable style={[theme.plateMenu]} onPress={() => [setDescEditable(true),]}><Icon name="note-edit" size={24} color={theme.iconDark} /></Pressable>
      } else {
        return <Pressable style={[theme.plateMenu]} onPress={() => [setDescEditable(false), changeDescription()]}><Icon name="note-check" size={24} color={theme.iconDark} /></Pressable>

      }
    }
  }

  useEffect(() => {
    if (descEditable) {
      txtArea.current.focus()
    }
  }, [descEditable])

  const adjustTextInputSize = () => {
    const el = txtArea.current
    if (el.scrollHeight) {
      el.style.height = 0;
      el.style.height = el.scrollHeight + 'px'
    }
  };

  const handleNewLines = (text) => {
    setPlateDescription(text.replace(/[\r\n]+/g, "").replace(/\s{2,}/g, ""))
  }

  return (
    <View style={{ flexDirection: 'column', }}>
      {(plateDescription || descEditable) &&
        <TextInput
          onChangeText={handleNewLines}
          value={plateDescription}
          placeholder={i18n.t('adddesc')}
          onChange={adjustTextInputSize}
          onLayout={adjustTextInputSize}
          maxLength={300}
          multiline
          ref={txtArea}
          editable={descEditable}
          style={[theme.placeholder, { fontSize: 14 }, descEditable ? theme.textInput : { outline: 'none' }, { marginTop: 5, textAlign: 'center', padding: 5 }]}
        ></TextInput>}
      <View style={{ flexDirection: 'row', marginTop: 5, alignSelf: 'center' }}>
        {user && <ClaimButton />}
        {/*  //TODO       <NotifyButton />*/}
        {/*  //TODO   <QrButton />*/}
        {user && <EditButton />}
      </View>
      <ClaimModal number={item.value} isVisible={isVisible} setIsVisible={setIsVisible} getPlate={getPlate} />
      <InfoModal info={i18n.t('descsaved')} isVisible={isDescChangeVisible} setIsVisible={setIsDescChangeVisible} />

    </View>
  )
}

export const PlateBlock = function PlateBlock({ item, showVoting, showAddComment, showActions, getPlate, toTop, ScrollToX }) {
  const plate = item
  const theme = useTheme()
  const { user, guest, i18n } = useAuth();
  const renderComment = ({ item }) => { return (<PlateComments item={item} ownerId={plate?.owner?.user?._id} getPlate={getPlate} />) }
  const [itemsToRender, setItemsToRender] = useState([0, 10, 1])

  return (
    <PlateTile>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', flexShrink: 1 }}>

          {item.owner?.user?.username &&
            <Link href={`/user/${item.owner?.user?.username}`}>
              <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                <Icon name="check-decagram" style={{ marginRight: 5 }} size={18} color={theme.iconDark} />
                <TextBody style={{ flexShrink: 1, fontSize: 14 }}>{item.owner.user.username}</TextBody>
              </View>
            </Link>
          }
          <View style={{ alignItems: 'center', flexDirection: 'row', }}>
            <Icon name="eye" style={{ marginRight: 5 }} size={18} color={theme.iconDark} />
            <TextBody style={{ flexShrink: 1, fontSize: 14 }} >{item?.views?.value}</TextBody>
            <Icon name="qrcode-scan" style={{ marginRight: 5, marginLeft: 10 }} size={18} color={theme.iconDark} />
            <TextBody style={{ flexShrink: 1, fontSize: 14 }} >{item?.views?.qrScan}</TextBody>
          </View>
          {item?.geodata?.region &&
            <View style={{ alignItems: 'center', flexDirection: 'row', }}>
              <Icon name="map-marker-radius" style={{ marginRight: 5 }} size={18} color={theme.iconDark} />
              <TextBody style={{ flexShrink: 1, fontSize: 14 }} >{item.geodata.region}</TextBody></View>}
        </View>

        <View style={{ flexDirection: 'row', height: 30, alignSelf: 'flex-start' }}>
          {showVoting && <Voting item={item} type={"plate"} getPlate={null} />}
        </View>
      </View>

      <View style={{ flexDirection: 'column', marginVertical: 10, alignSelf: 'stretch', }}>
        <Link style={{ display: 'flex', alignSelf: 'center' }} href={`/plate/${item.value}`}>
          <Plate props={item} width={200} height={50} />
        </Link>

        {showActions &&
          <ActionsMenu item={item} getPlate={getPlate} />
        }
      </View>

      <Header >
        <Text>{i18n.t('comments')}{item.commentCount ? ` (${item.commentCount})` : ` (${item.comments?.length ? item.comments?.length : "0"})`}:</Text>
      </Header>

      <Divider />

      {showAddComment && <AddComment props={item} getPlate={getPlate} ScrollToX={ScrollToX} />}

      <FlatList
        data={item.comments?.slice(itemsToRender[0], itemsToRender[1])}
        renderItem={renderComment}
        keyExtractor={comment => comment._id}
        initialNumToRender={10}
        windowSize={3}
        ListFooterComponent={
          !item.commentCount &&
          <View style={{ paddingVertical: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {Array.from({ length: Math.ceil(item.comments.length / 10) }, (_, i) => i + 1).map((item) => (
                <Pressable key={item} style={[theme.button, item === itemsToRender[2] && theme.buttonAlt]} onPress={() => [setItemsToRender([item * 10 - 10, item * 10, item]), toTop()]}>
                  <Text style={[{ textAlign: 'center' }, theme.buttonText, item === itemsToRender[2] && theme.buttonAltText, { fontWeight: 'bold' }]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />
    </PlateTile>
  )
}