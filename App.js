import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from './src/pages/Login';
import CadastroScreen from './src/pages/Cadastro';
import HomeScreen from './src/pages/Home';
import PerfilScreen from './src/pages/Perfil';

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
