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
import { Heart, MessageCircle, Eye } from 'lucide-react-native';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useMatchStore } from '../../store/matchStore';
import { matchService } from '../../services/matchService';
import { Match } from '../../types/user';
import { COLORS, SIZES } from '../../utils/constants';

export default function MatchesScreen() {
  const router = useRouter();
  const { mutualMatches, setMatches } = useMatchStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mutual' | 'liked' | 'viewed'>('mutual');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const matches = await matchService.getMutualMatches();
      setMatches(matches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatPress = (match: Match) => {
    router.push({
      pathname: '/(tabs)/chat',
      params: { userId: match.user.id },
    });
  };

  const handleProfilePress = (match: Match) => {
    router.push({
      pathname: '/profile-detail',
      params: { userId: match.user.id },
    });
  };

  const renderMatchCard = ({ item }: { item: Match }) => {
    const age = new Date().getFullYear() - new Date(item.user.dateOfBirth).getFullYear();
    
    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => handleProfilePress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.user.profilePicture || item.user.photos[0] }}
          style={styles.matchImage}
          resizeMode="cover"
        />
        
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>
            {item.user.firstName} {item.user.lastName}
          </Text>
          <Text style={styles.matchAge}>{age} years old</Text>
          <Text style={styles.matchLocation}>
            {item.user.city}, {item.user.state}
          </Text>
          <Text style={styles.matchProfession}>{item.user.profession}</Text>
          
          <View style={styles.matchStats}>
            <View style={styles.statItem}>
              <Heart size={SIZES.icon.xs} color={COLORS.primary} />
              <Text style={styles.statText}>{item.matchPercentage}% match</Text>
            </View>
            {item.user.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => handleChatPress(item)}
        >
          <MessageCircle size={SIZES.icon.sm} color={COLORS.background.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderTabButton = (tab: 'mutual' | 'liked' | 'viewed', title: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingScreen message="Loading your matches..." />;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <Text style={styles.headerSubtitle}>
            {mutualMatches.length} mutual matches
          </Text>
        </View>

        <View style={styles.tabContainer}>
          {renderTabButton('mutual', 'Mutual', <Heart size={SIZES.icon.xs} color={activeTab === 'mutual' ? COLORS.background.primary : COLORS.text.hint} />)}
          {renderTabButton('liked', 'Liked You', <Heart size={SIZES.icon.xs} color={activeTab === 'liked' ? COLORS.background.primary : COLORS.text.hint} />)}
          {renderTabButton('viewed', 'Viewed', <Eye size={SIZES.icon.xs} color={activeTab === 'viewed' ? COLORS.background.primary : COLORS.text.hint} />)}
        </View>

        <View style={styles.contentContainer}>
          {mutualMatches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Heart size={SIZES.icon.xl} color={COLORS.text.hint} />
              <Text style={styles.emptyTitle}>No matches yet</Text>
              <Text style={styles.emptySubtitle}>
                Keep swiping to find your perfect match!
              </Text>
            </View>
          ) : (
            <FlatList
              data={mutualMatches}
              renderItem={renderMatchCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.matchesList}
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
  headerSubtitle: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    opacity: 0.8,
    fontFamily: 'Inter-Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: SIZES.xs,
    gap: SIZES.xs,
  },
  tabButtonActive: {
    backgroundColor: COLORS.background.primary,
  },
  tabText: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    fontFamily: 'Inter-Medium',
  },
  tabTextActive: {
    color: COLORS.primary,
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
  matchesList: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.primary,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius.md,
  },
  matchInfo: {
    flex: 1,
    marginLeft: SIZES.md,
    justifyContent: 'space-between',
  },
  matchName: {
    fontSize: SIZES.subheading,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  matchAge: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  matchLocation: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  matchProfession: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    fontFamily: 'Inter-Medium',
  },
  matchStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  statText: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    fontFamily: 'Inter-Medium',
  },
  verifiedBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radius.xs,
  },
  verifiedText: {
    fontSize: SIZES.caption,
    color: COLORS.background.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  chatButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});