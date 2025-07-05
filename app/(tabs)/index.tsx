import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Heart, X, Sparkles } from 'lucide-react-native';
import ProfileCard from '../../components/common/ProfileCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useAuthStore } from '../../store/authStore';
import { useMatchStore } from '../../store/matchStore';
import { matchService } from '../../services/matchService';
import { socketService } from '../../services/socketService';
import { COLORS, SIZES } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DiscoverScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    currentMatch, 
    matchQueue, 
    setMatchQueue, 
    likeProfile, 
    passProfile, 
    loadNextMatch,
    addMutualMatch 
  } = useMatchStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [swipeAnimation] = useState(new Animated.ValueXY());
  const [opacityAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    if (!user?.firstName) {
      router.replace('/(auth)/onboarding');
      return;
    }

    loadMatches();
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const matches = await matchService.getMatches();
      setMatchQueue(matches);
    } catch (error) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Failed to load matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderMove: (_, gestureState) => {
      swipeAnimation.setValue({ x: gestureState.dx, y: gestureState.dy });
      
      // Update opacity based on swipe direction
      const opacity = 1 - Math.abs(gestureState.dx) / (SCREEN_WIDTH * 0.7);
      opacityAnimation.setValue(opacity);
    },
    
    onPanResponderRelease: (_, gestureState) => {
      const swipeThreshold = SCREEN_WIDTH * 0.3;
      
      if (gestureState.dx > swipeThreshold) {
        // Swipe right - Like
        handleLike();
      } else if (gestureState.dx < -swipeThreshold) {
        // Swipe left - Pass
        handlePass();
      } else {
        // Reset card position
        Animated.parallel([
          Animated.spring(swipeAnimation, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleLike = async () => {
    if (!currentMatch) return;

    try {
      likeProfile(currentMatch.id);
      
      const response = await matchService.likeProfile(currentMatch.id);
      
      if (response.mutual && response.match) {
        addMutualMatch(response.match);
        Alert.alert(
          '🎉 It\'s a Match!',
          `You and ${currentMatch.firstName} liked each other!`,
          [
            { text: 'Say Hi!', onPress: () => router.push('/chat') },
            { text: 'Continue', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }

    animateCardExit('right');
  };

  const handlePass = async () => {
    if (!currentMatch) return;

    try {
      passProfile(currentMatch.id);
      await matchService.passProfile(currentMatch.id);
    } catch (error) {
      console.error('Error passing profile:', error);
    }

    animateCardExit('left');
  };

  const animateCardExit = (direction: 'left' | 'right') => {
    const toValue = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    
    Animated.parallel([
      Animated.timing(swipeAnimation, {
        toValue: { x: toValue, y: 0 },
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Reset animations and load next match
      swipeAnimation.setValue({ x: 0, y: 0 });
      opacityAnimation.setValue(1);
      loadNextMatch();
    });
  };

  const handleProfilePress = () => {
    if (currentMatch) {
      router.push({
        pathname: '/profile-detail',
        params: { userId: currentMatch.id },
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Finding your perfect matches..." />;
  }

  if (!currentMatch) {
    return (
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyContainer}>
            <Sparkles size={SIZES.icon.xl} color={COLORS.background.primary} />
            <Text style={styles.emptyTitle}>No more profiles!</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for new matches or adjust your preferences
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>
            {matchQueue.length} profiles remaining
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                transform: swipeAnimation.getTranslateTransform(),
                opacity: opacityAnimation,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <ProfileCard
              user={currentMatch}
              onLike={handleLike}
              onPass={handlePass}
              onPress={handleProfilePress}
              showActions={true}
            />
          </Animated.View>
        </View>

        <View style={styles.swipeHint}>
          <View style={styles.swipeHintItem}>
            <X size={SIZES.icon.sm} color={COLORS.error} />
            <Text style={styles.swipeHintText}>Swipe left to pass</Text>
          </View>
          <View style={styles.swipeHintItem}>
            <Heart size={SIZES.icon.sm} color={COLORS.primary} />
            <Text style={styles.swipeHintText}>Swipe right to like</Text>
          </View>
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
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
    color: COLORS.background.primary,
    marginTop: SIZES.lg,
    fontFamily: 'Poppins-Bold',
  },
  emptySubtitle: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: SIZES.sm,
    fontFamily: 'Inter-Regular',
  },
  swipeHint: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
  swipeHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  swipeHintText: {
    fontSize: SIZES.caption,
    color: COLORS.background.primary,
    opacity: 0.8,
    fontFamily: 'Inter-Regular',
  },
});