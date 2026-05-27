import React, { useState } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  // Recarrega toda vez que a aba/tela fica em foco
  useFocusEffect(
    React.useCallback(() => {
      carregar();
    }, [])
  );

  async function carregar() {
    const dados = await AsyncStorage.getItem('@favoritos');
    if (dados) setFavoritos(JSON.parse(dados));
    else setFavoritos([]);
  }

  async function remover(nome) {
    Alert.alert('Remover', `Remover ${nome} dos favoritos?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const novos = favoritos.filter(f => f.name.common !== nome);
          setFavoritos(novos);
          await AsyncStorage.setItem('@favoritos', JSON.stringify(novos));
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Favoritos</Text>

      {favoritos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum favorito ainda.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.name.common}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onLongPress={() => remover(item.name.common)}
              onPress={() => navigation.navigate('Detalhes', { pais: item })}
            >
              <Image source={{ uri: item.flags.png }} style={styles.bandeira} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.name.common}</Text>
                <Text style={styles.dica}>Segure para remover</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f7ff' },
  titulo: { fontSize: 30, fontWeight: 'bold', marginBottom: 20, color: '#2d5bff' },
  vazio: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: '#fff', padding: 15, borderRadius: 15,
    flexDirection: 'row', alignItems: 'center', marginBottom: 15
  },
  bandeira: { width: 50, height: 35, marginRight: 15, borderRadius: 4 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  dica: { fontSize: 11, color: '#bbb', marginTop: 3 }
});