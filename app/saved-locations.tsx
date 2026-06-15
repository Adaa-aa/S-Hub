import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL = [
  { id: 1, label: 'Home',   address: 'Speedsaf Ayeduase, Kumasi', icon: 'home-outline',   pinned: true  },
  { id: 2, label: 'Work',   address: 'Tech Hub, Accra Central',   icon: 'briefcase-outline', pinned: true  },
  { id: 3, label: 'Gym',    address: 'Fit Nation, Osu, Accra',    icon: 'fitness-outline', pinned: false },
];

export default function SavedLocationsScreen() {
  const [locations, setLocations] = useState(INITIAL);

  const remove = (id: number) => {
    Alert.alert('Remove', 'Remove this saved location?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setLocations(l => l.filter(x => x.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={s.title}>Saved Locations</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Map placeholder */}
        <View style={s.mapBox}>
          <Ionicons name="map" size={42} color={COLORS.primary + '60'} />
          <Text style={s.mapText}>Your saved places appear here</Text>
        </View>

        <Text style={s.sectionLabel}>Saved Places</Text>
        <View style={s.card}>
          {locations.map((loc, i) => (
            <View key={loc.id}>
              {i > 0 && <View style={s.divider} />}
              <View style={s.locRow}>
                <View style={[s.locIcon, { backgroundColor: loc.pinned ? COLORS.primary + '18' : '#F5F5F5' }]}>
                  <Ionicons name={loc.icon as any} size={20} color={loc.pinned ? COLORS.primary : COLORS.muted} />
                </View>
                <View style={s.locInfo}>
                  <Text style={s.locLabel}>{loc.label}</Text>
                  <Text style={s.locAddress} numberOfLines={1}>{loc.address}</Text>
                </View>
                <TouchableOpacity style={s.removeBtn} onPress={() => remove(loc.id)}>
                  <Ionicons name="close-circle-outline" size={20} color={COLORS.muted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={s.divider} />
          <TouchableOpacity
            style={s.addRow}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Add Location', 'Location picker coming soon.')}
          >
            <View style={[s.locIcon, { backgroundColor: COLORS.primary + '18' }]}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </View>
            <Text style={[s.locLabel, { color: COLORS.primary }]}>Add a place</Text>
          </TouchableOpacity>
        </View>

        {/* Recent searches */}
        <Text style={s.sectionLabel}>Recent Searches</Text>
        <View style={s.card}>
          {['Accra Mall, Accra', 'Kejetia Market, Kumasi', 'Tema Station, Accra'].map((place, i, arr) => (
            <View key={place}>
              {i > 0 && <View style={s.divider} />}
              <TouchableOpacity style={s.recentRow} activeOpacity={0.7}>
                <Ionicons name="time-outline" size={18} color={COLORS.muted} style={{ width: 22 }} />
                <Text style={s.recentText}>{place}</Text>
                <Ionicons name="chevron-forward" size={16} color="#BBB" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  scroll: { padding: 16, paddingBottom: 40 },
  mapBox: { backgroundColor: '#E8F0E9', borderRadius: 16, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 10 },
  mapText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden' },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 56 },
  locRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  locIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  locInfo: { flex: 1 },
  locLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  locAddress: { fontSize: 12, color: COLORS.muted },
  removeBtn: { padding: 4 },
  addRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  recentText: { flex: 1, fontSize: 13, color: '#1A1A1A' },
});
