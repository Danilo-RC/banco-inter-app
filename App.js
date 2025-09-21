import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';

export default function App() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='Cadastro' component={CadastroScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='Perfil' component={PerfilScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
