import { Pressable, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

export const PlateTile = (props) => {
    const theme = useTheme()
    return (
        <View style={[theme.plateTile, theme.shadowDefault]}>
            {props.children}
        </View>
    )
};

export const PlateComment = (props) => {
    const theme = useTheme()
    return (
        <View style={[theme.plateComment]}>
            {props.children}
        </View>
    )
};

export const Divider = (props) => {
    const theme = useTheme()
    return (
        <View style={theme.spacer}>
            {props.children}
        </View>
    )
};

export const Header = (props) => {
    const theme = useTheme()
    return (
        <Text style={theme.textVariants.header}>
            {props.children}
        </Text>
    )
};

export const Plate = ({ props, width, height }) => {
    const theme = useTheme()
    return (
        <View style={[theme.plate, {
            width: width,
            height: height, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'
        }]}>
            <View style={{
                width: 20, borderTopLeftRadius: 3, borderBottomLeftRadius: 3,
                backgroundColor: '#0077ff', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ color: 'white' }}>{props.geodata?.flag}</Text>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ color: 'white' }}>{props.geodata?.country}</Text>
            </View>

            <View style={{ flex: 1, alignSelf: 'center' }}>
                <Text style={[theme.plate.plateText]}>{props.value}</Text>
            </View>
        </View>
    )
};

export const CommentButton = ({ props, onPress, icon, title }) => {
    const theme = useTheme()
    return (
        <Pressable style={[theme.commentMenu, { flexDirection: 'row', alignItems: 'center' }]} onPress={onPress}>
            <Text style={theme.commentMenu.text}>
                <Icon name={icon} size={14} style={{ marginRight: 2 }} />
                {title}
            </Text>
            {props.children}
        </Pressable>
    )
};

export const CommentAuthor = (props) => {
    const theme = useTheme()
    return (
        <View style={theme.pillMenuContainer}>
            {props.children}
        </View>
    )
};

export const TextBody = (props) => {
    const theme = useTheme()
    return (
        <Text style={[theme.textVariants.body, props.style]}>
            {props.children}
        </Text>
    )
};

export const TextHeader = (props) => {
    const theme = useTheme()
    return (
        <Text style={[theme.textVariants.header, props.style]}>
            {props.children}
        </Text>
    )
}; 