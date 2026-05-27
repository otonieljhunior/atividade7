import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function Perfil({ navigation }) {
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      carregarPerfil();
    }, [])
  );

  async function carregarPerfil() {
    const user = auth.currentUser;
    if (!user) return;

    // Força atualização dos dados do Firebase (pega displayName novo)
    await user.reload();
    const userAtualizado = auth.currentUser;

    // Tenta buscar foto salva localmente; se não tiver, usa avatar gerado
    const fotoLocal = await AsyncStorage.getItem(`@foto_perfil_${user.uid}`);
    const fotoFinal = fotoLocal ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userAtualizado?.displayName || 'U')}&background=2d5bff&color=fff&size=128`;

    setUserData({
      nome: userAtualizado?.displayName || 'Usuário',
      email: userAtualizado?.email || '',
      foto: fotoFinal,
    });
  }

  async function sair() {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch {
      Alert.alert('Erro ao sair');
    }
  }

  if (!userData) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>

      <View style={styles.fotoContainer}>
        <Image source={{ uri: userData.foto }} style={styles.foto} />
      </View>

      <Text style={styles.nome}>{userData.nome}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>Países visitados</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>Resenhas</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditarPerfil')}
        >
          <Text style={styles.menuIcon}>✏️</Text>
          <Text style={styles.menuTexto}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('AlterarFoto')}
        >
          <Text style={styles.menuIcon}>📷</Text>
          <Text style={styles.menuTexto}>Alterar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuSair]}
          onPress={sair}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuTexto, styles.sairTexto]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#f5f7ff',
    alignItems: 'center', paddingTop: 60,
    paddingBottom: 40, paddingHorizontal: 20
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 25 },
  fotoContainer: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#2d5bff',
    overflow: 'hidden', marginBottom: 15
  },
  foto: { width: '100%', height: '100%' },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  email: { fontSize: 14, color: '#777', marginTop: 4, marginBottom: 25 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    width: '100%', padding: 20, justifyContent: 'space-around',
    marginBottom: 25, elevation: 3
  },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: 'bold', color: '#2d5bff' },
  statLabel: { fontSize: 12, color: '#777', marginTop: 4, textAlign: 'center' },
  menu: {
    backgroundColor: '#fff', borderRadius: 16,
    width: '100%', paddingVertical: 10, elevation: 3
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  menuSair: { borderBottomWidth: 0 },
  menuIcon: { fontSize: 20, marginRight: 15 },
  menuTexto: { fontSize: 16, color: '#1a1a2e' },
  sairTexto: { color: '#ff3b30' }
});