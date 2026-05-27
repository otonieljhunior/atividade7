import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';

export default function AlterarFoto({ navigation }) {
  const user = auth.currentUser;

  const fotoInicial = user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=2d5bff&color=fff&size=128`;

  const [foto, setFoto] = useState(fotoInicial);
  const [carregando, setCarregando] = useState(false);

  async function escolherGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,   // qualidade menor = base64 menor = salva mais rápido
      base64: true,
    });
    if (!resultado.canceled) await salvarFoto(resultado.assets[0].base64);
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!resultado.canceled) await salvarFoto(resultado.assets[0].base64);
  }

  async function salvarFoto(base64) {
    try {
      setCarregando(true);

      const dataUri = `data:image/jpeg;base64,${base64}`;

      // Salva localmente vinculado ao uid do usuário
      await AsyncStorage.setItem(`@foto_perfil_${user.uid}`, dataUri);

      setFoto(dataUri);
      Alert.alert('✅ Sucesso!', 'Foto de perfil atualizada!');
      navigation.goBack();

    } catch (error) {
      console.log('Erro ao salvar foto:', error.message);
      Alert.alert('Erro', 'Não foi possível salvar a imagem.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarTexto}>← Alterar Foto</Text>
      </TouchableOpacity>

      <View style={styles.fotoContainer}>
        <Image source={{ uri: foto }} style={styles.foto} />
        <View style={styles.cameraBadge}>
          <Text style={styles.cameraIcon}>📷</Text>
        </View>
      </View>

      <Text style={styles.titulo}>Escolha uma imagem</Text>
      <Text style={styles.subtitulo}>Salva localmente no dispositivo</Text>

      {carregando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2d5bff" />
          <Text style={styles.loadingTexto}>Salvando foto...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.botaoGaleria} onPress={escolherGaleria}>
            <Text style={styles.botaoIcon}>🖼️</Text>
            <Text style={styles.botaoTexto}>Escolher da Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoCamera} onPress={tirarFoto}>
            <Text style={styles.botaoIcon}>📸</Text>
            <Text style={[styles.botaoTexto, { color: '#fff' }]}>Tirar Foto</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f5f7ff',
    alignItems: 'center', paddingTop: 60, paddingHorizontal: 20
  },
  voltar: { alignSelf: 'flex-start', marginBottom: 40 },
  voltarTexto: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e' },
  fotoContainer: {
    width: 120, height: 120, borderRadius: 60,
    overflow: 'hidden', marginBottom: 25
  },
  foto: { width: '100%', height: '100%' },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#2d5bff', borderRadius: 20,
    width: 36, height: 36, justifyContent: 'center', alignItems: 'center'
  },
  cameraIcon: { fontSize: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  subtitulo: { fontSize: 14, color: '#777', marginBottom: 40, textAlign: 'center' },
  loadingBox: { alignItems: 'center', marginTop: 30 },
  loadingTexto: { marginTop: 12, color: '#777', fontSize: 14 },
  botaoGaleria: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 18,
    width: '100%', marginBottom: 15, elevation: 3
  },
  botaoCamera: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2d5bff', borderRadius: 14, padding: 18, width: '100%'
  },
  botaoIcon: { fontSize: 20, marginRight: 10 },
  botaoTexto: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e' }
});