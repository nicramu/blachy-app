import { Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../contexts/auth";

export const Voting = React.memo(function Voting({ item, type }) {
    const theme = useTheme()
    const { user, } = useAuth()

    const [votes, setVotes] = useState(item.points)

    let plusButtonStatus
    let plusTextStatus
    let minusButtonStatus
    let minusTextStatus

    async function handleVote(voteType) {
        let reqURL
        if (type === "plate") {
            reqURL = `${process.env.EXPO_PUBLIC_API_URL}/plate/${item.value}/${voteType}`
        } else if (type === "comment") {
            reqURL = `${process.env.EXPO_PUBLIC_API_URL}/comment/${item._id}/${voteType}`
        }

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
            //console.log(res.message)
            // getPlate()

            if (voteType === "plus") {
                if (item.points.votedPlus.includes(user.id) && !item.points.votedMinus.includes(user.id)) {
                    item.points.votedPlus = item.points.votedPlus.filter(item => item !== user.id)
                    item.points.value -= 1
                    setVotes(prev => [prev, votes])

                } else if (!item.points.votedPlus.includes(user.id) && item.points.votedMinus.includes(user.id)) {
                    item.points.votedPlus.push(user.id),
                        item.points.votedMinus = item.points.votedMinus.filter(item => item !== user.id),
                        item.points.value = item.points.value + 2
                    setVotes(prev => [prev, votes])

                } else if (!item.points.votedPlus.includes(user.id) && !item.points.votedMinus.includes(user.id)) {
                    item.points.votedPlus.push(user.id)
                    item.points.value = item.points.value + 1
                    setVotes(prev => [prev, votes])
                }

            } else if (voteType === "minus") {
                if (!item.points.votedPlus.includes(user.id) && item.points.votedMinus.includes(user.id)) {
                    item.points.votedMinus = item.points.votedMinus.filter(item => item !== user.id),
                        item.points.value = item.points.value + 1
                    setVotes(prev => [prev, votes])

                } else if (item.points.votedPlus.includes(user.id) && !item.points.votedMinus.includes(user.id)) {
                    item.points.votedPlus = item.points.votedPlus.filter(item => item !== user.id),
                        item.points.votedMinus.push(user.id),
                        item.points.value = item.points.value - 2
                    setVotes(prev => [prev, votes])

                } else if (!item.points.votedPlus.includes(user.id) && !item.points.votedMinus.includes(user.id)) {
                    item.points.votedMinus.push(user.id),
                        item.points.value = item.points.value - 1
                    setVotes(prev => [prev, votes])

                }

            }

        } else {
            alert(res.message)
        }
    }

    //voting buttons conditional styling
    if (item?.points?.votedPlus?.includes(user?.id)) {
        plusButtonStatus = theme.voting.votingButtonPlusActive
        plusTextStatus = theme.voting.votingButtonPlusActive.text
    } else {
        plusButtonStatus = theme.voting.votingButtonPlus
        plusTextStatus = theme.voting.votingButtonPlus.text
    }

    if (item?.points?.votedMinus?.includes(user?.id)) {
        minusButtonStatus = theme.voting.votingButtonMinusActive
        minusTextStatus = theme.voting.votingButtonMinusActive.text
    } else {
        minusButtonStatus = theme.voting.votingButtonMinus
        minusTextStatus = theme.voting.votingButtonMinus.text
    }

    function Points() {
        if (item?.points?.value < 0) {
            return (
                <Text style={theme.voting.votingNumberMinus}>{item.points.value}</Text>
            )
        } else if (item?.points?.value > 0) {
            return (
                <Text style={theme.voting.votingNumberPlus}>{item.points.value}</Text>
            )
        } else {
            return (
                <Text style={theme.voting.votingNumber}>0</Text>
            )
        }
    }

    return (
        <>
            {user && <Pressable style={[theme.voting, plusButtonStatus]} onPress={() => handleVote("plus")}><Text style={plusTextStatus}>+</Text></Pressable>}
            <Points />
            {user && <Pressable style={[theme.voting, minusButtonStatus]} onPress={() => handleVote("minus")}><Text style={minusTextStatus}>-</Text></Pressable>}
        </>
    )
})