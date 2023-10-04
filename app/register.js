import { Animated, Platform, Text, View, TextInput, useWindowDimensions, Pressable, KeyboardAvoidingView } from 'react-native';
import { useState, useRef } from 'react';
import * as Device from 'expo-device';
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../contexts/auth";
import { TextBody, TextHeader } from '../components/StyledComponents';

export default function register() {
  const theme = useTheme()
  const { width, height } = useWindowDimensions()

  const { signIn, router, i18n } = useAuth();

  const [usernameRegister, setUsernameRegister] = useState("")
  const usernameRegisterRef = useRef()
  const [passwordRegister, setPasswordRegister] = useState("")
  const passwordRegisterRef = useRef()

  const [usernameLogin, setUsernameLogin] = useState("")
  const usernameLoginRef = useRef()
  const [passwordLogin, setPasswordLogin] = useState("")
  const passwordLoginRef = useRef()

  const handleRegister = async () => {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRegister,
        password: passwordRegister,
        device: Device.deviceName == null ? "web" : Device.deviceName
      })
    })

    const res = await req.json()

    if (req.ok) {
      //console.log(res.message)
      signIn({ id: res.id, username: res.username, token: res.token, role: res.role })
    } else {
      alert(res.message)
    }
  };

  const handleLogin = async () => {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameLogin,
        password: passwordLogin,
        device: Device.deviceName == null ? "web" : Device.deviceName
      })
    })

    const res = await req.json()

    if (req.ok) {
      //console.log(res.message)
      signIn({ id: res.id, username: res.username, token: res.token, role: res.role })
    } else {
      alert(res.message)
    }
  }

  const [currentTab, setCurrentTab] = useState(1)

  const cardsPan1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  const cardsPan2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current

  const setTab = (register) => {
    if (register) {
      Animated.spring(cardsPan1, {
        toValue: { x: 0, y: 0 },
        duration: 100,
        bounciness: 5,
        useNativeDriver: true,
      }).start();
      Animated.spring(cardsPan2, {
        toValue: { x: 0, y: 0 },
        duration: 100,
        bounciness: 5,
        useNativeDriver: true,
      }).start();
      setCurrentTab(1)
    } else {
      Animated.spring(cardsPan1, {
        toValue: { x: 10, y: 20 },
        duration: 100,
        bounciness: 5,
        useNativeDriver: true,
      }).start();
      Animated.spring(cardsPan2, {
        toValue: { x: -10, y: -20 },
        duration: 100,
        bounciness: 5,
        useNativeDriver: true,
      }).start();
      setCurrentTab(0)
    }
  };

  return (
    <KeyboardAvoidingView style={theme.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <View style={{ flexDirection: 'column' }}>
        <View style={[theme.loginButtonsBack, {
          width: width * 0.7,
          height: 60
        }]}>
          <Pressable style={[theme.button, { flex: 1, marginVertical: 4, marginLeft: 4, marginRight: 2 }]} onPress={() => setTab(true, false)}><Text style={currentTab == 1 ? theme.buttonSecondaryTextSelected : theme.buttonSecondaryTextDeSelected}>{i18n.t('register')}</Text></Pressable>
          <Pressable style={[theme.button, { flex: 1, marginVertical: 4, marginLeft: 2, marginRight: 4 }]} onPress={() => setTab(false, true)}><Text style={currentTab == 0 ? theme.buttonSecondaryTextSelected : theme.buttonSecondaryTextDeSelected}>{i18n.t('login')}</Text></Pressable>
        </View>

        <Animated.View style={[theme.loginPanel, {
          width: width * 0.7,
          transform: cardsPan1.getTranslateTransform(), zIndex: currentTab,
          position: 'absolute', top: 70, flexDirection: 'column',
        }]}>
          <TextHeader>{i18n.t('register')}</TextHeader>
          <View>
            <TextBody style={{ marginBottom: 4 }}>{i18n.t('username')}:</TextBody>
            <TextInput style={theme.textInput}
              autoCorrect={false}
              enterKeyHint={'next'}
              autoCapitalize={'none'}
              maxLength={33}
              ref={usernameRegisterRef}
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRegisterRef.current.focus()}
              value={usernameRegister} onChangeText={value => setUsernameRegister(value)} />
          </View>
          <View>
            <TextBody style={{ marginBottom: 4 }}>{i18n.t('password')}:</TextBody>
            <TextInput style={theme.textInput}
              autoCorrect={false}
              enterKeyHint={'done'}
              autoCapitalize={'none'}
              maxLength={64}
              secureTextEntry={true}
              ref={passwordRegisterRef}
              blurOnSubmit={false}
              onSubmitEditing={() => handleRegister()}
              value={passwordRegister} onChangeText={value => setPasswordRegister(value)} />
          </View>
          <Pressable style={[theme.button]} onPress={() => handleRegister()}><Text style={theme.buttonText}>{i18n.t('register')}</Text></Pressable>
          <Pressable style={[theme.button]} onPress={() => router.push("/plates")}><Text style={theme.buttonText}>{i18n.t('asguest')}</Text></Pressable>
        </Animated.View>

        <Animated.View style={[theme.loginPanel, {
          width: width * 0.7,
          transform: cardsPan2.getTranslateTransform(),
          position: 'relative', top: 30, left: 10,
        }]}>
          <TextHeader>{i18n.t('login')}</TextHeader>
          <View>
            <TextBody style={{ marginBottom: 4 }}>{i18n.t('username')}:</TextBody>
            <TextInput style={theme.textInput}
              autoCorrect={false}
              enterKeyHint={'next'}
              autoCapitalize={'none'}
              maxLength={33}
              ref={usernameLoginRef}
              blurOnSubmit={false}
              onSubmitEditing={() => passwordLoginRef.current.focus()}
              value={usernameLogin} onChangeText={value => setUsernameLogin(value)} />
          </View>
          <View>
            <TextBody style={{ marginBottom: 4 }}>{i18n.t('password')}:</TextBody>
            <TextInput style={theme.textInput}
              autoCorrect={false}
              enterKeyHint={'done'}
              autoCapitalize={'none'}
              maxLength={64}
              secureTextEntry={true}
              ref={passwordLoginRef}
              blurOnSubmit={false}
              onSubmitEditing={() => handleLogin()}
              value={passwordLogin} onChangeText={value => setPasswordLogin(value)} />
          </View>
          <Pressable style={[theme.button]} onPress={() => handleLogin()}><Text style={theme.buttonText}>{i18n.t('login')}</Text></Pressable>
        </Animated.View>

      </View>
    </KeyboardAvoidingView>
  );
}