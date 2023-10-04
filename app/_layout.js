import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { themeLight, themeDark } from '../styles/theme'
import { UserMenu } from "../components/Menus";
import { useAuth, Provider } from '../contexts/auth';

export default function RootLayout() {
    return (
        <Provider>
            <RootLayoutNav />
        </Provider>
    );
}



function RootLayoutNav() {
    const { isLightTheme, authInitialized, i18n } = useAuth()
    const theme = isLightTheme ? themeLight : themeDark

    if (!authInitialized) { return }

    return (
        <ThemeProvider value={theme}>
            <Stack screenOptions={{ headerShown: false, statusBarTranslucent: true }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ title: i18n.t('register/login'), headerShown: true }} />
                <Stack.Screen name="plates" options={{ title: i18n.t('plates'), headerShown: true, headerRight: () => <UserMenu />, }} />
            </Stack>
        </ThemeProvider>
    );
}