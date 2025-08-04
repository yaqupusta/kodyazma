import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { t } from '../../localization';
import { UserType } from '../../types/User';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  hometown: string;
  currentCity: string;
  userType: UserType;
  university?: string;
  profession?: string;
  interests: string[];
  distance: number;
}

// Mock data for demonstration
const MOCK_PEOPLE: Person[] = [
  {
    id: '1',
    firstName: 'Mehmet',
    lastName: 'Yılmaz',
    hometown: 'Ankara',
    currentCity: 'İstanbul',
    userType: UserType.STUDENT,
    university: 'İstanbul Üniversitesi',
    interests: ['Spor', 'Müzik', 'Teknoloji'],
    distance: 2.5,
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    hometown: 'İzmir',
    currentCity: 'İstanbul',
    userType: UserType.PROFESSIONAL,
    profession: 'Yazılım Geliştirici',
    interests: ['Kitap', 'Kahve', 'Seyahat'],
    distance: 1.2,
  },
  {
    id: '3',
    firstName: 'Ali',
    lastName: 'Demir',
    hometown: 'Bursa',
    currentCity: 'İstanbul',
    userType: UserType.ENTREPRENEUR,
    profession: 'Girişimci',
    interests: ['Girişimcilik', 'Teknoloji', 'Spor'],
    distance: 3.8,
  },
];

export const DiscoverScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hometown' | 'nearby'>('all');
  const [people] = useState<Person[]>(MOCK_PEOPLE);

  const filteredPeople = people.filter(person => {
    const matchesSearch = 
      person.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      person.hometown.toLowerCase().includes(searchText.toLowerCase());

    switch (selectedFilter) {
      case 'hometown':
        return matchesSearch && person.hometown === 'Ankara'; // User's hometown
      case 'nearby':
        return matchesSearch && person.distance <= 5;
      default:
        return matchesSearch;
    }
  });

  const getUserTypeText = (userType: UserType) => {
    switch (userType) {
      case UserType.STUDENT:
        return t('students');
      case UserType.PROFESSIONAL:
        return t('professionals');
      case UserType.ENTREPRENEUR:
        return t('entrepreneurs');
      default:
        return 'Diğer';
    }
  };

  const renderPerson = (person: Person) => (
    <TouchableOpacity key={person.id} style={styles.personCard}>
      <View style={styles.personHeader}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImagePlaceholder}>
            {person.firstName[0]}{person.lastName[0]}
          </Text>
        </View>
        <View style={styles.personInfo}>
          <Text style={styles.personName}>
            {person.firstName} {person.lastName}
          </Text>
          <Text style={styles.personLocation}>
            📍 {person.hometown} → {person.currentCity}
          </Text>
          <Text style={styles.personType}>
            {getUserTypeText(person.userType)}
          </Text>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distance}>{person.distance} km</Text>
        </View>
      </View>

      {person.university && (
        <Text style={styles.additionalInfo}>🎓 {person.university}</Text>
      )}
      {person.profession && (
        <Text style={styles.additionalInfo}>💼 {person.profession}</Text>
      )}

      <View style={styles.interestsContainer}>
        {person.interests.slice(0, 3).map(interest => (
          <View key={interest} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
        {person.interests.length > 3 && (
          <Text style={styles.moreInterests}>+{person.interests.length - 3}</Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectButtonText}>{t('connect')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>{t('message')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('discover')}</Text>
        <Text style={styles.subtitle}>Hemşehrilerinizi keşfedin</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="İsim veya şehir ara..."
        />
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'hometown' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('hometown')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'hometown' && styles.filterButtonTextActive]}>
            {t('fromYourHometown')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'nearby' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('nearby')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'nearby' && styles.filterButtonTextActive]}>
            {t('nearbyPeople')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.peopleList}>
        {filteredPeople.map(renderPerson)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#45B7D1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  filterButtonActive: {
    backgroundColor: '#45B7D1',
    borderColor: '#45B7D1',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  peopleList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  personCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#45B7D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImagePlaceholder: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  personLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  personType: {
    fontSize: 14,
    color: '#45B7D1',
    fontWeight: '600',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#999',
  },
  additionalInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 15,
  },
  interestTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 12,
    color: '#45B7D1',
  },
  moreInterests: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  connectButton: {
    flex: 1,
    backgroundColor: '#45B7D1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#45B7D1',
  },
  messageButtonText: {
    color: '#45B7D1',
    fontWeight: '600',
  },
});