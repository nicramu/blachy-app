import { ActivityIndicator, ScrollView, Text, View, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/auth";
import { useTheme } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { TextBody } from '../../components/StyledComponents';

export default function moderation() {
    const theme = useTheme()
    const { user, isLoading, setIsLoading } = useAuth();
    const [reportedComments, setReportedComments] = useState()
    const [plateClaims, setPlateClaims] = useState()
    const [hiddenComments, setHiddenComments] = useState()
    const [users, setUsers] = useState()

    async function getReportedComments() {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reportedComments`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user.token
            }
        })
        const res = await req.json()

        if (req.ok) {
            setReportedComments(res.comments)
        } else {
            alert(res.message)
        }
    }

    async function getPlateClaims() {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/plateClaims`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user.token
            }
        })
        const res = await req.json()

        if (req.ok) {
            //console.log(res.claims)
            setPlateClaims(res.claims)
        } else {
            alert(res.message)
        }
    }

    async function getHiddenComments() {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/hiddenComments`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user.token
            }
        })
        const res = await req.json()

        if (req.ok) {
            //console.log(res.comments)
            setHiddenComments(res.comments)
        } else {
            alert(res.message)
        }
    }

    async function getUsers() {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user.token
            }
        })
        const res = await req.json()

        if (req.ok) {
            setUsers(res.users)
            // console.log(res.users)
        } else {
            alert(res.message)
        }
    }

    useEffect(() => {
        if (user) {
            getReportedComments()
            getPlateClaims()
            getHiddenComments()
            getUsers()
        }
    }, [])

    useEffect(() => {
        if (plateClaims && reportedComments && hiddenComments && users) {
            setIsLoading(false)
        }
    }, [plateClaims, reportedComments, hiddenComments, users])


    async function handleHide(item) {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/${item._id}/hide`, {
            method: "POST",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user?.token
            }
        })

        const res = await req.json()

        if (req.ok) {
            //  console.log(res.message)  
            getHiddenComments()
            getReportedComments()
        } else {
            alert(res.message)
        }
    }
    async function handleShow(item) {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/${item._id}/unhide/`, {
            method: "POST",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user?.token
            },

        })

        const res = await req.json()

        if (req.ok) {
            getHiddenComments()
            getReportedComments()
            //console.log(res.message)
        } else {
            alert(res.message)
        }
    }

    async function handleDelete(item) {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/${item._id}`, {
            method: "DELETE",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user?.token
            }
        })

        const res = await req.json()

        if (req.ok) {
            getReportedComments()
            getHiddenComments()
        } else {
            alert(res.message)
        }
    }

    async function handleClaim(item, action) {
        let reqURL = `${process.env.EXPO_PUBLIC_API_URL}/claim/${item._id}/${action}`
        const req = await fetch(reqURL, {
            method: "POST",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
                "Authorization": user?.token
            },

        })

        const res = await req.json()

        if (req.ok) {
            getPlateClaims()
            // console.log(res.message)
        } else {
            alert(res.message)
        }
    }


    if (isLoading) { return (<ActivityIndicator size={'large'} />) }

    return (
        <View style={theme.container}>
            <ScrollView style={{}} >
                <View style={[theme.plateTile, theme.shadowDefault, { marginTop: 20, maxHeight: 500 }]}>
                    <Text style={theme.textVariants.header}>plate claims</Text>
                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={plateClaims}
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        renderItem={({ item }) =>
                            <View style={[theme.plateComment, { flexDirection: 'row' }]}>
                                <View style={{ width: 48 }}>
                                    <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleClaim(item, "approve")}><Icon name="checkbox-marked" size={32} color={theme.iconDark} /></Pressable>
                                </View>
                                <View style={{ flex: 1, marginHorizontal: 10 }}>
                                    <Link href={`/plate/${item.plateValue}`}><TextBody>plate: {item.plateValue}</TextBody></Link>
                                    <Link href={`/user/${item.user.username}`}><TextBody>user: {item.user.username}</TextBody></Link>
                                    <TextBody>VIN: {item.vin}</TextBody>
                                    <TextBody>register date: {item.registerDate}</TextBody>
                                </View>
                                <View style={{ width: 48 }}>
                                    <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleClaim(item, "reject")}><Icon name="close-box" size={32} color={theme.iconDark} /></Pressable>
                                </View>
                            </View>
                        }

                    />
                </View>

                <View style={[theme.plateTile, theme.shadowDefault, { marginVertical: 20, maxHeight: 500 }]}>
                    <Text style={theme.textVariants.header}>reported comments ({reportedComments?.length})</Text>
                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={reportedComments}
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        renderItem={({ item }) =>
                            <View style={[theme.plateComment, { flexDirection: 'row' }]}>
                                <View style={{ flex: 0, flexShrink: 1, minWidth: 48, }}>
                                    <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleShow(item)}><Icon name="reload" size={32} color={theme.iconDark} /></Pressable>
                                </View>
                                <View style={{ flex: 1, marginHorizontal: 10 }}>
                                    <Link href={`/plate/${item.plate.value}`}><TextBody>{item.plate.value} | flagged: {item.flagged.value} | visible: {item.visible ? "yes" : "no"}</TextBody></Link>
                                    <Link href={`/user/${item.author.username}`}><TextBody>{item.author.role === "Guest" ? item.author.username.substring(item.author.username.length - 36, 0) : item.author.username} ({item.author.role})</TextBody></Link>
                                    <TextBody>{new Date(item.date).toLocaleString()}</TextBody>
                                    <TextBody>{item.value}</TextBody>
                                </View>
                                <View style={{ flex: 0, flexShrink: 1, minWidth: 48, alignSelf: 'center', alignItems: 'center' }}>
                                    {item.visible === true ?
                                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleHide(item)}><Icon name="eye-off" size={32} color={theme.iconDark} /></Pressable>
                                        :
                                        null}
                                </View>
                            </View>
                        } />
                </View>

                <View style={[theme.plateTile, theme.shadowDefault, { marginBottom: 20, maxHeight: 500 }]}>
                    <Text style={theme.textVariants.header}>hidden comments ({hiddenComments?.length})</Text>
                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={hiddenComments}
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        renderItem={({ item }) =>
                            <View style={[theme.plateComment, { flexDirection: 'row' }]}>
                                <View style={{ flex: 0, flexShrink: 1, minWidth: 48 }}>
                                    <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleDelete(item)}><Icon name="delete" size={32} color={theme.iconDark} /></Pressable>
                                </View>
                                <View style={{ flex: 1, marginHorizontal: 10 }}>
                                    <Link href={`/plate/${item.plate.value}`}><TextBody>{item.plate.value} | flagged: {item.flagged.value} | visible: {item.visible ? "yes" : "no"}</TextBody></Link>
                                    <Link href={`/user/${item.author.username}`}><TextBody>{item.author.role === "Guest" ? item.author.username.substring(item.author.username.length - 36, 0) : item.author.username} ({item.author.role})</TextBody></Link>
                                    <TextBody>{new Date(item.date).toLocaleString()}</TextBody>
                                    <TextBody>{item.value}</TextBody>
                                </View>
                                <View style={{ flex: 0, flexShrink: 1, minWidth: 48 }}>
                                    <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleShow(item)}><Icon name="eye-plus" size={32} color={theme.iconDark} /></Pressable>
                                </View>
                            </View>
                        } />
                </View>

                <View style={[theme.plateTile, theme.shadowDefault, { marginBottom: 20, maxHeight: 500 }]}>
                    <Text style={theme.textVariants.header}>users ({users?.length})</Text>
                    <FlatList
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        data={users}
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        renderItem={({ item }) =>
                            <View style={[theme.plateComment, { flexDirection: 'row', flexWrap: 'wrap', }]}>
                                <Link href={`/user/${item.username}`}>
                                    <TextBody style={{ fontSize: 14 }}>{item.username} ({item.role}) | comments: {item.comments?.length} | owner of: {item.owner?.length}</TextBody>
                                </Link>
                            </View>
                        } />
                </View>

            </ScrollView>
        </View>
    )
}