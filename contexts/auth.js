import { useRouter, useSegments, useRootNavigationState,SplashScreen } from "expo-router";
import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
//import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { useFonts } from 'expo-font';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const translations = require('../locales/locale.json')

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

async function getUserId() {
  let userId = await getId("userId") //get id from storage
  if (userId) { return userId } else { return null }
}

async function getGuestId() {
  let guestId = await getId("guestId") //if not found try to get guest id

  if (guestId) { return guestId } else {
    let guestId = uuidv4(); //TODO replace with post request to register guest account and fetch ._id
    await storeId(guestId, "guestId") //if not found guest id, generate it and save
    return guestId
  }
}

const storeId = async (value, key) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    //console.log("error when saving ID", key, value)
  }
};

const getId = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    //console.log("error when reading ID", key, jsonValue)
  }
};

const storeTheme = async (value) => {
  try {
    await AsyncStorage.setItem("theme", JSON.stringify(value));
  } catch (e) {
    //console.log("error when saving theme", value)
  }
};

const getTheme = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("theme");
    return jsonValue !== null ? JSON.parse(jsonValue) : true
  } catch (e) {
    //console.log("error when reading theme")
  }
};


// ---- (3) ----
// Create the AuthContext
const AuthContext = React.createContext(null)

// ---- (4) ----
export function Provider(props) {
  SplashScreen.preventAutoHideAsync();

  // ---- (5) ----
  const [user, setAuth] = React.useState(null);
  const [guest, setGuest] = React.useState(null);

  const [authInitialized, setAuthInitialized] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLightTheme, setIsLightTheme] = React.useState(true)
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Inter': require('../styles/Inter.ttf'),
    'LicensePlate': require('../styles/LicensePlate.ttf'),
  });


  // This hook will protect the route access based on user authentication.
  // ---- (6) ----
  const useProtectedRoute = (user) => {
    const segments = useSegments();
    const [isNavigationReady, setNavigationReady] = useState(false);

    // checking that navigation is all good;
    // ---- (7) ----
    /*    const rootNavigation = useRootNavigation();
   
       // ---- (8) ----
       useEffect(() => {
         const unsubscribe = rootNavigation?.addListener("state", (event) => {
           setNavigationReady(true);
         });
         return function cleanup() {
           if (unsubscribe) {
             unsubscribe();
           }
         };
       }, [rootNavigation]); */

    const navigationState = useRootNavigationState();

    // ---- (9) ----
    React.useEffect(() => {
      if (!fontsLoaded) return;

      if (!navigationState?.key) return;
      // if (!isNavigationReady) { return };
      const inAuthGroup = segments[0] === "(auth)";
      if (!authInitialized) { return };
      if (
        // If the user is not signed in and the initial segment in the auth group.
        !user && inAuthGroup) {
        // Redirect to the sign-in page.
        router.replace("/");
      } else if (user && segments[0] === "register"||user && segments[0] === "slider") {
        // Redirect away from the sign-in page.
        //router.push("/plates");
        router.push("/plates");
      }
       SplashScreen.hideAsync();


    }, [user, segments, authInitialized, navigationState, fontsLoaded]);
  };

  const login = useCallback(async (response) => {
    let user = await getUserId();
    if (!user) {
      let guest = await getGuestId()
      setGuest(guest)
      setAuth(null)
      return guest
    } else {
      setAuth(user);
      return user
    }
  }, []);

  const loadTheme = useCallback(async (response) => {
    let theme = await getTheme();
    setIsLightTheme(theme)
    return theme
  }, []);






  // ---- (10) ----
  useEffect(() => {
    //console.log("trying get user useeffect trigger");
    (async () => {
      let user = await login()
      await loadTheme()
      setAuthInitialized(true)
      //console.log("initialize ", user);
    })();
  }, []);

  useProtectedRoute(user);

  const contextValue = useMemo(() => ({
    signIn: (val) => { setAuth(val), router.replace("/plates"), storeId(val, "userId") },
    signOut: () => { setAuth(null), router.replace("/plates"), storeId(null, "userId") },
    user, guest,
    authInitialized,
    isLightTheme, setIsLightTheme, storeTheme,
    isLoading, setIsLoading,
    router,
    i18n,
  }), [user, guest, isLoading, isLightTheme, authInitialized]);


  // ---- (14) ----
  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Define the useAuth hook
// ---- (15) ----
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return authContext;
}