import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ReportScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Report'>;
};

const obstacleTypes = [
  'Stufen',
  'Defekter Aufzug',
  'Enger Durchgang',
  'Fehlende Rampe',
  'Sonstiges'
];

const ReportScreen: React.FC<ReportScreenProps> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Hier würde die Logik zum Speichern der Meldung implementiert
    console.log('Meldung:', { type: selectedType, description });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Art des Hindernisses</Text>
      <View style={styles.typeContainer}>
        {obstacleTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.selectedType,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.selectedTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Beschreibung</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        placeholder="Beschreiben Sie das Hindernis genauer..."
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedType || !description) && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={!selectedType || !description}
      >
        <Text style={styles.submitButtonText}>Hindernis melden</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A73E8',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    margin: 4,
  },
  selectedType: {
    backgroundColor: '#1A73E8',
  },
  typeText: {
    color: '#333',
  },
  selectedTypeText: {
    color: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportScreen; 