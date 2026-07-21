import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'posted' | 'scheduled' | 'cancelled' | 'saved';

interface Job {
  id: number; title: string; service: string; icon: string; serviceColor: string;
  worker?: string; workerInitials?: string; date: string; time?: string;
  location: string; price: number; status: 'open' | 'assigned' | 'scheduled' | 'completed' | 'cancelled';
  saved?: boolean;
}

const ALL_JOBS: Job[] = [
  { id: 1, title: 'Fix leaking bathroom pipe', service: 'Plumbing', icon: '🔧', serviceColor: '#006B3F', worker: 'Kofi Mensah', workerInitials: 'KM', date: 'Today', location: 'Speedsaf, Kumasi', price: 450, status: 'assigned' },
  { id: 2, title: 'Install ceiling fan', service: 'Electrical', icon: '⚡', serviceColor: '#F59E0B', date: 'Posted 2 days ago', location: 'Osu, Accra', price: 300, status: 'open' },
  { id: 3, title: 'Paint living room walls', service: 'Painting', icon: '🖌️', serviceColor: '#3B82F6', date: 'Posted 3 days ago', location: 'Tema Station, Accra', price: 600, status: 'open' },
  { id: 4, title: 'Kitchen cabinet repair', service: 'Carpentry', icon: '🪚', serviceColor: '#92400E', worker: 'Yaw Boateng', workerInitials: 'YB', date: 'Thu, Jun 19', time: '10:00 AM', location: 'East Legon, Accra', price: 350, status: 'scheduled' },
  { id: 5, title: 'Full house deep cleaning', service: 'Cleaning', icon: '🧹', serviceColor: '#8B5CF6', worker: 'Nana Asante', workerInitials: 'NA', date: 'Sat, Jun 21', time: '8:00 AM', location: 'Ayeduase, Kumasi', price: 250, status: 'scheduled' },
  { id: 6, title: 'Rewire bedroom sockets', service: 'Electrical', icon: '⚡', serviceColor: '#F59E0B', worker: 'Kwame Adjei', workerInitials: 'KA', date: 'Mon, Jun 23', time: '2:00 PM', location: 'Labone, Accra', price: 400, status: 'scheduled' },
  { id: 7, title: 'Roof leak repair', service: 'Masonry', icon: '🏗️', serviceColor: '#6B7280', date: 'Cancelled Jun 10', location: 'Ashaiman, Accra', price: 800, status: 'cancelled' },
  { id: 8, title: 'Window frame replacement', service: 'Carpentry', icon: '🪚', serviceColor: '#92400E', date: 'Cancelled Jun 8', location: 'Achimota, Accra', price: 500, status: 'cancelled' },
  { id: 9, title: 'Kofi Mensah', service: 'Plumber', icon: '🔧', serviceColor: '#006B3F', date: 'Saved Jun 12', location: '2.1 km away', price: 450, status: 'open', saved: true },
  { id: 10, title: 'Ama Owusu', service: 'Painter', icon: '🖌️', serviceColor: '#3B82F6', date: 'Saved Jun 11', location: '3.0 km away', price: 300, status: 'open', saved: true },
  { id: 11, title: 'Nana Asante', service: 'Cleaner', icon: '🧹', serviceColor: '#8B5CF6', date: 'Saved Jun 9', location: '1.2 km away', price: 200, status: 'open', saved: true },
];

