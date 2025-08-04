import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { t } from '../../localization';
import { UserType } from '../../types/User';

interface ProfileSetupScreenProps {
  navigation: any;
  route: any;
}

const TURKISH_CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 
  'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Trabzon',
  'Samsun', 'Malatya', 'Erzurum', 'Van', 'Batman', 'Elazığ', 'Erzincan',
  'Tokat', 'Afyonkarahisar', 'Edirne', 'Isparta', 'Karaman', 'Kastamonu',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya',
  'Manisa', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu',
  'Osmaniye', 'Rize', 'Sakarya', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
  'Tunceli', 'Uşak', 'Yalova', 'Yozgat', 'Zonguldak'
];

const INTERESTS = [
  'Spor', 'Müzik', 'Sinema', 'Kitap', 'Seyahat', 'Yemek', 'Teknoloji', 
  'Sanat', 'Dans', 'Fotoğrafçılık', 'Yazılım', 'Girişimcilik', 'Yoga',
  'Koşu', 'Bisiklet', 'Doğa Yürüyüşü', 'Kahve', 'Oyun', 'Tarih', 'Bilim'
];

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { userData } = route.params;
  
  const [profileData, setProfileData] = useState({
    hometown: '',
    currentCity: '',
    userType: UserType.STUDENT,
    university: '',
    profession: '',
    interests: [] as string[],
    bio: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.hometown) {
      newErrors.hometown = 'Memleket seçimi zorunludur';
    }

    if (!profileData.currentCity) {
      newErrors.currentCity = 'Mevcut şehir seçimi zorunludur';
    }

    if (!profileData.dateOfBirth) {
      newErrors.dateOfBirth = 'Doğum tarihi zorunludur';
    }

    if (profileData.userType === UserType.STUDENT && !profileData.university) {
      newErrors.university = 'Öğrenci iseniz üniversite bilgisi zorunludur';
    }

    if (profileData.userType === UserType.PROFESSIONAL && !profileData.profession) {
      newErrors.profession = 'Profesyonel iseniz meslek bilgisi zorunludur';
    }

    if (profileData.interests.length === 0) {
      newErrors.interests = 'En az bir ilgi alanı seçmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validateForm()) {
      // Combine userData and profileData
      const completeUserData = {
        ...userData,
        ...profileData,
        dateOfBirth: new Date(profileData.dateOfBirth),
      };
      
      Alert.alert(
        'Başarılı!',
        'Profiliniz oluşturuldu. Ana sayfaya yönlendiriliyorsunuz.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('MainApp'),
          },
        ]
      );
    }
  };

  const toggleInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profileSetup')}</Text>
        <Text style={styles.subtitle}>Kendinizi tanıtalım</Text>
      </View>

      <View style={styles.form}>
        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('dateOfBirth')}</Text>
          <TextInput
            style={[styles.input, errors.dateOfBirth && styles.inputError]}
            value={profileData.dateOfBirth}
            onChangeText={(text) => updateField('dateOfBirth', text)}
            placeholder="YYYY-MM-DD"
          />
          {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
        </View>

        {/* Hometown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('selectHometown')}</Text>
          <View style={[styles.pickerContainer, errors.hometown && styles.inputError]}>
            <Picker
              selectedValue={profileData.hometown}
              onValueChange={(value) => updateField('hometown', value)}
              style={styles.picker}
            >
              <Picker.Item label="Memleketinizi seçin..." value="" />
              {TURKISH_CITIES.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          {errors.hometown && <Text style={styles.errorText}>{errors.hometown}</Text>}
        </View>

        {/* Current City */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('currentCity')}</Text>
          <View style={[styles.pickerContainer, errors.currentCity && styles.inputError]}>
            <Picker
              selectedValue={profileData.currentCity}
              onValueChange={(value) => updateField('currentCity', value)}
              style={styles.picker}
            >
              <Picker.Item label="Mevcut şehrinizi seçin..." value="" />
              {TURKISH_CITIES.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          {errors.currentCity && <Text style={styles.errorText}>{errors.currentCity}</Text>}
        </View>

        {/* User Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Durumunuz</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={profileData.userType}
              onValueChange={(value) => updateField('userType', value)}
              style={styles.picker}
            >
              <Picker.Item label={t('students')} value={UserType.STUDENT} />
              <Picker.Item label={t('professionals')} value={UserType.PROFESSIONAL} />
              <Picker.Item label={t('entrepreneurs')} value={UserType.ENTREPRENEUR} />
              <Picker.Item label="Diğer" value={UserType.OTHER} />
            </Picker>
          </View>
        </View>

        {/* University (if student) */}
        {profileData.userType === UserType.STUDENT && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('university')}</Text>
            <TextInput
              style={[styles.input, errors.university && styles.inputError]}
              value={profileData.university}
              onChangeText={(text) => updateField('university', text)}
              placeholder="Üniversitenizi girin"
            />
            {errors.university && <Text style={styles.errorText}>{errors.university}</Text>}
          </View>
        )}

        {/* Profession (if professional) */}
        {profileData.userType === UserType.PROFESSIONAL && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profession')}</Text>
            <TextInput
              style={[styles.input, errors.profession && styles.inputError]}
              value={profileData.profession}
              onChangeText={(text) => updateField('profession', text)}
              placeholder="Mesleğinizi girin"
            />
            {errors.profession && <Text style={styles.errorText}>{errors.profession}</Text>}
          </View>
        )}

        {/* Interests */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('interests')}</Text>
          <View style={styles.interestsContainer}>
            {INTERESTS.map(interest => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestTag,
                  profileData.interests.includes(interest) && styles.interestTagSelected
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestText,
                  profileData.interests.includes(interest) && styles.interestTextSelected
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.interests && <Text style={styles.errorText}>{errors.interests}</Text>}
        </View>

        {/* Bio */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bio')}</Text>
          <TextInput
            style={[styles.textArea]}
            value={profileData.bio}
            onChangeText={(text) => updateField('bio', text)}
            placeholder="Kendinizi kısaca tanıtın..."
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Profili Tamamla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: '#4ECDC4',
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  textArea: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  picker: {
    height: 50,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 5,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  interestTagSelected: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  interestText: {
    color: '#666',
    fontSize: 14,
  },
  interestTextSelected: {
    color: 'white',
  },
  completeButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 8,
    marginTop: 20,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});