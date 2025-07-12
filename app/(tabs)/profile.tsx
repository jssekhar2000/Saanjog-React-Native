import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  Settings, 
  Edit, 
  Camera, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Heart,
  Shield,
  Crown,
  LogOut
} from 'lucide-react-native';
import CustomButton from '../../components/common/CustomButton';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SIZES } from '../../utils/constants';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'preferences'>('about');

  if (!user) {
    return null;
  }

  const age = new Date().getFullYear() - new Date(user?.dateOfBirth).getFullYear();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const renderTabButton = (tab: 'about' | 'photos' | 'preferences', title: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={SIZES.icon.sm} color={COLORS.text.secondary} />
          <Text style={styles.infoText}>
            {user?.city}, {user?.state}, {user?.country}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Briefcase size={SIZES.icon.sm} color={COLORS.text.secondary} />
          <Text style={styles.infoText}>{user?.profession}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <GraduationCap size={SIZES.icon.sm} color={COLORS.text.secondary} />
          <Text style={styles.infoText}>{user?.education}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Height</Text>
          <Text style={styles.detailValue}>{user?.height}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Religion</Text>
          <Text style={styles.detailValue}>{user?.religion}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Caste</Text>
          <Text style={styles.detailValue}>{user?.caste}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Marital Status</Text>
          <Text style={styles.detailValue}>
            {user?.maritalStatus?.replace('_', ' ').replace(/\b\w/g, l => l?.toUpperCase())}
          </Text>
        </View>
      </View>

      {user?.bio && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{user?.bio}</Text>
        </View>
      )}

      {user?.interests?.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {user?.interests?.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderPhotosTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.photosGrid}>
        {user?.photos?.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.photoItem}
            resizeMode="cover"
          />
        ))}
        
        <TouchableOpacity style={styles.addPhotoButton}>
          <Camera size={SIZES.icon.md} color={COLORS.text.hint} />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPreferencesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Partner Preferences</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Age Range</Text>
          <Text style={styles.detailValue}>
            {user?.preferences?.ageRange?.min} - {user?.preferences?.ageRange?.max} years
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Height Range</Text>
          <Text style={styles.detailValue}>
            {user?.preferences?.heightRange?.min} - {user?.preferences?.heightRange?.max}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Religions</Text>
          <Text style={styles.detailValue}>
            {user?.preferences?.religions?.join(', ') || 'Any'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Education</Text>
          <Text style={styles.detailValue}>
            {user?.preferences?.educations?.join(', ') || 'Any'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'about':
        return renderAboutTab();
      case 'photos':
        return renderPhotosTab();
      case 'preferences':
        return renderPreferencesTab();
      default:
        return renderAboutTab();
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSettings}>
            <Settings size={SIZES.icon.md} color={COLORS.background.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Profile</Text>
          
          <TouchableOpacity onPress={handleEditProfile}>
            <Edit size={SIZES.icon.md} color={COLORS.background.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {/* <Image
              source={{ uri: user?.profilePicture || user?.photos[0] }}
              style={styles.avatar}
              resizeMode="cover"
            /> */}
            {user?.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={SIZES.icon.xs} color={COLORS.background.primary} />
              </View>
            )}
            {user?.premium && (
              <View style={styles.premiumBadge}>
                <Crown size={SIZES.icon.xs} color={COLORS.warning} />
              </View>
            )}
          </View>
          
          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.profileAge}>{age} years old</Text>
          
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Heart size={SIZES.icon.sm} color={COLORS.background.primary} />
              <Text style={styles.statText}>95% Profile Complete</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            {renderTabButton('about', 'About')}
            {renderTabButton('photos', 'Photos')}
            {renderTabButton('preferences', 'Preferences')}
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderCurrentTab()}
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              size="medium"
              icon={<LogOut size={SIZES.icon.sm} color={COLORS.error} />}
              textStyle={{ color: COLORS.error }}
              style={{ borderColor: COLORS.error }}
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  headerTitle: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    fontFamily: 'Poppins-Bold',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.background.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background.primary,
  },
  premiumBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.background.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    fontFamily: 'Poppins-Bold',
  },
  profileAge: {
    fontSize: SIZES.subheading,
    color: COLORS.background.primary,
    opacity: 0.8,
    fontFamily: 'Inter-Regular',
  },
  profileStats: {
    marginTop: SIZES.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  statText: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    fontFamily: 'Inter-Medium',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Medium',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: SIZES.lg,
  },
  infoSection: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.subheading,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
    fontFamily: 'Inter-SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  infoText: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    fontFamily: 'Inter-Regular',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailLabel: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  detailValue: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  bioText: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  interestChip: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  interestText: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    fontFamily: 'Inter-Medium',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  photoItem: {
    width: '48%',
    height: 150,
    borderRadius: SIZES.radius.md,
  },
  addPhotoButton: {
    width: '48%',
    height: 150,
    borderRadius: SIZES.radius.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.secondary,
  },
  addPhotoText: {
    fontSize: SIZES.body,
    color: COLORS.text.hint,
    marginTop: SIZES.xs,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});