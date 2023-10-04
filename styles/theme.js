const colorsapk = {
  light: {
    background: "#fdb832",
    foreground: "#ffeac6",
    secondary: "#fffaf1",
    textDark: "#1d1d1d",
    textLight: "#ffffff",
    textSecondary: '#6d6d6d',
    accent: '#464471',
    shadow: '#000000',
    green: '#2ecc71',
    red: '#e74c3c'
  },
  dark: {
    background: "#1b292d",
    foreground: "#344a53",
    secondary: "#2d424b",
    textDark: "#eee",
    textLight: "#1d1d1d",
    textSecondary: '#999',
    accent: '#5ab3ba',
    shadow: '#000000',
    green: '#27a25b',
    red: '#a5382c'
  }
}

const routerLight = {
  colors: {
    primary: colorsapk.light.background,
    background: colorsapk.light.background,
    card: colorsapk.light.accent,
    text: colorsapk.light.textLight,
    border: colorsapk.light.shadow,
    notification: colorsapk.light.red,
  }
}

const routerDark = {
  colors: {
    primary: colorsapk.dark.background,
    background: colorsapk.dark.background,
    card: colorsapk.dark.accent,
    text: colorsapk.dark.textLight,
    border: colorsapk.dark.shadow,
    notification: colorsapk.dark.red,
  }
}

const borders = {
  default: 20,
}

const typography={
  body: 16,
  header:18,
  small:14,
  button:16,
}

export const themeLight = {
  dark: false,
  ...routerLight,


  iconLight: colorsapk.light.textLight,
  iconDark: colorsapk.light.textDark,
  modalBackground: colorsapk.light.foreground,
  plateMenu: {
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: colorsapk.light.secondary,
    borderRadius: borders.default,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'visible',
    justifyContent: 'center',
    maxWidth: 700,
    alignSelf: 'center',
    backgroundColor: colorsapk.light.background
  },
  wrapper: {
    margin: 20,
  },
  shadowDefault: {
    elevation: 10,
    shadowColor: colorsapk.light.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  spacer: {
    width: '80%',
    height: 2,
    borderRadius: 2,
    backgroundColor: colorsapk.light.accent,
    alignSelf: 'center',
    marginVertical: 10
  },
  loginButtonsBack: {
    backgroundColor: colorsapk.light.secondary,
    borderRadius: borders.default,
    flexDirection: 'row',
    alignSelf: 'center',
    maxWidth: 700,
  },
  loginPanel: {
    padding: 20,
    borderRadius: borders.default,
    backgroundColor: colorsapk.light.foreground,
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: colorsapk.light.shadow,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: 320,
    maxWidth: 700,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colorsapk.light.background,
    padding: 10,
    borderRadius: borders.default,
    justifyContent: 'center',
  },
  buttonText: {
    color: colorsapk.light.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: typography.button,
    fontFamily: 'Inter',
  },
  buttonAlt: {
    backgroundColor: colorsapk.light.accent,
    padding: 10,
    borderRadius: borders.default,
    justifyContent: 'center',
  },
  buttonAltText: {
    color: colorsapk.light.background,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: typography.button,
    fontFamily: 'Inter',
  },
  floatingButton: {
    backgroundColor: colorsapk.light.accent,
    position: 'absolute',
    zIndex: 2,
    right: 0,
    bottom: 0,
    margin: 40,
    width: 64,
    height: 64,
    borderRadius: 48,
    justifyContent: 'center'
  },
  buttonSecondaryTextDeSelected: {
    color: colorsapk.light.textDark,
    fontWeight: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
  },
  buttonSecondaryTextSelected: {
    color: colorsapk.light.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
  },
  textInput: {
    borderRadius: borders.default,
    backgroundColor: colorsapk.light.secondary,
    padding: 10,
    fontSize:typography.body,
    fontFamily: 'Inter',
    color: colorsapk.light.textDark,
  },
  placeholder: {
    color: colorsapk.light.accent,
    fontSize:typography.body,
    fontFamily: 'Inter',
  },

  textVariants: {
    header: {
      fontSize: typography.header,
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'lowercase',
      letterSpacing: 2,
      color: colorsapk.light.textDark,
      fontFamily: 'Inter',
    },
    body: {
      fontSize: typography.body,
      color: colorsapk.light.textDark,
      fontFamily: 'Inter',
      fontWeight:'medium'
    },
    username: {
      fontSize: typography.body,
      color: colorsapk.light.accent,
      fontFamily: 'Inter',
      fontWeight:'bold'
    },
    timestamp: {
      color: colorsapk.light.textSecondary,
      fontFamily: 'Inter',
      fontWeight:'regular',
      fontSize:typography.small
    },
  },
  plate: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 3,
    flexDirection: 'row',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    plateText: {
      textTransform: 'uppercase',
     // fontWeight: 'bold',
      letterSpacing: 2,
      fontSize: 34,
      textAlign: 'center',
      fontFamily:'LicensePlate',
    }
  },
  plateTile: {
    backgroundColor: colorsapk.light.foreground,
    padding: 20, margin: 20,
    marginVertical: 4,
    borderRadius: borders.default,
  },
  plateComment: {
    backgroundColor: colorsapk.light.secondary,
    margin: 20,
    marginVertical: 4,
    borderRadius: borders.default,
    marginHorizontal: 0,
    padding: 15,
  },
  pillMenuContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
    zIndex: 1,
    margin: 20,
  },
  pillMenu: {
    backgroundColor: colorsapk.light.foreground,
    borderRadius: borders.default,
    pressable: {
      paddingHorizontal: 7,
      paddingVertical: 10,
    }
  },
  pillMenuIndicator: {
    backgroundColor: colorsapk.light.accent,
    position: 'absolute',
    bottom: 0,
    height: 4,
    borderRadius: 2
  },
  pillMenuText: {
    color: colorsapk.light.textDark,
    fontWeight: 'bold',
    fontSize: typography.small,
    fontFamily:'Inter'
  },
  addComment: {
    textInput: {
      margin: 2,
      borderRadius: borders.default,
      backgroundColor: colorsapk.light.secondary,
      color: colorsapk.light.textDark,
      fontSize:typography.body,
      fontFamily: 'Inter',
    }
  },
  voting: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    votingButtonPlus: {
      borderWidth: 2,
      borderColor: colorsapk.light.green,
      text: {
        color: colorsapk.light.textDark,
        fontWeight: 'bold'
      },
    },
    votingButtonPlusActive: {
      backgroundColor: colorsapk.light.green,
      text: {
        color: colorsapk.light.textLight,
        fontWeight: 'bold'
      },
    },
    votingButtonMinus: {
      borderWidth: 2,
      borderColor: colorsapk.light.red,
      text: {
        color: colorsapk.light.textDark,
        fontWeight: 'bold'
      },
    },
    votingButtonMinusActive: {
      backgroundColor: colorsapk.light.red,
      text: {
        color: colorsapk.light.textLight,
        fontWeight: 'bold'
      },
    },
    votingNumber: {
      alignSelf: 'center',
      paddingHorizontal: 4,
      fontWeight: 'bold',
      color:colorsapk.light.textDark
    },
    votingNumberPlus: {
      alignSelf: 'center',
      paddingHorizontal: 4,
      fontWeight: 'bold',
      color: colorsapk.light.green
    },
    votingNumberMinus: {
      alignSelf: 'center',
      paddingHorizontal: 4,
      fontWeight: 'bold',
      color: colorsapk.light.red
    },
  },
  commentMenu: {
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: colorsapk.light.foreground,
    borderRadius: borders.default,
    text: {
      color: colorsapk.light.textDark,
      fontSize:typography.small,
      fontFamily: 'Inter',
      fontWeight:'400'
    }
  }

}

