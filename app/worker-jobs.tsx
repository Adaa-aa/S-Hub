import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
import WorkerNav from '@/components/WorkerNav';
import RequireVerifiedWorker from '@/components/RequireVerifiedWorker';

/* ─── Types ─── */
type JobStatus = 'active' | 'completed' | 'cancelled';
type Filter = 'active' | 'completed' | 'cancelled';

type Job = {
  id: string;
  title: string;
  client: string;
  clientInitials: string;
  clientColor: string;
  status: JobStatus;
  date: string;
  amount: number;
  location: string;
};

const JOBS: Job[] = [
  { id: '1', title: 'Fix leaking bathroom pipe', client: 'Akosua Badu', clientInitials: 'AB', clientColor: '#7C3AED', status: 'active', date: 'Today, 2:00 PM', amount: 450, location: 'Adum, Kumasi' },
  { id: '2', title: 'Gutter cleaning & repair', client: 'Mabel Asante', clientInitials: 'MA', clientColor: '#D97706', status: 'active', date: 'Tomorrow, 9:00 AM', amount: 300, location: 'Asokwa, Kumasi' },
  { id: '3', title: 'Bathroom installation', client: 'Ernest Ofori', clientInitials: 'EO', clientColor: '#1D6FBA', status: 'completed', date: '28 Jun', amount: 900, location: 'Bantama, Kumasi' },
  { id: '4', title: 'Kitchen sink repair', client: 'Linda Owusu', clientInitials: 'LO', clientColor: '#DC2626', status: 'completed', date: '25 Jun', amount: 350, location: 'KNUST, Kumasi' },
  { id: '5', title: 'Water heater installation', client: 'Kojo Antwi', clientInitials: 'KA', clientColor: '#0891B2', status: 'cancelled', date: '22 Jun', amount: 600, location: 'Ahodwo, Kumasi' },
];

const STATUS_COLOR: Record<JobStatus, string> = {
  active: COLORS.primary,
  completed: '#22C55E',
  cancelled: '#94A3B8',
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function WorkerJobsScreen() {
  const T = useThemeColors();
  const [filter, setFilter] = useState<Filter>('active');

  const filtered = useMemo(
    () => JOBS.filter((j) => j.status === filter),
    [filter]
  );

  return (
    <RequireVerifiedWorker>
    <SafeAreaView style={[styles.safe, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.pageInner}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: T.text }]}>My Jobs</Text>
      </View>

      {/* Tab Filters */}
      <View style={[styles.tabRow, { borderColor: T.border }]}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={styles.tab}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, { color: isActive ? COLORS.primary : T.subText }, isActive && styles.tabTextActive]}>
                {f.label}
              </Text>
              <View style={[styles.tabIndicator, isActive && { backgroundColor: COLORS.primary }]} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Jobs List */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="briefcase-outline" size={wms(44)} color={T.subText + '50'} />
          <Text style={[styles.emptyTitle, { color: T.text }]}>No {filter} jobs</Text>
          <Text style={[styles.emptySub, { color: T.subText }]}>
            {filter === 'active' ? 'Accept a request from your home screen to get started.' : `You don't have any ${filter} jobs yet.`}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {filtered.map((job) => (
            <View key={job.id} style={[styles.jobCard, { backgroundColor: T.card, borderColor: T.border }]}>
              <View style={[styles.clientAvatar, { backgroundColor: job.clientColor + '18' }]}>
                <Text style={[styles.clientInitials, { color: job.clientColor }]}>{job.clientInitials}</Text>
              </View>

              <View style={styles.jobInfo}>
                <Text style={[styles.jobTitle, { color: T.text }]} numberOfLines={1}>{job.title}</Text>
                <Text style={[styles.jobMeta, { color: T.subText }]} numberOfLines={1}>
                  {job.client} · {job.date}
                </Text>
              </View>

              <View style={styles.jobRight}>
                <Text style={styles.jobAmount}>GH₵ {job.amount}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[job.status] }]} />
                  <Text style={[styles.statusText, { color: STATUS_COLOR[job.status] }]}>
                    {job.status[0].toUpperCase() + job.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      </View>

      <WorkerNav active="jobs" />
    </SafeAreaView>
    </RequireVerifiedWorker>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pageInner: { flex: 1, width: '100%', maxWidth: ws(544), alignSelf: 'center' },

  /* Header */
  header: {
    paddingHorizontal: ws(20), paddingTop: wvs(6), paddingBottom: wvs(10),
  },
  title: { fontSize: wms(22), fontWeight: '800' },

  /* Tabs */
  tabRow: {
    flexDirection: 'row', paddingHorizontal: ws(20),
    borderBottomWidth: 1,
  },
  tab: { marginRight: ws(24), paddingBottom: wvs(10), alignItems: 'center' },
  tabText: { fontSize: wms(13.5), fontWeight: '600', marginBottom: wvs(8) },
  tabTextActive: { fontWeight: '800' },
  tabIndicator: { height: wvs(2.5), width: '100%', borderRadius: ws(2), backgroundColor: 'transparent' },

  /* List */
  list: { padding: ws(20), paddingBottom: wvs(100), gap: wvs(10) },

  /* Empty */
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: ws(40), gap: wvs(10),
  },
  emptyTitle: { fontSize: wms(16), fontWeight: '700' },
  emptySub: { fontSize: wms(12.5), textAlign: 'center', lineHeight: wms(18) },

  /* Job card */
  jobCard: {
    flexDirection: 'row', alignItems: 'center', gap: ws(12),
    borderWidth: 1, borderRadius: ws(16), padding: ws(14),
  },
  clientAvatar: {
    width: ws(42), height: ws(42), borderRadius: ws(21),
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  clientInitials: { fontSize: wms(13.5), fontWeight: '800' },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: wms(13.5), fontWeight: '700', marginBottom: wvs(3) },
  jobMeta: { fontSize: wms(11.5) },
  jobRight: { alignItems: 'flex-end', gap: wvs(4) },
  jobAmount: { fontSize: wms(14), fontWeight: '800', color: COLORS.primary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: ws(4) },
  statusDot: { width: ws(5), height: ws(5), borderRadius: ws(2.5) },
  statusText: { fontSize: wms(10.5), fontWeight: '700' },
});