const TAB_DATA: Record<Tab, Job[]> = {
  posted: ALL_JOBS.filter(j => j.status === 'open' || j.status === 'assigned'),
  scheduled: ALL_JOBS.filter(j => j.status === 'scheduled'),
  cancelled: ALL_JOBS.filter(j => j.status === 'cancelled'),
  saved: ALL_JOBS.filter(j => j.saved),
};

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  open:      { label: 'Open',      bg: '#E6F4EE', color: COLORS.primary },
  assigned:  { label: 'Assigned',  bg: '#E3F2FD', color: '#1565C0' },
  scheduled: { label: 'Scheduled', bg: '#FFF8E1', color: '#F57F17' },
  completed: { label: 'Completed', bg: '#E8F5E9', color: '#2E7D32' },
  cancelled: { label: 'Cancelled', bg: '#FEECEC', color: COLORS.danger },
};

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('posted');
  const T = useThemeColors();
  const jobs = TAB_DATA[activeTab];

  const TABS: { key: Tab; label: string }[] = [
    { key: 'posted', label: 'Posted' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'saved', label: 'Saved' },
  ];

  const handleCancel = () =>
    Alert.alert('Cancel Job', 'Are you sure you want to cancel this job?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => Alert.alert('Cancelled', 'Your job has been cancelled.') },
    ]);

  const handleUnsave = () =>
    Alert.alert('Remove', 'Remove this worker from saved?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive' },
    ]);

  const renderJob = ({ item: job }: { item: Job }) => {
    const m = STATUS_MAP[job.status];
    return (
      <TouchableOpacity
        style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}
        activeOpacity={0.82}
        onPress={() => router.push(`/worker-profile?id=${job.id}` as any)}
      >
        <View style={s.topRow}>
          <View style={[s.iconWrap, { backgroundColor: job.serviceColor + '18' }]}>
            <Text style={s.icon}>{job.icon}</Text>
          </View>
          <View style={s.topInfo}>
            <Text style={[s.jobTitle, { color: T.text }]} numberOfLines={1}>{job.title}</Text>
            <Text style={[s.service, { color: T.subText }]}>{job.service}</Text>
          </View>
          <View style={[s.chip, { backgroundColor: m.bg }]}>
            <Text style={[s.chipText, { color: m.color }]}>{m.label}</Text>
          </View>
        </View>

        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={T.subText} />
            <Text style={[s.metaText, { color: T.subText }]}>{job.date}{job.time ? ` · ${job.time}` : ''}</Text>
          </View>
          <View style={s.metaItem}>
            <Ionicons name="location-outline" size={13} color={T.subText} />
            <Text style={[s.metaText, { color: T.subText }]} numberOfLines={1}>{job.location}</Text>
          </View>
        </View>

        {job.worker && (
          <View style={[s.workerRow, { backgroundColor: T.inputBg }]}>
            <View style={[s.workerAvatar, { backgroundColor: job.serviceColor + '18' }]}>
              <Text style={[s.workerInitials, { color: job.serviceColor }]}>{job.workerInitials}</Text>
            </View>
            <Text style={[s.workerName, { color: T.text }]}>{job.worker}</Text>
            <TouchableOpacity style={s.chatBtn} activeOpacity={0.75} onPress={() => router.push('/messages' as any)}>
              <Ionicons name="chatbubble-outline" size={14} color={COLORS.primary} />
              <Text style={s.chatBtnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[s.bottomRow, { borderColor: T.border }]}>
          <View>
            <Text style={[s.priceLabel, { color: T.subText }]}>Budget</Text>
            <Text style={s.price}>GH₵ {job.price}</Text>
          </View>
          <View style={s.actions}>
            {activeTab === 'posted' && (
              <>
                <TouchableOpacity style={[s.outlineBtn, { borderColor: T.border }]} onPress={handleCancel} activeOpacity={0.75}>
                  <Text style={[s.outlineBtnText, { color: T.subText }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.solidBtn} activeOpacity={0.8} onPress={() => router.push('/search' as any)}>
                  <Text style={s.solidBtnText}>Find Workers</Text>
                </TouchableOpacity>
              </>
            )}
            {activeTab === 'scheduled' && (
              <>
                <TouchableOpacity style={[s.outlineBtn, { borderColor: T.border }]} onPress={handleCancel} activeOpacity={0.75}>
                  <Text style={[s.outlineBtnText, { color: T.subText }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.solidBtn} activeOpacity={0.8} onPress={() => Alert.alert('Reschedule', 'Date picker coming soon.')}>
                  <Text style={s.solidBtnText}>Reschedule</Text>
                </TouchableOpacity>
              </>
            )}
            {activeTab === 'cancelled' && (
              <TouchableOpacity style={s.solidBtn} activeOpacity={0.8} onPress={() => router.push('/post-a-job' as any)}>
                <Text style={s.solidBtnText}>Re-post Job</Text>
              </TouchableOpacity>
            )}
            {activeTab === 'saved' && (
              <>
                <TouchableOpacity style={[s.outlineBtn, { borderColor: T.border }]} onPress={handleUnsave} activeOpacity={0.75}>
                  <Text style={[s.outlineBtnText, { color: T.subText }]}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.solidBtn} activeOpacity={0.8} onPress={() => router.push('/post-a-job' as any)}>
                  <Text style={s.solidBtnText}>Hire</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      <View style={[s.header, { backgroundColor: T.header }]}>
        <Text style={[s.headerTitle, { color: T.text }]}>My Jobs</Text>
        <TouchableOpacity style={s.postBtn} onPress={() => router.push('/post-a-job' as any)} activeOpacity={0.85}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.postBtnText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.summaryStrip, { backgroundColor: T.card, borderColor: T.border }]}>
        {(['posted', 'scheduled', 'cancelled', 'saved'] as Tab[]).map((tab, i, arr) => (
          <TouchableOpacity
            key={tab}
            style={[s.summaryItem, i < arr.length - 1 && [s.summaryBorder, { borderColor: T.border }]]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.75}
          >
            <Text style={[s.summaryCount, { color: activeTab === tab ? COLORS.primary : T.subText }]}>{TAB_DATA[tab].length}</Text>
            <Text style={[s.summaryLabel, { color: T.subText }]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[s.tabBar, { backgroundColor: T.card, borderColor: T.border }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tab, activeTab === tab.key && s.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.tabText, { color: T.subText }, activeTab === tab.key && s.tabTextActive]}>{tab.label}</Text>
            {TAB_DATA[tab.key].length > 0 && (
              <View style={[s.tabBadge, { backgroundColor: T.inputBg }, activeTab === tab.key && s.tabBadgeActive]}>
                <Text style={[s.tabBadgeText, { color: T.subText }, activeTab === tab.key && s.tabBadgeTextActive]}>{TAB_DATA[tab.key].length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {jobs.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📋</Text>
          <Text style={[s.emptyTitle, { color: T.text }]}>No jobs here</Text>
          <Text style={[s.emptySub, { color: T.subText }]}>Jobs will appear here once you post or book them.</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => String(item.id)}
          renderItem={renderJob}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        />
      )}

      <View style={[s.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/(tabs)/home', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/bookings', active: true },
          { icon: 'add', iconActive: 'add', label: '', route: '/post-a-job', center: true },
          { icon: 'chatbubble-outline', iconActive: 'chatbubble', label: 'Messages', route: '/messages', active: false },
          { icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/profile', active: false },
        ].map(tab =>
          (tab as any).center ? (
            <TouchableOpacity key="center" style={s.centerBtn} activeOpacity={0.85} onPress={() => router.push(tab.route as any)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab.label} style={s.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
              <Ionicons name={tab.active ? (tab.iconActive as any) : (tab.icon as any)} size={22} color={tab.active ? COLORS.primary : T.subText} />
              <Text style={[s.navLabel, { color: T.subText }, tab.active && s.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  postBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  summaryStrip: { flexDirection: 'row', borderBottomWidth: 1 },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  summaryBorder: { borderRightWidth: 1 },
  summaryCount: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  summaryLabel: { fontSize: 10, fontWeight: '500' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12, borderBottomWidth: 2.5, borderColor: 'transparent' },
  tabActive: { borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabBadge: { borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabBadgeActive: { backgroundColor: COLORS.primary + '20' },
  tabBadgeText: { fontSize: 10, fontWeight: '800' },
  tabBadgeTextActive: { color: COLORS.primary },
  list: { paddingTop: 14, paddingBottom: 110 },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 14, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icon: { fontSize: 22 },
  topInfo: { flex: 1 },
  jobTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  service: { fontSize: 12 },
  chip: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  chipText: { fontSize: 11, fontWeight: '700' },
  metaRow: { gap: 5, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, flex: 1 },
  workerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10, marginBottom: 10 },
  workerAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  workerInitials: { fontSize: 11, fontWeight: '800' },
  workerName: { flex: 1, fontSize: 13, fontWeight: '600' },
  chatBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary },
  chatBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10 },
  priceLabel: { fontSize: 10, fontWeight: '500' },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  actions: { flexDirection: 'row', gap: 8 },
  solidBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  solidBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  outlineBtn: { borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  outlineBtnText: { fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 10 },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 },
});
