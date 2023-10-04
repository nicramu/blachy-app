import { Stack, useLocalSearchParams } from "expo-router";
import { UserMenu } from "../../components/Menus";

export default () => {
    const { user } = useLocalSearchParams()
  return (
    <Stack screenOptions={{ headerShown: true, headerRight: () => <UserMenu />, }} >
     <Stack.Screen name="[user]" options={{title:user}}  />
    </Stack>
  );
}