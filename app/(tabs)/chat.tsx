import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, Szearch, Search} from 'lucide-react-native';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useChatStore } from '../../store/chatStore';
import { chatService } from '../../services/chatService';
import { socketService } from '../../services/socketService';
import { Chat } from '../../types/user';
import { COLORS, SIZES } from '../../utils/constants';

export default function ChatScreen() {
  const router = useRouter();
  const { chats, setChats } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChats();
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const chatList = await chatService.getChats();
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: '/chat-detail',
      params: { chatId: chat.id },
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    // Get the other participant (not the current user)
    const otherParticipant = item.participants.find(p => p !== 'currentUserId'); // Replace with actual user ID
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }} // Placeholder
          style={styles.avatar}
          resizeMode="cover"
        />
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>Priya Sharma</Text>
            <Text style={styles.chatTime}>
              {item.lastMessage ? formatTime(item.lastMessage.timestamp) : ''}
            </Text>
          </View>
          
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.content || 'Start a conversation...'}
          </Text>
        </View>

        <View style={styles.chatStatus}>
          {!item.lastMessage?.read && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>1</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your conversations..." />;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={SIZES.icon.sm} color={COLORS.background.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {chats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageCircle size={SIZES.icon.xl} color={COLORS.text.hint} />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySubtitle}>
                Start chatting with your matches to see conversations here
              </Text>
            </View>
          ) : (
            <FlatList
              data={chats}
              renderItem={renderChatItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatsList}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.lg,
  },
  headerTitle: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    fontFamily: 'Poppins-Bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    paddingTop: SIZES.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  emptyTitle: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: SIZES.lg,
    fontFamily: 'Poppins-Bold',
  },
  emptySubtitle: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SIZES.sm,
    fontFamily: 'Inter-Regular',
  },
  chatsList: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.md,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  chatName: {
    fontSize: SIZES.subheading,
    fontWeight: '600',
    color: COLORS.text.primary,
    fontFamily: 'Inter-SemiBold',
  },
  chatTime: {
    fontSize: SIZES.caption,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  lastMessage: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  chatStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.sm,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontSize: SIZES.caption,
    color: COLORS.background.primary,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
});