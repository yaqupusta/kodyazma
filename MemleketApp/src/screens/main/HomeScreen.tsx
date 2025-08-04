import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../localization';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const currentUser = {
    firstName: 'Mehmet',
    hometown: 'Ankara',
    currentCity: 'İstanbul',
  };

  const stats = {
    connections: 24,
    eventsJoined: 5,
    messagesReceived: 12,
  };

  const recentActivity = [
    {
      type: 'connection',
      message: 'Ayşe Kaya ile bağlantı kurdunuz',
      time: '2 saat önce',
      icon: '👥',
    },
    {
      type: 'event',
      message: 'İzmir Networking Gecesi etkinliğine katıldınız',
      time: '1 gün önce',
      icon: '📅',
    },
    {
      type: 'message',
      message: 'Ali Demir size mesaj gönderdi',
      time: '2 gün önce',
      icon: '💬',
    },
  ];

  const quickActions = [
    {
      title: 'Hemşehriler Bul',
      subtitle: 'Yakındaki hemşehrilerinizi keşfedin',
      color: '#45B7D1',
      icon: '🔍',
      action: 'discover',
    },
    {
      title: 'Etkinlik Oluştur',
      subtitle: 'Yeni bir etkinlik organize edin',
      color: '#9B59B6',
      icon: '📅',
      action: 'create-event',
    },
    {
      title: 'Mesajlar',
      subtitle: 'Yeni mesajlarınızı kontrol edin',
      color: '#FF6B6B',
      icon: '💬',
      action: 'messages',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={styles.header}
      >
        <Text style={styles.greeting}>Merhaba, {currentUser.firstName}! 👋</Text>
        <Text style={styles.location}>
          📍 {currentUser.hometown} → {currentUser.currentCity}
        </Text>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.connections}</Text>
          <Text style={styles.statLabel}>Bağlantı</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.eventsJoined}</Text>
          <Text style={styles.statLabel}>Etkinlik</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.messagesReceived}</Text>
          <Text style={styles.statLabel}>Mesaj</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı Eylemler</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <LinearGradient
                colors={[action.color, `${action.color}CC`]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <View style={styles.activityContainer}>
          {recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Featured Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öne Çıkan Etkinlikler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.featuredEvent}>
            <Text style={styles.featuredEventTitle}>Ankaralılar Kahve Buluşması</Text>
            <Text style={styles.featuredEventDate}>15 Ocak, 14:00</Text>
            <Text style={styles.featuredEventLocation}>📍 Kadıköy Moda</Text>
            <TouchableOpacity style={styles.featuredEventButton}>
              <Text style={styles.featuredEventButtonText}>Katıl</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredEvent}>
            <Text style={styles.featuredEventTitle}>İzmir Networking Gecesi</Text>
            <Text style={styles.featuredEventDate}>20 Ocak, 19:00</Text>
            <Text style={styles.featuredEventLocation}>📍 Levent Plaza</Text>
            <TouchableOpacity style={styles.featuredEventButton}>
              <Text style={styles.featuredEventButtonText}>Detaylar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsContainer: {
    gap: 15,
  },
  actionCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activityContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  featuredEvent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featuredEventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  featuredEventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  featuredEventButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  featuredEventButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});