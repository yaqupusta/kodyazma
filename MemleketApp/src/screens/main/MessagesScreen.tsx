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

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderHometown: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

// Mock messages data
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Ayşe Kaya',
    senderHometown: 'İzmir',
    lastMessage: 'Kahve buluşması için ne zaman müsaitsin?',
    timestamp: new Date('2024-01-10T15:30:00'),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    senderId: '3',
    senderName: 'Ali Demir',
    senderHometown: 'Bursa',
    lastMessage: 'Etkinlik çok güzeldi, teşekkürler!',
    timestamp: new Date('2024-01-09T20:15:00'),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    senderId: '4',
    senderName: 'Zeynep Yılmaz',
    senderHometown: 'Ankara',
    lastMessage: 'Merhaba! Ben de Ankaralıyım, tanışalım mı?',
    timestamp: new Date('2024-01-08T14:22:00'),
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    senderId: '5',
    senderName: 'Emre Özkan',
    senderHometown: 'Konya',
    lastMessage: 'İş görüşmesi için tavsiyeler verebilir misin?',
    timestamp: new Date('2024-01-07T11:45:00'),
    unreadCount: 0,
    isOnline: false,
  },
];

export const MessagesScreen: React.FC = () => {
  const [messages] = useState<Message[]>(MOCK_MESSAGES);
  const [searchText, setSearchText] = useState('');

  const filteredMessages = messages.filter(message =>
    message.senderName.toLowerCase().includes(searchText.toLowerCase()) ||
    message.senderHometown.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return 'Az önce';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} saat önce`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
  };

  const renderMessage = (message: Message) => (
    <TouchableOpacity key={message.id} style={styles.messageItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {message.senderName.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        {message.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{message.senderName}</Text>
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
        </View>
        <Text style={styles.hometown}>📍 {message.senderHometown}</Text>
        <Text style={[
          styles.lastMessage,
          message.unreadCount > 0 && styles.unreadMessage
        ]}>
          {message.lastMessage}
        </Text>
      </View>

      {message.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{message.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('messages')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Mesajlarda ara..."
        />
      </View>

      <ScrollView style={styles.messagesList}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map(renderMessage)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💬</Text>
            <Text style={styles.emptyStateTitle}>Henüz mesajınız yok</Text>
            <Text style={styles.emptyStateSubtitle}>
              Hemşehrilerinizle bağlantı kurmaya başlayın!
            </Text>
            <TouchableOpacity style={styles.discoverButton}>
              <Text style={styles.discoverButtonText}>Hemşehriler Bul</Text>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: '#FF6B6B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
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
  messagesList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: 'white',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  hometown: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  discoverButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  discoverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});