import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, Search as SearchIcon, X } from 'lucide-react-native';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import ProfileCard from '../../components/common/ProfileCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useMatchStore } from '../../store/matchStore';
import { matchService } from '../../services/matchService';
import { UserPreferences, User } from '../../types/user';
import { COLORS, SIZES, RELIGIONS, EDUCATION_LEVELS, PROFESSIONS, HEIGHTS, MARITAL_STATUS, INDIAN_STATES } from '../../utils/constants';

interface FilterState {
  ageMin: string;
  ageMax: string;
  heightMin: string;
  heightMax: string;
  religions: string[];
  educations: string[];
  professions: string[];
  maritalStatuses: string[];
  cities: string[];
  states: string[];
}

const initialFilters: FilterState = {
  ageMin: '18',
  ageMax: '35',
  heightMin: '5\'0"',
  heightMax: '6\'0"',
  religions: [],
  educations: [],
  professions: [],
  maritalStatuses: [],
  cities: [],
  states: [],
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchParams: Partial<UserPreferences> = {
        ageRange: {
          min: parseInt(filters.ageMin),
          max: parseInt(filters.ageMax),
        },
        heightRange: {
          min: filters.heightMin,
          max: filters.heightMax,
        },
        religions: filters.religions,
        educations: filters.educations,
        professions: filters.professions,
        maritalStatuses: filters.maritalStatuses,
        locations: {
          cities: filters.cities,
          states: filters.states,
          radius: 100, // Default radius
        },
      };

      const results = await matchService.getMatches(searchParams);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchResults([]);
  };

  const toggleMultiSelectFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item: string) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Search Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <X size={SIZES.icon.md} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Age Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Age Range</Text>
            <View style={styles.rangeContainer}>
              <CustomInput
                label="Min Age"
                value={filters.ageMin}
                onChangeText={(text) => setFilters(prev => ({ ...prev, ageMin: text }))}
                keyboardType="numeric"
                containerStyle={styles.rangeInput}
              />
              <CustomInput
                label="Max Age"
                value={filters.ageMax}
                onChangeText={(text) => setFilters(prev => ({ ...prev, ageMax: text }))}
                keyboardType="numeric"
                containerStyle={styles.rangeInput}
              />
            </View>
          </View>

          {/* Height Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Height Range</Text>
            <View style={styles.rangeContainer}>
              <CustomInput
                label="Min Height"
                value={filters.heightMin}
                onChangeText={(text) => setFilters(prev => ({ ...prev, heightMin: text }))}
                containerStyle={styles.rangeInput}
              />
              <CustomInput
                label="Max Height"
                value={filters.heightMax}
                onChangeText={(text) => setFilters(prev => ({ ...prev, heightMax: text }))}
                containerStyle={styles.rangeInput}
              />
            </View>
          </View>

          {/* Religion */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Religion</Text>
            <View style={styles.chipContainer}>
              {RELIGIONS.map((religion) => (
                <TouchableOpacity
                  key={religion}
                  style={[
                    styles.chip,
                    filters.religions.includes(religion) && styles.chipActive,
                  ]}
                  onPress={() => toggleMultiSelectFilter('religions', religion)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.religions.includes(religion) && styles.chipTextActive,
                    ]}
                  >
                    {religion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Education */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Education</Text>
            <View style={styles.chipContainer}>
              {EDUCATION_LEVELS.map((education) => (
                <TouchableOpacity
                  key={education}
                  style={[
                    styles.chip,
                    filters.educations.includes(education) && styles.chipActive,
                  ]}
                  onPress={() => toggleMultiSelectFilter('educations', education)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.educations.includes(education) && styles.chipTextActive,
                    ]}
                  >
                    {education}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Profession */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Profession</Text>
            <View style={styles.chipContainer}>
              {PROFESSIONS.map((profession) => (
                <TouchableOpacity
                  key={profession}
                  style={[
                    styles.chip,
                    filters.professions.includes(profession) && styles.chipActive,
                  ]}
                  onPress={() => toggleMultiSelectFilter('professions', profession)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.professions.includes(profession) && styles.chipTextActive,
                    ]}
                  >
                    {profession}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Marital Status */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Marital Status</Text>
            <View style={styles.chipContainer}>
              {MARITAL_STATUS.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.chip,
                    filters.maritalStatuses.includes(status) && styles.chipActive,
                  ]}
                  onPress={() => toggleMultiSelectFilter('maritalStatuses', status)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.maritalStatuses.includes(status) && styles.chipTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <CustomButton
            title="Reset"
            onPress={resetFilters}
            variant="outline"
            size="medium"
            style={styles.modalButton}
          />
          <CustomButton
            title="Apply Filters"
            onPress={() => {
              setShowFilters(false);
              handleSearch();
            }}
            variant="primary"
            size="medium"
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );

  const renderSearchResult = ({ item }: { item: User }) => (
    <ProfileCard
      user={item}
      showActions={false}
      onPress={() => {
        // Navigate to profile detail
      }}
    />
  );

  if (isLoading) {
    return <LoadingScreen message="Searching profiles..." />;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
          <Text style={styles.headerSubtitle}>Find your perfect match</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <CustomInput
              placeholder="Search by name, profession, location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<SearchIcon size={SIZES.icon.sm} color={COLORS.text.hint} />}
              containerStyle={styles.searchInput}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(true)}
            >
              <Filter size={SIZES.icon.sm} color={COLORS.background.primary} />
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Search"
            onPress={handleSearch}
            variant="primary"
            size="medium"
            style={styles.searchButton}
          />
        </View>

        <View style={styles.resultsContainer}>
          {searchResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SearchIcon size={SIZES.icon.xl} color={COLORS.background.primary} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search criteria or filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>

        {renderFilterModal()}
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
  searchContainer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
  },
  searchButton: {
    marginTop: SIZES.sm,
  },
  resultsContainer: {
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
  resultsList: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Poppins-Bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  filterSection: {
    marginVertical: SIZES.lg,
  },
  filterTitle: {
    fontSize: SIZES.subheading,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
    fontFamily: 'Inter-SemiBold',
  },
  rangeContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  rangeInput: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  chip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background.secondary,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    fontFamily: 'Inter-Medium',
  },
  chipTextActive: {
    color: COLORS.background.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SIZES.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalButton: {
    flex: 1,
  },
});