import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sampleContacts} from '../data/contactsData';

const ContactContext = createContext();

export const useContacts = () => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContacts must be used within ContactProvider');
    }
    return context;
};

export const ContactProvider = ({children}) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const stored = await AsyncStorage.getItem('contacts');
            if (stored) {
                setContacts(JSON.parse(stored));
            } else {
                setContacts(sampleContacts);
                await AsyncStorage.setItem('contacts', JSON.stringify(sampleContacts));
            }
        } catch (error) {
            console.error('Failed to load contacts:', error);
            setContacts(sampleContacts);
        } finally {
            setLoading(false);
        }
    };

    const saveContacts = async (newContacts) => {
        try {
            await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
        } catch (error) {
            console.error('Failed to save contacts:', error);
        }
    };

    const addContact = async (contactData) => {
        const newContact = {
            ...contactData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            favorite: false,
        };
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        await saveContacts(updatedContacts);
        return newContact;
    };

    const updateContact = async (contactId, contactData) => {
        const updatedContacts = contacts.map(contact =>
            contact.id === contactId
                ? {...contact, ...contactData}
                : contact
        );
        setContacts(updatedContacts);
        await saveContacts(updatedContacts);
    };

    const deleteContact = async (contactId) => {
        const updatedContacts = contacts.filter(contact => contact.id !== contactId);
        setContacts(updatedContacts);
        await saveContacts(updatedContacts);
    };

    const toggleFavorite = async (contactId) => {
        const updatedContacts = contacts.map(contact =>
            contact.id === contactId
                ? {...contact, favorite: !contact.favorite}
                : contact
        );
        setContacts(updatedContacts);
        await saveContacts(updatedContacts);
    };

    const value = {
        contacts,
        loading,
        addContact,
        updateContact,
        deleteContact,
        toggleFavorite,
        refreshContacts: loadContacts,
    };

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};