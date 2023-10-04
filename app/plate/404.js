import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useTheme } from "@react-navigation/native";
import { Plate } from '../../components/StyledComponents';
import { useAuth } from '../../contexts/auth';

export default function PlateNotFound() {
    const { router } = useAuth()
    const theme = useTheme()
    const plate = { value: "404" }

    return (
        <View style={theme.container} >
            <View style={[theme.plateTile, { alignItems: 'center' }]}>
                <Plate props={plate} />
                <View style={{ marginTop: 20 }}>
                    <Pressable onPress={() => router.replace("/plates")} style={theme.button}><Text style={theme.buttonText}>Go home</Text></Pressable>
                </View>
            </View>
        </View>
    )
}