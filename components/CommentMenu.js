import { View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from "@react-navigation/native";
import { useAuth } from '../contexts/auth';
import { CommentButton } from './StyledComponents';
import { ConfirmationModal } from './Modals';

export const CommentMenu = ({ props, getPlate }) => {
  //const [shouldRefresh, setShouldRefresh] = useState(false)
  const [comment, setComment] = useState(props)
  const theme = useTheme()
  const { user, guest, i18n } = useAuth();
  const [isVisible, setIsVisible] = useState(false)
  const functionToPass = useRef(null)
  const [question, setQuestion] = useState("")

  useEffect(() => {
    setComment(props)
  }, [props])

  async function handleDelete() {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/${props._id}`, {
      method: "DELETE",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user?.token
      }
    })

    const res = await req.json()

    if (req.ok) {
      //console.log(res.message)
      getPlate()
      /*  TODO: modify current state instead of making new request
           setComment({
              ...comment,
              value: "deleted"
            }) */
    } else {
      alert(res.message)
    }
  }

  async function handleReport() {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/${props._id}/report`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user ? user.id : guest
      })
    })

    const res = await req.json()

    if (req.ok) {
      setComment({
        ...comment,
        flagged: {
          ...comment.flagged,
          flaggedBy: [...comment.flagged.flaggedBy, user ? user.id : guest]
        }
      })
    } else {
      alert(res.message)
    }
  }


  async function handleHide() {
    const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/${props._id}/hide`, {
      method: "POST",
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        "Content-Type": "application/json",
        "Authorization": user?.token
      }
    })

    const res = await req.json()

    if (req.ok) {
      //console.log(res.message)
      getPlate()
    } else {
      alert(res.message)
    }
  }

  return (
    <View style={{ marginTop: 10, alignItems: 'flex-end', flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row' }}>
        {(user?.id === comment.author._id || user?.role === "Admin" || user?.role === "Moderator") &&
          <CommentButton props={comment} onPress={() => [setIsVisible(true), functionToPass.current = handleDelete, setQuestion(i18n.t('deleteconfirmation'))]} icon={"delete"} title={i18n.t('delete')} />
        }
        {!comment.flagged.flaggedBy.includes(user?.id || guest) &&
          <CommentButton props={comment} onPress={() => [setIsVisible(true), functionToPass.current = handleReport, setQuestion(i18n.t('reportconfirmation'))]} icon={"flag"} title={i18n.t('report')} />
        }
        {(user?.role === "Admin" || user?.role === "Moderator") &&
          <CommentButton props={comment} onPress={() => [setIsVisible(true), functionToPass.current = handleHide, setQuestion(i18n.t('hideconfirmation'))]} icon={"eye"} title={i18n.t('hide')} />
        }
      </View>

      <ConfirmationModal props={props} question={question} isVisible={isVisible} setIsVisible={setIsVisible} action={functionToPass.current} />

    </View>
  )
}