import { View, Text, Pressable } from 'react-native'
import React, { useState, useRef, useCallback, } from 'react'
import { useTheme } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/auth';
import { SearchModal } from './Modals';

export function UserMenu() {
  const { user, router } = useAuth();
  const theme = useTheme()

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const toggleSearchModal = useCallback(() => {
    setIsSearchModalOpen(prevIsSearchModalOpen => !prevIsSearchModalOpen);
  }, [isSearchModalOpen]);

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', height: '100%', }}>
      <SearchModal isOpen={isSearchModalOpen} setOpen={toggleSearchModal} />
      {(user?.role === 'Admin' || user?.role === 'Moderator') &&
        <Pressable style={{ alignSelf: 'stretch', justifyContent: 'center', marginHorizontal: 5, }} onPress={() => router.push("/(auth)/moderation")} >
          <Icon name='progress-wrench' color={theme.iconLight} size={36} />
        </Pressable>
      }
      <Pressable style={{ alignSelf: 'stretch', justifyContent: 'center', marginHorizontal: 5, }} onPress={() => setIsSearchModalOpen(true)} >
        <Icon name='card-search' color={theme.iconLight} size={36} />
      </Pressable>
      {user ?
        <Pressable style={{ alignSelf: 'stretch', justifyContent: 'center', marginHorizontal: 5 }} onPress={() => router.push("/(auth)/settings")}>
          <Text><Icon name='account-settings' color={theme.iconLight} size={36} /></Text>
        </Pressable>
        :
        <Pressable style={{ alignSelf: 'stretch', justifyContent: 'center', marginHorizontal: 5 }} onPress={() => router.push("/register")}>
          <Text><Icon name='account-settings' color={theme.iconLight} size={36} /></Text>
        </Pressable>
      }
    </View>
  )
}