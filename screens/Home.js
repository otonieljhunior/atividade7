import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { api } from '../services/api';

export default function Home({ navigation }) {
  const [paises, setPaises] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarPaises();
  }, []);

  async function carregarPaises() {
    const response = await api.get(
      '/all?fields=name,capital,flags,population,region,languages,currencies,timezones'
    );
    setPaises(response.data);
  }

  const filtrados = paises.filter((item) =>
    item.name.common.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.titulo}>Países</Text>
        <TouchableOpacity
          style={styles.botaoPerfil}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.botaoPerfilTexto}>👤 Perfil</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Pesquisar país..."
        style={styles.input}
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.name.common}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detalhes', { pais: item })}
          >
            <Image
              source={{ uri: item.flags.png }}
              style={styles.bandeira}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.name.common}</Text>
              <Text style={styles.capital}>Capital: {item.capital?.[0]}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
    padding: 20,
    paddingTop: 50
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2d5bff'
  },
  botaoPerfil: {
    backgroundColor: '#2d5bff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20
  },
  botaoPerfilTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  bandeira: {
    width: 50,
    height: 35,
    borderRadius: 5,
    marginRight: 15
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  capital: {
    color: '#777',
    marginTop: 5
  }
});