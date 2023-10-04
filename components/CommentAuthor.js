import { View } from 'react-native'
import React, { } from 'react'
import { useTheme } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { TextBody } from './StyledComponents';

export const CommentAuthor = function CommentAuthor({ item, ownerId, hideUser }) {
  const theme = useTheme()

  if (item.author.role === 'Guest' && !hideUser) {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <TextBody>{item.author.username.substring(item.author.username.length - 36, 0)}</TextBody>
          <TextBody style={{ marginLeft: 5 }}>({item.author.role})</TextBody>
        </View>
        <View>
          <TextBody style={theme.textVariants.timestamp}>{new Date(item.date).toLocaleString()}</TextBody>
        </View>
      </View>
    )
  } else if (item.author.role !== 'Guest' && !hideUser) {
    return (
      <Link href={`/user/${item.author.username}`}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {ownerId === item.author._id && <Icon name="check-decagram" style={{ marginRight: 2, }} size={14} color={theme.iconDark} />}
            <TextBody style={theme.textVariants.username}>{item.author.username}</TextBody>
            <TextBody style={{ marginLeft: 5 }}>({item.author.role})</TextBody>
          </View>
          <View>
            <TextBody style={theme.textVariants.timestamp}>{new Date(item.date).toLocaleString()}</TextBody>
          </View>
        </View>
      </Link>
    )
  } else {
    return (<TextBody style={theme.textVariants.timestamp}>{new Date(item.date).toLocaleString()}</TextBody>)
  }

}