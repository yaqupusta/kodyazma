import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { t } from '../../localization';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  organizerHometown: string;
  attendees: number;
  maxAttendees: number;
  isJoined: boolean;
  category: 'social' | 'professional' | 'cultural' | 'sports';
}

// Mock events data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Ankaralılar Kahve Buluşması',
    description: 'İstanbulda yaşayan Ankaralıların kahve içme etkinliği. Sohbet edip tanışalım!',
    date: new Date('2024-01-15T14:00:00'),
    location: 'Kadıköy Moda',
    organizer: 'Mehmet Yılmaz',
    organizerHometown: 'Ankara',
    attendees: 12,
    maxAttendees: 20,
    isJoined: false,
    category: 'social',
  },
  {
    id: '2',
    title: 'İzmir Networking Gecesi',
    description: 'Teknoloji sektoründe çalışan İzmirliler için networking etkinliği.',
    date: new Date('2024-01-20T19:00:00'),
    location: 'Levent Plaza',
    organizer: 'Ayşe Kaya',
    organizerHometown: 'İzmir',
    attendees: 25,
    maxAttendees: 50,
    isJoined: true,
    category: 'professional',
  },
  {
    id: '3',
    title: 'Bursa Futbol Turnuvası',
    description: 'Bursalılar arası futbol turnuvası. Hem spor yapalım hem de eğlenelim!',
    date: new Date('2024-01-25T10:00:00'),
    location: 'Florya Spor Tesisleri',
    organizer: 'Ali Demir',
    organizerHometown: 'Bursa',
    attendees: 16,
    maxAttendees: 32,
    isJoined: false,
    category: 'sports',
  },
];

export const EventsScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [selectedTab, setSelectedTab] = useState<'all' | 'my' | 'joined'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: '',
    category: 'social' as Event['category'],
  });

  const getCategoryEmoji = (category: Event['category']) => {
    switch (category) {
      case 'social': return '☕';
      case 'professional': return '💼';
      case 'cultural': return '🎭';
      case 'sports': return '⚽';
      default: return '📅';
    }
  };

  const getCategoryName = (category: Event['category']) => {
    switch (category) {
      case 'social': return 'Sosyal';
      case 'professional': return 'Profesyonel';
      case 'cultural': return 'Kültürel';
      case 'sports': return 'Spor';
      default: return 'Diğer';
    }
  };

  const filteredEvents = events.filter(event => {
    switch (selectedTab) {
      case 'my':
        return event.organizer === 'Mehmet Yılmaz'; // Current user
      case 'joined':
        return event.isJoined;
      default:
        return true;
    }
  });

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isJoined: !event.isJoined, attendees: event.isJoined ? event.attendees - 1 : event.attendees + 1 }
        : event
    ));
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: new Date(newEvent.date),
      location: newEvent.location,
      organizer: 'Mehmet Yılmaz', // Current user
      organizerHometown: 'Ankara', // Current user's hometown
      attendees: 1,
      maxAttendees: parseInt(newEvent.maxAttendees) || 10,
      isJoined: true,
      category: newEvent.category,
    };

    setEvents(prev => [event, ...prev]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
      maxAttendees: '',
      category: 'social',
    });
    Alert.alert('Başarılı!', 'Etkinlik oluşturuldu.');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEvent = (event: Event) => (
    <View key={event.id} style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryEmoji}>{getCategoryEmoji(event.category)}</Text>
          <Text style={styles.categoryText}>{getCategoryName(event.category)}</Text>
        </View>
        <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
      </View>

      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>

      <View style={styles.eventDetails}>
        <Text style={styles.eventLocation}>📍 {event.location}</Text>
        <Text style={styles.eventOrganizer}>
          👤 {event.organizer} ({event.organizerHometown})
        </Text>
        <Text style={styles.eventAttendees}>
          👥 {event.attendees}/{event.maxAttendees} katılımcı
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.joinButton,
          event.isJoined && styles.joinedButton,
          event.attendees >= event.maxAttendees && !event.isJoined && styles.fullButton
        ]}
        onPress={() => handleJoinEvent(event.id)}
        disabled={event.attendees >= event.maxAttendees && !event.isJoined}
      >
        <Text style={[
          styles.joinButtonText,
          event.isJoined && styles.joinedButtonText,
          event.attendees >= event.maxAttendees && !event.isJoined && styles.fullButtonText
        ]}>
          {event.attendees >= event.maxAttendees && !event.isJoined 
            ? 'Dolu' 
            : event.isJoined 
              ? 'Katılım İptal Et' 
              : t('joinEvent')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('events')}</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ {t('createEvent')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            Tüm Etkinlikler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'joined' && styles.activeTab]}
          onPress={() => setSelectedTab('joined')}
        >
          <Text style={[styles.tabText, selectedTab === 'joined' && styles.activeTabText]}>
            {t('attendingEvents')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'my' && styles.activeTab]}
          onPress={() => setSelectedTab('my')}
        >
          <Text style={[styles.tabText, selectedTab === 'my' && styles.activeTabText]}>
            {t('myEvents')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.eventsList}>
        {filteredEvents.map(renderEvent)}
      </ScrollView>

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('createEvent')}</Text>
            <TouchableOpacity onPress={handleCreateEvent}>
              <Text style={styles.saveButton}>{t('save')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('eventTitle')}</Text>
              <TextInput
                style={styles.input}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, title: text }))}
                placeholder="Etkinlik başlığını girin"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('eventDescription')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, description: text }))}
                placeholder="Etkinlik açıklamasını girin"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('eventDate')}</Text>
              <TextInput
                style={styles.input}
                value={newEvent.date}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, date: text }))}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('eventLocation')}</Text>
              <TextInput
                style={styles.input}
                value={newEvent.location}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, location: text }))}
                placeholder="Etkinlik konumunu girin"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Maksimum Katılımcı</Text>
              <TextInput
                style={styles.input}
                value={newEvent.maxAttendees}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, maxAttendees: text }))}
                placeholder="20"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#9B59B6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#9B59B6',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  eventsList: {
    flex: 1,
    padding: 20,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#9B59B6',
    fontWeight: '600',
  },
  eventDate: {
    fontSize: 12,
    color: '#999',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  eventDetails: {
    marginBottom: 15,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventOrganizer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventAttendees: {
    fontSize: 14,
    color: '#9B59B6',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#9B59B6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: '#e74c3c',
  },
  fullButton: {
    backgroundColor: '#95a5a6',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  joinedButtonText: {
    color: 'white',
  },
  fullButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#9B59B6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
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
    height: 100,
    textAlignVertical: 'top',
  },
});