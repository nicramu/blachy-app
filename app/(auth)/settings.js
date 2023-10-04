import { Text, View, Pressable, ActivityIndicator, Switch, TextBase } from 'react-native'
import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../contexts/auth";
import { useTheme } from "@react-navigation/native";
import { TextBody } from '../../components/StyledComponents';
import { ConfirmationModal } from '../../components/Modals';


const settings = () => {
  const theme = useTheme()
  const { user, router, signOut, isLoading, setIsLoading, setIsLightTheme, isLightTheme, storeTheme, i18n } = useAuth();

  const [token, setToken] = useState()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const functionToPass = useRef(null)
  const [question, setQuestion] = useState("")

  useEffect(() => {
    user &&
      getToken()
  }, [user])

  const getToken = async () => {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/gettoken`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user.token
      }
    })

    const res = await req.json()

    if (req.ok) {
      setToken(res.token)
    } else {
      alert(res.message)
    }
    setIsLoading(false)

  }

  async function deleteToken(token) {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/token/${token}`, {
      method: "DELETE",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user.token
      }
    })

    const res = await req.json()

    if (req.ok) {
      signOut()
    } else {
      alert(res.message)
    }
  }

  async function deleteUser() {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${user.username}`, {
      method: "DELETE",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user?.token
      }
    })

    const res = await req.json()

    if (req.ok) {
      alert(res.message)
    } else {
      alert(res.message)
    }
  }

  if (isLoading || !user) {
    return (
      <View style={theme.container}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }



  return (
    <View style={theme.container}>
      <View style={theme.wrapper}>

        <View style={[theme.plateTile, theme.shadowDefault, { marginHorizontal: 0 }]}>
          <TextBody>{i18n.t('username')}: {user.username}</TextBody>
          <TextBody>{i18n.t('role')}: {user.role}</TextBody>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, alignItems: 'center' }}>
            <TextBody>{i18n.t('toggledark')}</TextBody>
            <Switch
              onValueChange={() => [setIsLightTheme(prev => !prev), storeTheme(!isLightTheme)]}
              value={!isLightTheme}
            />
          </View>

          <Pressable onPress={() => router.push(`/user/${user.username}`)} style={theme.button}>
            <Text style={theme.buttonText}>{i18n.t('seemyprofile')}</Text>
          </Pressable>
        </View>

        {token &&
          <View style={[theme.plateTile, theme.shadowDefault, { marginHorizontal: 0 }]}>
            <TextBody style={{ fontWeight: 'bold' }}>{i18n.t('deletetoken')}</TextBody>
            <TextBody>value:{token.value.substr(0, 12)}...</TextBody>
            <TextBody>device: {token.device} </TextBody>
            <TextBody>ip: {token.ip} </TextBody>
            <TextBody>modified: {new Date(token.modified).toLocaleString()}</TextBody>
            <TextBody>created: {new Date(token.created).toLocaleString()}</TextBody>
            <Pressable style={[theme.button, { marginTop: 10 }]} onPress={() => deleteToken(token.value)}><Text style={theme.buttonText}>{i18n.t('delete')}</Text></Pressable>
          </View>
        }

        <View style={[theme.plateTile, theme.shadowDefault, { marginHorizontal: 0 }]}>
          <TextBody>{i18n.t('deletemyacc')}</TextBody>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, alignItems: 'center' }}>
            <TextBody>{i18n.t('deletemyacctoggle')}</TextBody>
            <Switch
              onValueChange={() => setConfirmDelete(prev => !prev)}
              value={confirmDelete}
            />
          </View>

          <Pressable disabled={!confirmDelete} onPress={() => [setIsVisible(true), functionToPass.current = deleteUser, setQuestion(i18n.t('deletemyaccdesc'))]} style={[theme.button, { display: confirmDelete ? 'flex' : 'none', backgroundColor: '#f44336' }]}>
            <Text style={theme.buttonText}>{i18n.t('deletemyacc')}</Text>
          </Pressable>
        </View>

        <Pressable style={[theme.buttonAlt, { marginTop: 20 }]} onPress={() => signOut()}>
          <Text style={theme.buttonAltText}>{i18n.t('logout')}</Text>
        </Pressable>


        <ConfirmationModal props={null} question={question} isVisible={isVisible} setIsVisible={setIsVisible} action={functionToPass.current} />

      </View>
    </View>
  )
}

export default settings