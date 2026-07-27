import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

type CategoryKey = 'plumbing' | 'electrical' | 'painting' | 'cleaning';
type Urgency = 'now' | 'schedule';

const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: 'plumbing', label: 'Plumbing', icon: 'water-outline' },
  { key: 'electrical', label: 'Electrical', icon: 'flash-outline' },
  { key: 'painting', label: 'Painting', icon: 'color-palette-outline' },
  { key: 'cleaning', label: 'Cleaning', icon: 'sparkles-outline' },
];

export default function PostAJobScreen() {
  const T = useThemeColors();
  const params = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState<CategoryKey>((params.category as CategoryKey) || 'plumbing');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('now');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const handlePostJob = () => {
    // TODO: POST to your job-requests endpoint
    router.push('/bid-comparison' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Waker</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: T.text }]}>New Request</Text>
          <Text style={[styles.subtitle, { color: T.subText }]}>Find a reliable professional in your community.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: T.subText }]}>SERVICE CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((c) => {
              const active = c.key === category;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: T.inputBg },
                    active && { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, borderWidth: 2 },
                  ]}
                  onPress={() => setCategory(c.key)}
                >
                  <Ionicons name={c.icon as any} size={26} color={active ? COLORS.primary : T.subText} />
                  <Text style={[styles.categoryLabel, { color: T.subText }, active && { color: T.text, fontWeight: '700' }]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
          <Text style={[styles.sectionLabel, { color: T.subText }]}>DESCRIPTION</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: T.inputBg, borderBottomColor: T.border, color: T.text }]}
            multiline
            placeholder="Describe the issue... e.g. My kitchen sink is leaking and needs urgent repair."
            placeholderTextColor={T.subText}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[styles.sectionLabel, { color: T.subText, marginTop: 4 }]}>PHOTOS (OPTIONAL)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.addPhotoButton, { borderColor: T.border }]} onPress={handleAddPhoto}>
              <Ionicons name="camera-outline" size={22} color={T.subText} />
              <Text style={[styles.addPhotoText, { color: T.subText }]}>ADD PHOTO</Text>
            </TouchableOpacity>
            {photos.map((uri) => (
              <View key={uri} style={styles.photoThumbWrap}>
                <Image source={{ uri }} style={styles.photoThumb} />
                <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => handleRemovePhoto(uri)}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: T.subText }]}>URGENCY</Text>
          <View style={[styles.urgencyRow, { backgroundColor: T.inputBg }]}>
            <TouchableOpacity
              style={[styles.urgencyTab, urgency === 'now' && { backgroundColor: COLORS.primary }]}
              onPress={() => setUrgency('now')}
            >
              <Text style={[styles.urgencyText, { color: T.subText }, urgency === 'now' && { color: '#fff' }]}>Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.urgencyTab, urgency === 'schedule' && { backgroundColor: COLORS.primary }]}
              onPress={() => setUrgency('schedule')}
            >
              <Text style={[styles.urgencyText, { color: T.subText }, urgency === 'schedule' && { color: '#fff' }]}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, styles.locationCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <Text style={[styles.locationText, { color: T.text }]}>Cantonments, Accra</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.mapPlaceholder, { backgroundColor: T.inputBg }]}>
            <Ionicons name="map-outline" size={32} color={T.subText} />
          </View>
        </View>

        <View style={[styles.priceBox, { backgroundColor: COLORS.primaryLight, borderLeftColor: COLORS.primary }]}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.priceLabel}>Suggested Price Range</Text>
            <Text style={[styles.priceValue, { color: T.text }]}>
              Similar jobs in your area: <Text style={{ fontWeight: 'bold' }}>GH₵150–GH₵250</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.postButton} onPress={handlePostJob} activeOpacity={0.85}>
        <Text style={styles.postButtonText}>Post Job</Text>
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconFocused: 'home', label: 'Home', route: '/home', active: false },
          { icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'add', iconFocused: 'add', label: '', route: '/post-a-job', center: true },
          { icon: 'chatbubble-outline', iconFocused: 'chatbubble', label: 'Messages', route: '/messages', active: false },
          { icon: 'person-outline', iconFocused: 'person', label: 'Profile', route: '/profile', active: false },
        ].map((tab) =>
          (tab as any).center ? (
            <TouchableOpacity key="center" style={styles.centerBtn} activeOpacity={0.85} onPress={() => router.push(tab.route as any)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab.label} style={styles.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
              <Ionicons name={(tab.active ? tab.iconFocused : tab.icon) as any} size={22} color={tab.active ? COLORS.primary : T.subText} />
              <Text style={[styles.navLabel, { color: T.subText }, tab.active && styles.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 200, gap: 20 },
  titleBlock: { gap: 4 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14 },
  section: { gap: 12 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  categoryGrid: { flexDirection: 'row', gap: 12 },
  categoryCard: { flex: 1, aspectRatio: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: 'transparent' },
  categoryLabel: { fontSize: 12 },
  card: { borderRadius: 20, borderWidth: 1, padding: 16 },
  textArea: { minHeight: 100, borderRadius: 16, borderBottomWidth: 2, padding: 12, fontSize: 15, textAlignVertical: 'top', marginBottom: 12 },
  addPhotoButton: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, marginRight: 12 },
  addPhotoText: { fontSize: 10, fontWeight: '700' },
  photoThumbWrap: { width: 96, height: 96, borderRadius: 16, marginRight: 12, overflow: 'hidden' },
  photoThumb: { width: '100%', height: '100%' },
  photoRemoveBtn: {
    position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  urgencyRow: { flexDirection: 'row', borderRadius: 999, padding: 4, maxWidth: 320 },
  urgencyTab: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: 'center' },
  urgencyText: { fontSize: 15, fontWeight: '700' },
  locationCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  mapPlaceholder: { height: 140, alignItems: 'center', justifyContent: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 14, fontWeight: '600' },
  changeText: { fontSize: 13, color: COLORS.primary, textDecorationLine: 'underline' },
  priceBox: { flexDirection: 'row', gap: 12, borderLeftWidth: 4, borderRadius: 16, padding: 16 },
  priceLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  priceValue: { fontSize: 14 },
  postButton: {
    position: 'absolute', bottom: 92, left: 20, right: 20, height: 56, borderRadius: 999,
    backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  postButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopWidth: 1, flexDirection: 'row', alignItems: 'center',
    paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8,
  },
});
