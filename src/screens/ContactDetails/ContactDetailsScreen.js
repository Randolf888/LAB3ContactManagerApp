import React, {useState, useCallback} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Alert,
    Linking,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useContacts} from '../../utils/ContactContext';
import CustomButton from '../../components/common/CustomButton';
import {formatContactName} from '../../data/contactsData';
import {Colors, Fonts, Spacing, GlobalStyles} from '../../styles/globalStyles';

const {width} = Dimensions.get('window');

const ContactDetailsScreen = ({navigation, route}) => {
    const {contacts, deleteContact, toggleFavorite} = useContacts();
    const {contactId} = route.params;
    
    const contact = contacts.find(c => c.id === contactId);
    
    const [loading, setLoading] = useState(false);

    if (!contact) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Contact not found</Text>
                    <CustomButton
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const fullName = formatContactName(contact);
    const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();

    // Handle phone call
    const handleCallPress = useCallback(() => {
        const url = `tel:${contact.phone}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Phone calls are not supported on this device');
            }
        });
    }, [contact.phone]);

    // Handle SMS
    const handleMessagePress = useCallback(() => {
        const url = `sms:${contact.phone}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'SMS is not supported on this device');
            }
        });
    }, [contact.phone]);

    // Handle email
    const handleEmailPress = useCallback(() => {
        const url = `mailto:${contact.email}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Email is not supported on this device');
            }
        });
    }, [contact.email]);

    // Handle favorite toggle
    const handleFavoritePress = useCallback(async () => {
        await toggleFavorite(contact.id);
    }, [contact.id, toggleFavorite]);

    // Handle delete contact
    const handleDeletePress = useCallback(() => {
        Alert.alert(
            'Delete Contact',
            `Are you sure you want to delete ${fullName}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        await deleteContact(contact.id);
                        navigation.goBack();
                    }
                }
            ]
        );
    }, [contact.id, fullName, deleteContact, navigation]);

    // Handle edit contact
    const handleEditPress = useCallback(() => {
        navigation.navigate('AddContact', {contact});
    }, [navigation, contact]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                
                {/* Header Section */}
                <View style={styles.headerContainer}>
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
                            <View style={styles.favoriteBadge}>
                                <Icon name="star" size={16} color={Colors.secondary}/>
                            </View>
                        )}
                    </View>
                    
                    <Text style={styles.name}>{fullName}</Text>
                    {contact.company && (
                        <Text style={styles.company}>{contact.company}</Text>
                    )}
                    
                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity 
                            style={styles.quickAction}
                            onPress={handleCallPress}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Call ${fullName}`}>
                            <Icon name="phone" size={24} color={Colors.primary} />
                            <Text style={styles.quickActionText}>Call</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.quickAction}
                            onPress={handleMessagePress}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Message ${fullName}`}>
                            <Icon name="message" size={24} color={Colors.primary} />
                            <Text style={styles.quickActionText}>Message</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.quickAction}
                            onPress={handleEmailPress}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Email ${fullName}`}>
                            <Icon name="email" size={24} color={Colors.primary} />
                            <Text style={styles.quickActionText}>Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    
                    <View style={styles.infoItem}>
                        <Icon name="phone" size={20} color={Colors.text.secondary} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{contact.phone}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Icon name="email" size={20} color={Colors.text.secondary} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{contact.email}</Text>
                        </View>
                    </View>
                    
                    {contact.company && (
                        <View style={styles.infoItem}>
                            <Icon name="business" size={20} color={Colors.text.secondary} style={styles.infoIcon} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Company</Text>
                                <Text style={styles.infoValue}>{contact.company}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Notes Section */}
                {contact.notes && (
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <View style={styles.notesContainer}>
                            <Text style={styles.notesText}>{contact.notes}</Text>
                        </View>
                    </View>
                )}

                {/* Additional Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    
                    <View style={styles.infoItem}>
                        <Icon name="favorite" size={20} color={Colors.text.secondary} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Favorite</Text>
                            <Text style={styles.infoValue}>{contact.favorite ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Icon name="calendar-today" size={20} color={Colors.text.secondary} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Added</Text>
                            <Text style={styles.infoValue}>
                                {new Date(contact.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <CustomButton
                    title={contact.favorite ? 'Remove Favorite' : 'Add to Favorite'}
                    onPress={handleFavoritePress}
                    variant={contact.favorite ? 'secondary' : 'outline'}
                    style={styles.actionButton}
                />
                
                <View style={styles.rowButtons}>
                    <CustomButton
                        title="Edit"
                        onPress={handleEditPress}
                        variant="outline"
                        style={[styles.actionButton, styles.halfButton]}
                    />
                    <CustomButton
                        title="Delete"
                        onPress={handleDeletePress}
                        variant="outline"
                        style={[styles.actionButton, styles.halfButton]}
                        loading={loading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.container,
    },
    scrollContainer: {
        flex: 1,
    },
    headerContainer: {
        ...GlobalStyles.centered,
        paddingVertical: Spacing.xl,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.primary,
        ...GlobalStyles.centered,
    },
    avatarText: {
        color: Colors.text.light,
        fontSize: Fonts.xlarge,
        fontWeight: 'bold',
    },
    favoriteBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 4,
        elevation: 2,
    },
    name: {
        fontSize: Fonts.xlarge,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    company: {
        fontSize: Fonts.medium,
        color: Colors.text.secondary,
        marginBottom: Spacing.lg,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    quickAction: {
        ...GlobalStyles.centered,
        paddingHorizontal: Spacing.lg,
    },
    quickActionText: {
        fontSize: Fonts.small,
        color: Colors.primary,
        marginTop: Spacing.xs,
    },
    infoSection: {
        backgroundColor: Colors.surface,
        marginVertical: Spacing.sm,
        marginHorizontal: Spacing.md,
        padding: Spacing.md,
        borderRadius: 12,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: Fonts.medium,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoIcon: {
        marginRight: Spacing.md,
        width: 24,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: Fonts.small,
        color: Colors.text.secondary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: Fonts.medium,
        color: Colors.text.primary,
    },
    notesContainer: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
        borderRadius: 8,
    },
    notesText: {
        fontSize: Fonts.medium,
        color: Colors.text.primary,
        lineHeight: 22,
    },
    actionButtons: {
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    actionButton: {
        marginBottom: Spacing.sm,
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfButton: {
        width: '48%',
    },
    errorContainer: {
        ...GlobalStyles.container,
        ...GlobalStyles.centered,
        padding: Spacing.xl,
    },
    errorText: {
        fontSize: Fonts.large,
        color: Colors.text.secondary,
        marginBottom: Spacing.lg,
    },
});

export default ContactDetailsScreen;