////////////////////////////////////////////////////////////////////////////////////////

export const themeDark = {
  dark: true,
  ...routerDark,


  iconLight: colorsapk.dark.textLight,
  iconDark: colorsapk.dark.textDark,
  modalBackground: colorsapk.dark.foreground,
  plateMenu: {
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: colorsapk.dark.secondary,
    borderRadius: borders.default,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'visible',
    justifyContent: 'center',
    maxWidth: 700,
    alignSelf: 'center',
    backgroundColor: colorsapk.dark.background
  },
  wrapper: {
    margin: 20,
  },
  shadowDefault: {
    elevation: 10,
    shadowColor: colorsapk.dark.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  spacer: {
    width: '80%',
    height: 2,
    borderRadius: 2,
    backgroundColor: colorsapk.dark.accent,
    alignSelf: 'center',
    marginVertical: 10
  },
  loginButtonsBack: {
    backgroundColor: colorsapk.dark.secondary,
    borderRadius: borders.default,
    flexDirection: 'row',
    alignSelf: 'center',
    maxWidth: 700,
  },
  loginPanel: {
    padding: 20,
    borderRadius: borders.default,
    backgroundColor: colorsapk.dark.foreground,
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: colorsapk.dark.shadow,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: 320,
    maxWidth: 700,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colorsapk.dark.background,
    padding: 10,
    borderRadius: borders.default,
    justifyContent: 'center',
  },
  buttonText: {
    color: colorsapk.dark.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: typography.button,
    fontFamily: 'Inter',
  },
  buttonAlt: {
    backgroundColor: colorsapk.dark.accent,
    padding: 10,
    borderRadius: borders.default,
    justifyContent: 'center',
  },
  buttonAltText: {
    color: colorsapk.dark.background,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: typography.button,
    fontFamily: 'Inter',
  },
  floatingButton: {
    backgroundColor: colorsapk.dark.accent,
    position: 'absolute',
    zIndex: 2,
    right: 0,
    bottom: 0,
    margin: 40,
    width: 64,
    height: 64,
    borderRadius: 48,
    justifyContent: 'center'
  },
  buttonSecondaryTextDeSelected: {
    color: colorsapk.dark.textDark,
    fontWeight: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
  },
  buttonSecondaryTextSelected: {
    color: colorsapk.dark.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
  },
  textInput: {
    borderRadius: borders.default,
    backgroundColor: colorsapk.dark.secondary,
    padding: 10,
    fontSize:typography.body,
    fontFamily: 'Inter',
    color: colorsapk.light.textLight,
  },
  placeholder: {
    color: colorsapk.dark.accent,
    fontSize:typography.body,
    fontFamily: 'Inter',
  },

  textVariants: {
    header: {
      fontSize: typography.header,
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'lowercase',
      letterSpacing: 2,
      color: colorsapk.dark.textDark,
      fontFamily: 'Inter',
    },
    body: {
      fontSize: typography.body,
      color: colorsapk.dark.textDark,
      fontFamily: 'Inter',
      fontWeight:'medium'
    },
    username: {
      fontSize: typography.body,
      color: colorsapk.dark.accent,
      fontFamily: 'Inter',
      fontWeight:'bold'
    },
    timestamp: {
      color: colorsapk.dark.textSecondary,
      fontFamily: 'Inter',
      fontWeight:'regular',
      fontSize:typography.small
    },
  },
  plate: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 3,
    flexDirection: 'row',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    plateText: {
      textTransform: 'uppercase',
     // fontWeight: 'bold',
      letterSpacing: 2,
      fontSize: 34,
      textAlign: 'center',
      fontFamily:'LicensePlate',
    }
  },
  plateTile: {
    backgroundColor: colorsapk.dark.foreground,
    padding: 20, margin: 20,
    marginVertical: 4,
    borderRadius: borders.default,
  },
  plateComment: {
    backgroundColor: colorsapk.dark.secondary,
    margin: 20,
    marginVertical: 4,
    borderRadius: borders.default,
    marginHorizontal: 0,
    padding: 15,
  },
  pillMenuContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
    zIndex: 1,
    margin: 20,
  },
  pillMenu: {
    backgroundColor: colorsapk.dark.foreground,
    borderRadius: borders.default,
    pressable: {
      paddingHorizontal: 7,
      paddingVertical: 10,
    }
  },
  pillMenuIndicator: {
    backgroundColor: colorsapk.dark.accent,
    position: 'absolute',
    bottom: 0,
    height: 4,
    borderRadius: 2
  },
  pillMenuText: {
    color: colorsapk.dark.textDark,
    fontWeight: 'bold',
    fontSize: typography.small,
    fontFamily:'Inter'
  },
  addComment: {
    textInput: {
      margin: 2,
      borderRadius: borders.default,
      backgroundColor: colorsapk.dark.secondary,
      color: colorsapk.dark.textDark,
      fontSize:typography.body,
      fontFamily: 'Inter',
    }
  },
  voting: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    votingButtonPlus: {
      borderWidth: 2,
      borderColor: colorsapk.dark.green,
      text: {
        color: colorsapk.dark.textDark,
        fontWeight: 'bold'
      },
    },
    votingButtonPlusActive: {
      backgroundColor: colorsapk.dark.green,
      text: {
        color: colorsapk.dark.textLight,
        fontWeight: 'bold'
      },
    },
    votingButtonMinus: {
      borderWidth: 2,
      borderColor: colorsapk.dark.red,
      text: {
        color: colorsapk.dark.textDark,
        fontWeight: 'bold'
      },
    },
    votingButtonMinusActive: {
      backgroundColor: colorsapk.dark.red,
      text: {
        color: colorsapk.dark.textLight,
        fontWeight: 'bold'
      },
    },
    votingNumber: {
      alignSelf: 'center',
      paddingHorizontal: 4,
      fontWeight: 'bold',
      color:colorsapk.dark.textDark
    },
    votingNumberPlus: {
      alignSelf: 'center',
      paddingHorizontal: 4,
      fontWeight: 'bold',
      color: colorsapk.dark.green
    },
    votingNumberMinus: {
      alignSelf: 'center',
      paddingHorizontal: 4,
      fontWeight: 'bold',
      color: colorsapk.dark.red
    },
  },
  commentMenu: {
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: colorsapk.dark.foreground,
    borderRadius: borders.default,
    text: {
      color: colorsapk.dark.textDark,
      fontSize:typography.small,
      fontFamily: 'Inter',
      fontWeight:'400'
    }
  }

}
