import { Stack } from "expo-router";
import { UserMenu } from "../../components/Menus";
import { useAuth } from "../../contexts/auth";

export default () => {
  const { i18n } = useAuth()
  return (
    <Stack screenOptions={{ headerShown: true, headerRight: () => <UserMenu />, }} >
      <Stack.Screen name="settings" options={{ title: i18n.t('settings') }} />
      <Stack.Screen name="moderation" />
    </Stack>
  );
}