import { View, Text, ActivityIndicator, Pressable, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { useTheme } from "@react-navigation/native";
import { useAuth } from '../../contexts/auth';
import { PlateComments } from '../../components/Lists';
import { Divider, Plate, TextBody, TextHeader } from '../../components/StyledComponents';
import { ConfirmationModal } from '../../components/Modals';

export default function User() {
    const currentUser = useLocalSearchParams().user
    const theme = useTheme()
    const { router, user, i18n } = useAuth();
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const question = useRef("")
    const functionToPass = useRef()

    useEffect(() => {
        //clear current data
        setUserData(null);
        //get the new data
        getUser()
    }, [currentUser]);

    async function getUser() {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${currentUser}`, {
            method: "GET",
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                "Content-Type": "application/json",
            }
        })
        const res = await req.json()

        if (req.ok) {
            //console.log(res.user)
            setUserData(res.user)
        } else {
            //console.log(res.message)
        }
        setIsLoading(false)
    }

    async function deleteUser() {
        const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${currentUser}`, {
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

    if (isLoading) {
        return (
            <View style={theme.container}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    if (!userData && !isLoading) {
        return (
            <View style={theme.container}>
                <View style={[theme.wrapper, { flex: 1, justifyContent: 'center' }]}>
                    <TextHeader>{i18n.t('usernotfound')}</TextHeader>
                    <Pressable onPress={() => router.replace("/plates")} style={theme.buttonAlt}><Text style={theme.buttonAltText}>{i18n.t('gohome')}</Text></Pressable>
                </View>
            </View>
        )
    }

    const renderComment = ({ item }) => { return (<PlateComments item={item} ownerId={null} showPlate={true} hideUser={true} getPlate={getUser} />) }

    return (
        <View style={[theme.container, { marginVertical: 20 }]}>

            <View style={[theme.plateTile, theme.shadowDefault, { flexDirection: 'column' }]}>
                <View style={{ alignItems: 'center', }}  >
                    <TextHeader>{currentUser}</TextHeader>
                    <TextBody>({userData.role})</TextBody>
                    <TextBody>{i18n.t('withus')}: {new Date(userData.registerDate).toLocaleString()}</TextBody>
                </View>
                {userData.owner.length > 0 &&
                    <View style={{ marginTop: 10, }}>
                        <TextBody>{i18n.t('owner')}:</TextBody>
                        <View style={{ overflow: 'scroll', }}>
                            <FlatList data={userData.owner} horizontal contentContainerStyle={{ paddingBottom: 15 }} ItemSeparatorComponent={<View style={{ marginHorizontal: 4 }}></View>} renderItem={({ item }) => (<Link href={`/plate/${item.value}`}><Plate props={item} width={150} height={40} /></Link>)} />
                        </View>
                    </View>
                }
                {(user?.role === "Admin" || user?.role === "Moderator") &&
                    <Pressable style={[theme.buttonAlt, { marginTop: 5 }]} onPress={() => [setIsVisible(true), functionToPass.current = deleteUser, question.current = "Do you want to ban this user?"]} >
                        <Text style={theme.buttonAltText}>BAN</Text>
                    </Pressable>
                }
                <ConfirmationModal props={null} question={question.current} isVisible={isVisible} setIsVisible={setIsVisible} action={functionToPass.current} />
            </View>

            <View style={[theme.plateTile, theme.shadowDefault, { flex: 1 }]}>
                <TextHeader>{i18n.t('comments')}{userData.commentCount ? ` (${userData.commentCount})` : ` (${userData.comments?.length ? userData.comments?.length : "0"})`}:</TextHeader>
                <Divider />

                <FlatList
                    data={userData.comments}
                    renderItem={renderComment}
                    keyExtractor={comment => comment._id}
                    initialNumToRender={20}
                    maxToRenderPerBatch={5}
                    windowSize={4}
                />
            </View>
        </View>
    )
}