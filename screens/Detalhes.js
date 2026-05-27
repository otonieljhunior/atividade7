import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Detalhes({ route }) {
  const { pais } = route.params;
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    const dados = await AsyncStorage.getItem('@favoritos');
    if (dados) setFavoritos(JSON.parse(dados));
  }

  const jaFavoritado = favoritos.some(f => f.name.common === pais.name.common);

  async function toggleFavorito() {
    let novos;

    if (jaFavoritado) {
      novos = favoritos.filter(f => f.name.common !== pais.name.common);
      Alert.alert('💔 Removido', `${pais.name.common} foi removido dos favoritos.`);
    } else {
      novos = [...favoritos, pais];
      Alert.alert('⭐ Favoritado!', `${pais.name.common} foi adicionado aos favoritos.`);
    }

    setFavoritos(novos);
    await AsyncStorage.setItem('@favoritos', JSON.stringify(novos));
  }

  const moeda = pais.currencies ? Object.values(pais.currencies)[0] : null;
  const idioma = pais.languages ? Object.values(pais.languages)[0] : '';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: pais.flags.png }} style={styles.banner} />
      <View style={styles.card}>
        <Text style={styles.nome}>{pais.name.common}</Text>
        <Text style={styles.oficial}>{pais.name.official}</Text>
        <Text style={styles.info}>🏛️ Capital: {pais.capital?.[0]}</Text>
        <Text style={styles.info}>👥 População: {pais.population?.toLocaleString()}</Text>
        <Text style={styles.info}>🗣️ Idioma: {idioma}</Text>
        <Text style={styles.info}>💰 Moeda: {moeda?.name}</Text>
        <Text style={styles.info}>🌍 Região: {pais.region}</Text>
        <Text style={styles.info}>🕐 Fuso: {pais.timezones?.[0]}</Text>

        <TouchableOpacity
          style={[styles.botao, jaFavoritado && styles.botaoRemover]}
          onPress={toggleFavorito}
        >
          <Text style={styles.textoBotao}>
            {jaFavoritado ? '💔 Desfavoritar' : '⭐ Favoritar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7ff' },
  banner: { width: '100%', height: 250 },
  card: {
    backgroundColor: '#fff', marginTop: -30,
    borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25
  },
  nome: { fontSize: 32, fontWeight: 'bold' },
  oficial: { color: '#777', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 12 },
  botao: {
    backgroundColor: '#2d5bff', padding: 18,
    borderRadius: 14, alignItems: 'center', marginTop: 20
  },
  botaoRemover: {
    backgroundColor: '#ff3b30',
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});