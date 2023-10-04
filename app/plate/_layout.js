import { Stack, useLocalSearchParams } from "expo-router";
import { UserMenu } from "../../components/Menus";

export default () => {
    const { plate } = useLocalSearchParams()
  return (
    <Stack screenOptions={{ headerShown: true, headerRight: () => <UserMenu />, }} >
     <Stack.Screen name="[plate]" options={{title:plate}}  />
      <Stack.Screen name="404" options={{title:plate}} />
    </Stack>
  );
}