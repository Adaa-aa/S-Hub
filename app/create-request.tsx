// app/create-request.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import BottomNav from '../components/BottomNav';

type CategoryKey = 'plumbing' | 'electrical' | 'painting' | 'cleaning';
type Urgency = 'now' | 'schedule';

const CATEGORIES: { key: CategoryKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'plumbing', label: 'Plumbing', icon: 'plumbing' },
  { key: 'electrical', label: 'Electrical', icon: 'bolt' },
  { key: 'painting', label: 'Painting', icon: 'format-paint' },
  { key: 'cleaning', label: 'Cleaning', icon: 'cleaning-services' },
];

export default function CreateRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState<CategoryKey>(
    (params.category as CategoryKey) || 'plumbing'
  );
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('now');
  const [photoUris, setPhotoUris] = useState<string[]>([]);

  const handleAddPhoto = () => {
    // TODO: wire up expo-image-picker here
  };

  const handlePostJob = () => {
    // TODO: POST to your FastAPI job-requests endpoint
    router.push('/bid-comparison');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.logo}>Waker</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={styles.title}>New Request</Text>
          <Text style={styles.subtitle}>Find a reliable professional in your community.</Text>
        </View>

        {/* Category selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SERVICE CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((c) => {
              const active = c.key === category;
              return (
                <Pressable
                  key={c.key}
                  style={[styles.categoryCard, active && styles.categoryCardActive]}
                  onPress={() => setCategory(c.key)}
                >
                  <MaterialIcons
                    name={c.icon}
                    size={26}
                    color={active ? colors.onPrimaryContainer : colors.primary}
                  />
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Description + photos */}
        <View style={[styles.section, styles.card]}>
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Describe the issue... e.g. My kitchen sink is leaking and needs urgent repair."
            placeholderTextColor={colors.outline}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[styles.sectionLabel, { marginTop: spacing.sm }]}>PHOTOS (OPTIONAL)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <MaterialIcons name="add-a-photo" size={24} color={colors.onSurfaceVariant} />
              <Text style={styles.addPhotoText}>ADD PHOTO</Text>
            </Pressable>
            {photoUris.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.photoThumb} />
            ))}
          </ScrollView>
        </View>

        {/* Urgency toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>URGENCY</Text>
          <View style={styles.urgencyRow}>
            <Pressable
              style={[styles.urgencyTab, urgency === 'now' && styles.urgencyTabActive]}
              onPress={() => setUrgency('now')}
            >
              <Text style={[styles.urgencyText, urgency === 'now' && styles.urgencyTextActive]}>
                Now
              </Text>
            </Pressable>
            <Pressable
              style={[styles.urgencyTab, urgency === 'schedule' && styles.urgencyTabActive]}
              onPress={() => setUrgency('schedule')}
            >
              <Text
                style={[styles.urgencyText, urgency === 'schedule' && styles.urgencyTextActive]}
              >
                Schedule
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Location */}
        <View style={[styles.section, styles.locationCard]}>
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <MaterialIcons name="location-on" size={20} color={colors.primary} />
              <Text style={styles.locationText}>Cantonments, Accra</Text>
            </View>
            <Pressable>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
          <View style={styles.mapPlaceholder}>
            <MaterialIcons name="map" size={32} color={colors.onSurfaceVariant} />
          </View>
        </View>

        {/* Price insight */}
        <View style={styles.priceBox}>
          <MaterialIcons name="info" size={20} color={colors.tertiary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.priceLabel}>Suggested Price Range</Text>
            <Text style={styles.priceValue}>
              Similar jobs in your area: <Text style={{ fontWeight: 'bold' }}>GH₵150–GH₵250</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Post button */}
      <Pressable style={styles.postButton} onPress={handlePostJob}>
        <Text style={styles.postButtonText}>Post Job</Text>
        <MaterialIcons name="send" size={20} color={colors.onTertiaryContainer} />
      </Pressable>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.base,
  },
  logo: { ...typography.headlineLgMobile, fontSize: 20, color: colors.primary, fontWeight: '900' },
  scrollContent: {
    paddingHorizontal: spacing.containerMargin,
    paddingBottom: 200,
    gap: spacing.md,
  },
  titleBlock: { gap: 4 },
  title: { ...typography.headlineMd, color: colors.onSurface },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  section: { gap: spacing.sm },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  categoryGrid: { flexDirection: 'row', gap: spacing.sm },
  categoryCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  categoryCardActive: {
    backgroundColor: colors.primaryContainer + '22',
    borderColor: colors.primary,
  },
  categoryLabel: { ...typography.labelMd, color: colors.onSurfaceVariant, fontSize: 12 },
  categoryLabelActive: { color: colors.onSurface, fontWeight: '700' },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm,
  },
  textArea: {
    minHeight: 100,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.outline,
    padding: spacing.sm,
    ...typography.bodyMd,
    color: colors.onSurface,
    textAlignVertical: 'top',
  },
  addPhotoButton: {
    width: 96,
    height: 96,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    gap: 4,
  },
  addPhotoText: { fontSize: 10, fontWeight: '700', color: colors.onSurfaceVariant },
  photoThumb: { width: 96, height: 96, borderRadius: radius.xl, marginRight: spacing.sm },
  urgencyRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.full,
    padding: 4,
    maxWidth: 320,
  },
  urgencyTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  urgencyTabActive: { backgroundColor: colors.primary },
  urgencyText: { ...typography.button, color: colors.onSurfaceVariant },
  urgencyTextActive: { color: '#fff' },
  locationCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { ...typography.labelMd, color: colors.onSurface },
  changeText: { ...typography.bodyMd, fontSize: 13, color: colors.primary, textDecorationLine: 'underline' },
  mapPlaceholder: {
    height: 140,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.tertiaryContainer + '1A',
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiary,
    borderRadius: radius.xl,
    padding: spacing.sm,
  },
  priceLabel: { ...typography.labelMd, color: colors.tertiary, fontWeight: '700' },
  priceValue: { ...typography.bodyMd, color: colors.onSurface },
  postButton: {
    position: 'absolute',
    bottom: 92,
    left: spacing.containerMargin,
    right: spacing.containerMargin,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.tertiaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  postButtonText: { ...typography.button, color: colors.onTertiaryContainer },
});
