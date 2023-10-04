import { View, Text, FlatList, Pressable, Image } from 'react-native'
import React, { } from 'react'
import { useTheme } from "@react-navigation/native";
import { Plate, PlateComment, TextBody } from './StyledComponents';
import { CommentMenu } from './CommentMenu';
import { Link, router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Voting } from './Voting';
import { CommentAuthor } from './CommentAuthor';
import { PlateBlock } from './PlateBlock';

export const PlateList = ({ item,getPlate }) => {
  //console.log("render post")
  return (
    <PlateBlock key={item._id} item={item} getPlate={getPlate} showVoting={true} showAddComment={false} showActions={false} />
  )
}

export const PlateComments = ({ item, ownerId, showPlate, hideUser, getPlate }) => {
  const theme = useTheme()
  return (
    <PlateComment>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ flexDirection: 'column', flexShrink: 1 }}>
          <CommentAuthor item={item} ownerId={ownerId} hideUser={hideUser} />
        </View>

        <View style={{ flexDirection: 'row', height: 30, alignSelf: 'flex-start' }}>
          <Voting item={item} type={"comment"} getPlate={null} />
        </View>
      </View>

      {showPlate &&
        <Link style={{ alignSelf: 'center', marginBottom: 20 }} href={`/plate/${item.plate.value}`}>
          <Plate props={item.plate} height={45} width={150} />
        </Link>
      }
      <TextBody selectable={true}>{item.value}</TextBody>
      {item?.media?.links?.length > 0 &&
        <FlatList data={item.media.links} contentContainerStyle={{ marginTop: 5, marginHorizontal: 5 }} horizontal renderItem={({ item }) =>
          <Pressable onPress={() => router.push(item)} style={[theme.button, { paddingHorizontal: 10, paddingVertical: 5, maxWidth: 90, marginHorizontal: 2, alignItems: 'center', flexDirection: 'row' }]}>
            <Icon name='link-variant' size={14} style={{ marginRight: 2 }} />
            <Text numberOfLines={1} style={[theme.textVariants.body, { fontWeight: 'bold', fontSize: 14 }]} ellipsizeMode='tail'>
              {item?.split(".")[1]}</Text>
          </Pressable>
        } />
      }
      {item?.media?.image &&
        <Pressable style={{ alignSelf: 'flex-start', marginTop: 5 }} onPress={() => router.push(item.media.image)} >
          <Image source={{ uri: item?.media?.image }} style={{ width: 200, height: 200, borderRadius: 20 }} />
        </Pressable>
      }
      <CommentMenu props={item} getPlate={getPlate} />
    </PlateComment>
  )
}