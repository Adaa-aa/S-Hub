import { COLORS, FONTS, RADIUS, SHADOWS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Electrician', icon: '⚡' },
  { id: '2', name: 'Plumber', icon: '🪠' },
  { id: '3', name: 'Tailor', icon: '🧵' },
  { id: '4', name: 'Mason', icon: '🧱' },
  { id: '5', name: 'Painter', icon: '🎨' },
  { id: '6', name: 'Carpenter', icon: '🪚' },
];

const WORKERS = [
  {
    id: '1',
    name: 'Kofi Mensah',
    skill: 'Electrician',
    rating: 4.9,
    reviews: 28,
    price: 'GH₵ 60/hr',
    location: 'Airport Residential, Accra',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: '2',
    name: 'Ama Serwaa',
    skill: 'Tailor & Designer',
    rating: 4.8,
    reviews: 19,
    price: 'GH₵ 45/hr',
    location: 'East Legon, Accra',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: '3',
    name: 'Kwame Osei',
    skill: 'Plumber & Fitter',
    rating: 4.7,
    reviews: 34,
    price: 'GH₵ 50/hr',
    location: 'Madina, Accra',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    available: false,
  },
  {
    id: '4',
    name: 'Yaa Boateng',
    skill: 'Professional Painter',
    rating: 4.9,
    reviews: 12,
    price: 'GH₵ 55/hr',
    location: 'Osu, Accra',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    available: true,
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filteredWorkers = WORKERS.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.skill.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat ? worker.skill.toLowerCase().includes(selectedCat.toLowerCase()) : true;
    return matchesSearch && matchesCat;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back 👋</Text>
            <Text style={styles.userName}>Akosua Mensah</Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>Accra, Ghana 🇬🇭</Text>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.muted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search electrician, tailor, painter..."
              placeholderTextColor={COLORS.muted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Banner Section */}
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Escrow Protection Active 🔒</Text>
            <Text style={styles.bannerSubtitle}>
              Your payments are secure. We only release funds once you confirm the service is completed.
            </Text>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCat(isSelected ? null : cat.name)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected && styles.categoryNameSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Workers List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCat ? `${selectedCat}s` : 'Recommended Workers'}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.workersList}>
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <View key={worker.id} style={styles.workerCard}>
                <Image source={{ uri: worker.avatar }} style={styles.workerAvatar} />

                <View style={styles.workerInfo}>
                  <View style={styles.workerHeaderRow}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    {worker.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={COLORS.verified} />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.workerSkill}>{worker.skill}</Text>

                  <View style={styles.workerMetaRow}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color={COLORS.star} />
                      <Text style={styles.ratingText}>
                        {worker.rating} <Text style={styles.reviewsText}>({worker.reviews})</Text>
                      </Text>
                    </View>
                    <Text style={styles.workerPrice}>{worker.price}</Text>
                  </View>

                  <View style={styles.locationRow}>
                    <Ionicons name="navigate-outline" size={12} color={COLORS.muted} />
                    <Text style={styles.workerLocation}>{worker.location}</Text>
                  </View>
                </View>

                {/* Status Indicator */}
                <View style={styles.statusIndicatorContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: worker.available ? COLORS.success : COLORS.muted }
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {worker.available ? 'Available' : 'Busy'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No workers found</Text>
              <Text style={styles.emptyStateSub}>Try clearing your filters or search terms.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: FONTS.medium as any,
  },
  userName: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: FONTS.bold as any,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  locationText: {
    fontSize: 12,
    fontWeight: FONTS.semibold as any,
    color: COLORS.primary,
    marginLeft: 4,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGrey,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: COLORS.text,
    fontSize: 14,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  banner: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: RADIUS.xl,
    padding: 18,
    ...SHADOWS.md,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold as any,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: FONTS.bold as any,
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: FONTS.semibold as any,
  },
  categoriesScroll: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    ...SHADOWS.sm,
  },
  categoryCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: FONTS.semibold as any,
    color: COLORS.text,
  },
  categoryNameSelected: {
    color: '#FFFFFF',
  },
  workersList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  workerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 14,
    ...SHADOWS.md,
  },
  workerAvatar: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.bgGrey,
  },
  workerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  workerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workerName: {
    fontSize: 15,
    fontWeight: FONTS.bold as any,
    color: COLORS.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    gap: 2,
  },
  verifiedText: {
    fontSize: 9,
    color: COLORS.verified,
    fontWeight: FONTS.bold as any,
  },
  workerSkill: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  workerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: FONTS.bold as any,
    color: COLORS.text,
  },
  reviewsText: {
    fontWeight: FONTS.regular as any,
    color: COLORS.muted,
  },
  workerPrice: {
    fontSize: 13,
    fontWeight: FONTS.bold as any,
    color: COLORS.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  workerLocation: {
    fontSize: 11,
    color: COLORS.muted,
  },
  statusIndicatorContainer: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGrey,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FONTS.semibold as any,
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold as any,
    color: COLORS.text,
  },
  emptyStateSub: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
    textAlign: 'center',
  },
});