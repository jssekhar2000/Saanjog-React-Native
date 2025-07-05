import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Briefcase, GraduationCap, Heart, X } from 'lucide-react-native';
import { User } from '../../types/user';
import { COLORS, SIZES } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

interface ProfileCardProps {
  user: User;
  onLike?: () => void;
  onPass?: () => void;
  onPress?: () => void;
  showActions?: boolean;
}

export default function ProfileCard({
  user,
  onLike,
  onPass,
  onPress,
  showActions = true,
}: ProfileCardProps) {
  const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: user.profilePicture || user.photos[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}, {age}
            </Text>
            
            <View style={styles.infoRow}>
              <MapPin size={SIZES.icon.xs} color={COLORS.background.primary} />
              <Text style={styles.infoText}>
                {user.city}, {user.state}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Briefcase size={SIZES.icon.xs} color={COLORS.background.primary} />
              <Text style={styles.infoText}>{user.profession}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <GraduationCap size={SIZES.icon.xs} color={COLORS.background.primary} />
              <Text style={styles.infoText}>{user.education}</Text>
            </View>
            
            <Text style={styles.religion}>
              {user.religion} • {user.caste}
            </Text>
          </View>
        </LinearGradient>
        
        {user.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={onPass}
          >
            <X size={SIZES.icon.md} color={COLORS.error} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={onLike}
          >
            <Heart size={SIZES.icon.md} color={COLORS.background.primary} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SIZES.sm,
  },
  card: {
    width: CARD_WIDTH,
    height: 500,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.background.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  userInfo: {
    gap: SIZES.xs,
  },
  name: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    marginBottom: SIZES.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  infoText: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    flex: 1,
  },
  religion: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    opacity: 0.8,
    marginTop: SIZES.xs,
  },
  verifiedBadge: {
    position: 'absolute',
    top: SIZES.md,
    right: SIZES.md,
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: COLORS.background.primary,
    fontSize: SIZES.subheading,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.lg,
    paddingHorizontal: SIZES.xxl,
    width: CARD_WIDTH,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  likeButton: {
    backgroundColor: COLORS.primary,
  },
});