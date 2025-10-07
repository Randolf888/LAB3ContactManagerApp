import React, {memo} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts, Spacing, GlobalStyles} from '../../styles/globalStyles';
import {formatContactName} from '../../data/contactsData';

const {width} = Dimensions.get('window');

const ContactListItem = memo(({
    contact,
    onPress,
    onFavoritePress,
    onCallPress,
    onMessagePress,
}) => {
    const fullName = formatContactName(contact);
    const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(contact)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Contact ${fullName}, ${contact.company}`}
            accessibilityHint="Tap to view contact details">

            <View style={styles.avatarContainer}>
                {contact.avatar ? (
                    <Image
                        source={{uri: contact.avatar}}
                        style={styles.avatar}
                        accessible={true}
                        accessibilityRole="image"
                        accessibilityLabel={`${fullName} profile picture`}
                    />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                )}
                {contact.favorite && (
                    <View style={styles.favoriteIndicator}>
                        <Icon name="star" size={12} color={Colors.secondary}/>
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {fullName}
                </Text>
                <Text style={styles.company} numberOfLines={1} ellipsizeMode="tail">
                    {contact.company || 'No company'}
                </Text>
                <Text style={styles.phone} numberOfLines={1} ellipsizeMode="tail">
                    {contact.phone}
                </Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.favoriteButton]} 
                    onPress={() => onFavoritePress(contact.id)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <Icon 
                        name={contact.favorite ? 'star' : 'star-border'}
                        size={20}
                        color={contact.favorite ? Colors.secondary : Colors.text.secondary}
                    />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => onCallPress(contact.phone)}
                    accessible={true} 
                    accessibilityRole="button" 
                    accessibilityLabel={`Call ${fullName}`}>
                    <Icon name="phone" size={20} color={Colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => onMessagePress(contact.phone)}
                    accessible={true} 
                    accessibilityRole="button" 
                    accessibilityLabel={`Message ${fullName}`}>
                    <Icon name="message" size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.card,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: Spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: Colors.text.light,
        fontSize: Fonts.medium,
        fontWeight: 'bold',
    },
    favoriteIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: Colors.surface,
        borderRadius: 10,
        padding: 2,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    infoContainer: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    name: {
        fontSize: Fonts.medium,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    company: {
        fontSize: Fonts.small,
        color: Colors.text.secondary,
        marginBottom: 2,
    },
    phone: {
        fontSize: Fonts.small,
        color: Colors.text.secondary,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    favoriteButton: {
        marginRight: Spacing.xs,
    },
});

ContactListItem.displayName = 'ContactListItem';

export default ContactListItem;