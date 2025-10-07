import React, {useState, useRef, useCallback} from 'react';
import {
    View,
    ScrollView,
    Alert,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {useContacts} from '../../utils/ContactContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import {validateContact} from '../../data/contactsData';
import {Colors, Spacing, GlobalStyles} from '../../styles/globalStyles';

const AddContactScreen = ({navigation, route}) => {
    const {addContact, updateContact} = useContacts();
    const isEdit = route?.params?.contact;
    const existingContact = route?.params?.contact;

    const [formData, setFormData] = useState({
    firstName: existingContact?.firstName || '',
    lastName: existingContact?.lastName || '',
    email: existingContact?.email || '',
    phone: existingContact?.phone || '',
    company: existingContact?.company || '',
    notes: existingContact?.notes || '',
});

const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

// Form refs for navigation
const lastNameRef = useRef();
const emailRef = useRef();
const phoneRef = useRef();
const companyRef = useRef();
const notesRef = useRef();

// Handle form field changes
const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({...prev, [field]: value}));

    // Clear error when user starts typing
    if (errors[field]) {
    setErrors(prev => ({...prev, [field]: null}));
    }
}, [errors]);

// Validate and submit form
const handleSubmit = useCallback(async () => {
    const {isValid, errors: validationErrors} = validateContact(formData);

    if (!isValid) {
    setErrors(validationErrors);
    return;
}

setLoading(true);

try {
    if (isEdit) {
    await updateContact(existingContact.id, formData);
    Alert.alert('Success', 'Contact updated successfully');
    } else {
    await addContact(formData);
    Alert.alert('Success', 'Contact added successfully');
    }
    navigation.goBack();
    } catch (error) {
    Alert.alert('Error', 'Failed to save contact. Please try again.');
    } finally {
    setLoading(false);
    }
}, [formData, isEdit, existingContact, addContact, updateContact, navigation]);

return (
<SafeAreaView style={styles.container}> 
<KeyboardAvoidingView 
    style={styles.keyboardContainer} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

<ScrollView 
    style={styles.scrollContainer} 
    contentContainerStyle={styles.formContainer}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">

<CustomInput 
    label="First Name" 
    value={formData.firstName} 
    onChangeText={(value) => handleFieldChange('firstName', value)} 
    error={errors.firstName} 
    leftIcon="person" 
    returnKeyType="next"
    onSubmitEditing={() => lastNameRef.current?.focus()}
    blurOnSubmit={false}
/>

<CustomInput
    ref={lastNameRef}
    label="Last Name"
    value={formData.lastName}
    onChangeText={(value) => handleFieldChange('lastName', value)}
    error={errors.lastName}
    leftIcon="person-outline"
    returnKeyType="next"
    onSubmitEditing={() => emailRef.current?.focus()}
    blurOnSubmit={false}
/>

<CustomInput
    ref={emailRef}
    label="Email"
    value={formData.email}
    onChangeText={(value) => handleFieldChange('email', value)}
    error={errors.email}
    leftIcon="email"
    keyboardType="email-address"
    autoCapitalize="none"
    returnKeyType="next"
    onSubmitEditing={() => phoneRef.current?.focus()}
    blurOnSubmit={false}
/>

<CustomInput
    ref={phoneRef}
    label="Phone"
    value={formData.phone}
    onChangeText={(value) => handleFieldChange('phone', value)}
    error={errors.phone}
    leftIcon="phone"
    keyboardType="phone-pad"
    returnKeyType="next"
    onSubmitEditing={() => companyRef.current?.focus()}
    blurOnSubmit={false}
/>

<CustomInput
    ref={companyRef}
    label="Company"
    value={formData.company}
    onChangeText={(value) => handleFieldChange('company', value)}
    leftIcon="business"
    returnKeyType="next"
    onSubmitEditing={() => notesRef.current?.focus()}
    blurOnSubmit={false}
/>

<CustomInput
    ref={notesRef}
    label="Notes"
    value={formData.notes}
    onChangeText={(value) => handleFieldChange('notes', value)}
    leftIcon="notes"
    multiline={true}
    numberOfLines={4}
    returnKeyType="done"
/>

</ScrollView>

<View style={styles.buttonContainer}> 
<CustomButton 
    title={isEdit ? 'Update Contact' : 'Add Contact'} 
    onPress={handleSubmit} 
    loading={loading} 
    disabled={loading}
/>
</View>

</KeyboardAvoidingView> 
</SafeAreaView>
);
};

const styles = StyleSheet.create({ 
    container: {
    ...GlobalStyles.container,
    },
    keyboardContainer: {
    flex: 1,
    },
    scrollContainer: {
    flex: 1,
    },
    formContainer: {
    padding: Spacing.md, 
    paddingBottom: Spacing.xl,
    },
    buttonContainer: {
    padding: Spacing.md, 
    paddingTop: Spacing.sm, 
    backgroundColor: Colors.surface, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: -2}, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    },
});

export default AddContactScreen;