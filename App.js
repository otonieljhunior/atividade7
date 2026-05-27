import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import Home from './screens/Home';
import Favoritos from './screens/Favoritos';
import Detalhes from './screens/Detalhes';
import Perfil from './screens/Perfil';
import AlterarFoto from './screens/AlterarFoto';
import EditarPerfil from './screens/EditarPerfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Início" component={Home} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Detalhes"
          component={Detalhes}
        />

        <Stack.Screen
          name="AlterarFoto"
          component={AlterarFoto}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditarPerfil"
          component={EditarPerfil}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}