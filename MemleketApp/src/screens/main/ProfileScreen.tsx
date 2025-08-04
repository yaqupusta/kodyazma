import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../localization';
import { UserType } from '../../types/User';

export const ProfileScreen: React.FC = () => {
  const [user] = useState({
    firstName: 'Mehmet',
    lastName: 'Yılmaz',
    email: 'mehmet.yilmaz@email.com',
    hometown: 'Ankara',
    currentCity: 'İstanbul',
    userType: UserType.STUDENT,
    university: 'İstanbul Üniversitesi',
    interests: ['Spor', 'Müzik', 'Teknoloji', 'Seyahat'],
    bio: 'Ankara\'dan İstanbul\'a gelmiş bir bilgisayar mühendisliği öğrencisiyim. Yeni insanlarla tanışmayı ve farklı kültürlerden öğrenmeyi seviyorum.',
    joinedDate: new Date('2023-12-01'),
  });

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const stats = {
    connections: 24,
    events: 5,
    messages: 32,
  };

  const menuItems = [
    {
      title: 'Profili Düzenle',
      icon: '✏️',
      action: () => Alert.alert('Profil Düzenle', 'Profil düzenleme sayfasına yönlendirileceksiniz.'),
    },
    {
      title: 'Gizlilik Ayarları',
      icon: '🔒',
      action: () => Alert.alert('Gizlilik', 'Gizlilik ayarları sayfası'),
    },
    {
      title: 'Bildirimler',
      icon: '🔔',
      action: () => {},
      hasSwitch: true,
      switchValue: notifications,
      onSwitchChange: setNotifications,
    },
    {
      title: 'Konum Paylaşımı',
      icon: '📍',
      action: () => {},
      hasSwitch: true,
      switchValue: locationSharing,
      onSwitchChange: setLocationSharing,
    },
    {
      title: 'Yardım & Destek',
      icon: '❓',
      action: () => Alert.alert('Yardım', 'Destek sayfasına yönlendirileceksiniz.'),
    },
    {
      title: 'Hakkında',
      icon: 'ℹ️',
      action: () => Alert.alert('Hakkında', 'Memleket App v1.0.0'),
    },
  ];

  const getUserTypeText = (userType: UserType) => {
    switch (userType) {
      case UserType.STUDENT:
        return 'Öğrenci';
      case UserType.PROFESSIONAL:
        return 'Profesyonel';
      case UserType.ENTREPRENEUR:
        return 'Girişimci';
      default:
        return 'Diğer';
    }
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            Alert.alert('Başarılı', 'Hesabınızdan çıkış yapıldı.');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#45B7D1']}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImageText}>
            {user.firstName[0]}{user.lastName[0]}
          </Text>
        </View>
        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.userLocation}>
          📍 {user.hometown} → {user.currentCity}
        </Text>
        <Text style={styles.userType}>{getUserTypeText(user.userType)}</Text>
        {user.university && (
          <Text style={styles.university}>🎓 {user.university}</Text>
        )}
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.connections}</Text>
          <Text style={styles.statLabel}>Bağlantı</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.events}</Text>
          <Text style={styles.statLabel}>Etkinlik</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.messages}</Text>
          <Text style={styles.statLabel}>Mesaj</Text>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hakkımda</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İlgi Alanları</Text>
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Member Since */}
      <View style={styles.section}>
        <Text style={styles.memberSince}>
          🗓️ Üye olduğu tarih: {formatJoinDate(user.joinedDate)}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action}
            disabled={item.hasSwitch}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            {item.hasSwitch ? (
              <Switch
                value={item.switchValue}
                onValueChange={item.onSwitchChange}
                trackColor={{ false: '#e1e5e9', true: '#4ECDC4' }}
                thumbColor={item.switchValue ? 'white' : '#f4f3f4'}
              />
            ) : (
              <Text style={styles.menuArrow}>›</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('logout')}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Memleket App v1.0.0</Text>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  userType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  university: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    margin: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  interestText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});