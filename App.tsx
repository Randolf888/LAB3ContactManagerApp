import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ContactProvider} from './src/utils/ContactContext';
import ContactListScreen from './src/screens/ContactList/ContactListScreen';
import ContactDetailsScreen from './src/screens/ContactDetails/ContactDetailsScreen';
import AddContactScreen from './src/screens/AddContact/AddContactScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ContactProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="ContactList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3498db',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen 
            name="ContactList" 
            component={ContactListScreen}
            options={{title: 'Contacts'}}
          />
          <Stack.Screen 
            name="ContactDetails" 
            component={ContactDetailsScreen}
            options={{title: 'Contact Details'}}
          />
          <Stack.Screen 
            name="AddContact" 
            component={AddContactScreen}
            options={{title: 'Add Contact'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContactProvider>
  );
};

export default App;