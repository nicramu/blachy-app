import { View, Text, Pressable, TextInput, Modal, KeyboardAvoidingView, Dimensions, Platform } from 'react-native'
import React, { useState, useRef, memo } from 'react'
import { useTheme } from "@react-navigation/native";
import { useAuth } from '../contexts/auth';
import { Plate, TextBody } from './StyledComponents';
import { router } from 'expo-router';

export const ClaimModal = memo(({ isVisible, setIsVisible, number, getPlate }) => {
  //console.log("ClaimModal modal")
  const theme = useTheme()
  const { user, router, i18n } = useAuth();
  const { height, width } = Dimensions.get('window');
  const registerDateInput = useRef()

  const [vin, setVin] = useState("")
  const [registerDate, setRegisterDate] = useState("")

  const handleRegisterDateValidation = (text) => {
    // Only allow numbers and dots
    const newText = text.replace(/[^0-9.]/g, '');
    // Split the text into parts separated by dots
    const parts = newText.split('.');
    // Only allow at most 3 parts
    if (parts.length > 3) {
      return;
    }
    // Only allow at most 2 digits in the first and second parts
    if (parts[0].length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }
    // Only allow at most 4 digits in the third part
    if (parts[2] && parts[2].length > 4) {
      return;
    }

    // Automatically add points when typing
    if (newText.length > registerDate.length) {
      if (parts[0].length === 2 && parts.length === 1) {
        parts.push('');
      }
      if (parts[1] && parts[1].length === 2 && parts.length === 2) {
        parts.push('');
      }
    }

    setRegisterDate(parts.join('.'));
  }


  async function claimPlate() {
    if (!vin || !registerDate || vin.length > 17) { return alert(i18n.t('novinanddateerror')) }

    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/plate/${number}/claim`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user.token
      },
      body: JSON.stringify({
        vin: vin,
        registerDate: registerDate,
      })
    })
    const res = await req.json()

    if (req.ok) {
      //console.log(res.message)
      getPlate()
      handleClose()
    } else {
      alert(res.message)
    }
  }

  function handleClose() {
    setIsVisible(false)
    setRegisterDate("")
    setVin("")
  }

  return (
    <Modal transparent={true} statusBarTranslucent={true} animationType='fade' visible={isVisible}>
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', flex: 1 }} >

        <Pressable onPress={() => handleClose()} style={{ height: '100%', width: '100%', position: 'absolute' }}>
        </Pressable>

        <KeyboardAvoidingView behavior={'position'} >
          <View style={[theme.shadowDefault, { width: width - 50, height: 500, backgroundColor: theme.modalBackground, borderRadius: 20 }]}>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignSelf: 'stretch', padding: 20, }}>

              <View style={{ justifyContent: 'flex-start', alignItems: 'center', }}>
                <Plate props={{ value: number }} />
                <TextBody style={{ paddingTop: 10 }}>
                  {i18n.t('claimdesc')}
                </TextBody>
              </View>

              <View style={{ justifyContent: 'center', }}>
                <TextBody>VIN:</TextBody>
                <TextInput
                  style={[theme.textInput, { marginBottom: 10 }]}
                  placeholderTextColor={theme.placeholder.color}
                  autoFocus={false}
                  autoCorrect={false}
                  blurOnSubmit={false}
                  keyboardType={'default'}
                  value={vin}
                  onChangeText={val => setVin(val.toUpperCase())}
                  onSubmitEditing={() => registerDateInput.current.focus()}
                  multiline={false}
                  maxLength={17}
                  placeholder={"VIN"} />
                <TextBody>{i18n.t('registerdate')} (dd.MM.yyyy):</TextBody>
                <TextInput
                  style={theme.textInput}
                  placeholderTextColor={theme.placeholder.color}
                  ref={registerDateInput}
                  autoFocus={false}
                  autoCorrect={false}
                  blurOnSubmit={false}
                  keyboardType={'numeric'}
                  value={registerDate}
                  onChangeText={handleRegisterDateValidation}
                  multiline={false}
                  placeholder={"dd.MM.yyyy"} />
              </View>

              <View style={{ justifyContent: 'flex-end', }}>
                <Pressable onPress={() => claimPlate()} style={theme.button}><Text style={theme.buttonText}>{i18n.t('sendforapproval')}</Text></Pressable>
              </View>

            </View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
})

export const ConfirmationModal = ({ isVisible, setIsVisible, question, action }) => {
  const theme = useTheme()
  const { i18n } = useAuth()
  return (
    <Modal transparent={true} statusBarTranslucent={true} animationType='fade' visible={isVisible}>
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', flex: 1 }} >

        <Pressable onPress={() => setIsVisible(false)} style={{ height: '100%', width: '100%', position: 'absolute' }}>
        </Pressable>

        <View style={[theme.shadowDefault, { width: 250, minHeight: 150, backgroundColor: theme.modalBackground, borderRadius: 20, }]}>
          <View style={{flexDirection: 'column', justifyContent: 'space-evenly', alignSelf: 'stretch', padding: 20 }}>
            <View style={{ alignItems: 'center', flexGrow:1, }}>
              <TextBody style={{ paddingVertical: 10, fontWeight: 'bold', textAlign: 'center' }}>
                {question}
              </TextBody>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row'}}>
              <Pressable onPress={() => [action(), setIsVisible(false)]} style={[theme.button, {}]}><Text style={theme.buttonText}>{i18n.t('yes')}</Text></Pressable>
              <Pressable onPress={() => setIsVisible(false)} style={[theme.button, {}]}><Text style={theme.buttonText}>{i18n.t('cancel')}</Text></Pressable>
            </View>
          </View>
        </View>

      </View>
    </Modal>
  )
}

export const InfoModal = ({ isVisible, setIsVisible, info }) => {
  const theme = useTheme()
  return (
    <Modal transparent={true} statusBarTranslucent={true} animationType='fade' visible={isVisible}>
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', flex: 1 }} >

        <Pressable onPress={() => setIsVisible(false)} style={{ height: '100%', width: '100%', position: 'absolute' }}>
        </Pressable>

        <View style={[theme.shadowDefault, { width: 250, height: 150, backgroundColor: theme.modalBackground, borderRadius: 20 }]}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignSelf: 'stretch', padding: 20 }}>
            <View style={{ alignItems: 'center', }}>
              <TextBody style={{ paddingVertical: 10, fontWeight: 'bold', textAlign: 'center' }}>
                {info}
              </TextBody>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'column', }}>
              <Pressable onPress={() => setIsVisible(false)} style={[theme.button, {}]}><Text style={theme.buttonText}>ok</Text></Pressable>
            </View>
          </View>
        </View>

      </View>
    </Modal>
  )
}

export function SearchModal({ isOpen, setOpen }) {

  const theme = useTheme()
  const [searchValue, setSearchValue] = useState("")
  const { user, i18n } = useAuth();
  const refSearch = useRef()
  const { height, width } = Dimensions.get('window');


  function handleOnShow() {
    setTimeout(() => {
      refSearch.current.focus()
      refSearch.current.clear()
    }, 100);
  }

  return (
    <Modal transparent={true} statusBarTranslucent={true} animationType='fade' visible={isOpen} onShow={() => handleOnShow()}>
      <KeyboardAvoidingView behavior={'padding'}>
        {Platform.OS !== "web" ?
          <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.7)', height: '100%', width: '100%' }} onPress={() => setOpen(false)} />
          :
          <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.7)', height: height, width: width }} onPress={() => setOpen(false)} />
        }
        <View style={[theme.shadowDefault, { width: '80%', height: 70, top: '50%', position: 'absolute', backgroundColor: theme.modalBackground, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', borderRadius: 20, }]}>
          <TextInput ref={refSearch}
            style={[theme.placeholder, { backgroundColor: 'transparent', flex: 1, alignSelf: 'stretch', textAlign: 'center', fontSize: 18, outline: 'none' }]}
            placeholderTextColor={theme.placeholder.color}
            value={searchValue}
            autoFocus={false}
            autoCorrect={false}
            enterKeyHint='search'
            onChangeText={val => setSearchValue(val.toUpperCase())}
            multiline={false}
            placeholder={i18n.t('searchplaceholder')}
            onSubmitEditing={() => [router.push(`/plate/${searchValue.toUpperCase().replace(/[\W_]*/gi, '')}`),
            setOpen(false)]} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}