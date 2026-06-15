import { COLORS } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/* ─── Worker data keyed by id ─── */
const WORKER_DATA: Record<string, {
  name: string; initials: string; color: string; service: string;
  rating: number; reviews: number; distance: string; eta: string;
  jobs: number; onTime: number; experience: string; price: number;
  about: string; verified: boolean; online: boolean;
  skills: string[]; languages: string[];
  reviews_list: { author: string; initials: string; rating: number; text: string; date: string }[];
  availability: string[];
}> = {
  '1': {
    name: 'Kofi Mensah', initials: 'KM', color: '#006B3F',
    service: 'Plumber', rating: 4.9, reviews: 120, distance: '2.2 km', eta: '12 min',
    jobs: 120, onTime: 98, experience: '6 yrs', price: 450,
    verified: true, online: true,
    about: 'Professional plumber with 6+ years of experience in fixing pipes, leaks and bathroom installations. I work neatly, arrive on time and ensure every job is done right the first time.',
    skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater', 'Gutter Repair'],
    languages: ['English', 'Twi'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    reviews_list: [
      { author: 'Akosua B.', initials: 'AB', rating: 5, text: 'Kofi was amazing! Fixed the leak in under an hour and left the place spotless.', date: '2 days ago' },
      { author: 'Ernest O.', initials: 'EO', rating: 5, text: 'Very professional and punctual. Would definitely hire again.', date: '1 week ago' },
      { author: 'Mabel A.', initials: 'MA', rating: 4, text: 'Did a great job on the bathroom pipe. Minor delay but he communicated well.', date: '2 weeks ago' },
    ],
  },
  '2': {
    name: 'Kwame Adjei', initials: 'KA', color: '#1D6FBA',
    service: 'Electrician', rating: 4.7, reviews: 89, distance: '1.8 km', eta: '18 min',
    jobs: 98, onTime: 95, experience: '4 yrs', price: 400,
    verified: true, online: true,
    about: 'Certified electrician specialising in residential wiring, socket installation and electrical fault diagnosis. Safety is my top priority on every job.',
    skills: ['Wiring', 'Socket Install', 'Fault Diagnosis', 'Lighting', 'Panel Upgrade'],
    languages: ['English', 'Ga'],
    availability: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    reviews_list: [
      { author: 'Linda K.', initials: 'LK', rating: 5, text: 'Fixed our faulty sockets quickly. Very knowledgeable.', date: '3 days ago' },
      { author: 'Frank M.', initials: 'FM', rating: 4, text: 'Good work, arrived a bit late but did an excellent job.', date: '2 weeks ago' },
    ],
  },
  'w1': {
    name: 'Kofi Mensah', initials: 'KM', color: '#006B3F',
    service: 'Plumber', rating: 4.9, reviews: 143, distance: '1.2 km', eta: '12 min',
    jobs: 143, onTime: 98, experience: '6 yrs', price: 450,
    verified: true, online: true,
    about: 'Professional plumber with 6+ years of experience in fixing pipes, leaks and bathroom installations. I work neatly, arrive on time and ensure every job is done right the first time.',
    skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater', 'Gutter Repair'],
    languages: ['English', 'Twi'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    reviews_list: [
      { author: 'Akosua B.', initials: 'AB', rating: 5, text: 'Kofi was amazing! Fixed the leak in under an hour and left the place spotless.', date: '2 days ago' },
      { author: 'Ernest O.', initials: 'EO', rating: 5, text: 'Very professional and punctual. Would definitely hire again.', date: '1 week ago' },
      { author: 'Mabel A.', initials: 'MA', rating: 4, text: 'Did a great job on the bathroom pipe. Minor delay but he communicated well.', date: '2 weeks ago' },
    ],
  },
};

const DEFAULT_WORKER = WORKER_DATA['1'];

/* ─── Star row ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? 'star' : 'star-outline'}
          size={13}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

/* ─── Review card ─── */
function ReviewCard({ review }: { review: typeof DEFAULT_WORKER['reviews_list'][0] }) {
  return (
    <View style={rc.card}>
      <View style={rc.top}>
        <View style={rc.avatar}>
          <Text style={rc.initials}>{review.initials}</Text>
        </View>
        <View style={rc.info}>
          <Text style={rc.author}>{review.author}</Text>
          <Stars rating={review.rating} />
        </View>
        <Text style={rc.date}>{review.date}</Text>
      </View>
      <Text style={rc.text}>{review.text}</Text>
    </View>
  );
}
const rc = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EDEDED', marginBottom: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E6F4EE', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  info: { flex: 1, gap: 3 },
  author: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  date: { fontSize: 11, color: COLORS.muted },
  text: { fontSize: 13, color: '#444', lineHeight: 19 },
});

/* ─── Main screen ─── */
export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const worker = (id && WORKER_DATA[id]) ? WORKER_DATA[id] : DEFAULT_WORKER;
  const [saved, setSaved] = useState(false);

  const handleShare = () =>
    Share.share({
      title: `${worker.name} – ${worker.service} on Vaker`,
      message: `Check out ${worker.name}, a top-rated ${worker.service} on Vaker! ⭐ ${worker.rating} · ${worker.jobs} jobs done.\nhttps://vaker.com.gh`,
    });

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={worker.color} />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

        {/* ── HERO ── */}
        <View style={[s.hero, { backgroundColor: worker.color }]}>
          {/* Top action bar */}
          <View style={s.heroTopBar}>
            <TouchableOpacity style={s.heroBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={s.heroActions}>
              <TouchableOpacity style={s.heroBtn} onPress={handleShare} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={s.heroBtn} onPress={() => setSaved(v => !v)} activeOpacity={0.8}>
                <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#FF6B6B' : '#fff'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Avatar */}
          <View style={s.avatarWrap}>
            <View style={[s.avatar, { borderColor: worker.color }]}>
              <Text style={s.avatarInitials}>{worker.initials}</Text>
            </View>
            {worker.online && <View style={s.onlineDot} />}
          </View>

          {/* Name + badge */}
          <View style={s.heroNameRow}>
            <Text style={s.heroName}>{worker.name}</Text>
            {worker.verified && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
          </View>
          <Text style={s.heroService}>{worker.service}</Text>

          {/* Rating + distance */}
          <View style={s.heroMeta}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={s.heroMetaText}>{worker.rating} ({worker.reviews} reviews)</Text>
            <View style={s.heroDot} />
            <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={s.heroMetaText}>{worker.distance} away</Text>
          </View>
        </View>

        {/* ── STATS STRIP ── */}
        <View style={s.statsStrip}>
          {[
            { value: String(worker.jobs), label: 'Jobs Done' },
            { value: String(worker.rating), label: 'Rating' },
            { value: `${worker.onTime}%`, label: 'On-time' },
            { value: worker.experience, label: 'Experience' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={[s.stat, i < arr.length - 1 && s.statBorder]}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.body}>

          {/* ── ABOUT ── */}
          <Text style={s.sectionTitle}>About</Text>
          <Text style={s.aboutText}>{worker.about}</Text>

          {/* ── PRIMARY ACTIONS (inline) ── */}
          <View style={s.inlineActions}>
            <TouchableOpacity
              style={s.msgBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/messages' as any)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={17} color={COLORS.primary} />
              <Text style={s.msgBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.hireBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/post-job' as any)}
            >
              <Text style={s.hireBtnText}>Hire Now</Text>
            </TouchableOpacity>
          </View>

          {/* ── SKILLS ── */}
          <Text style={s.sectionTitle}>Skills & Services</Text>
          <View style={s.skillsGrid}>
            {worker.skills.map(sk => (
              <View key={sk} style={s.skillChip}>
                <Text style={s.skillText}>{sk}</Text>
              </View>
            ))}
          </View>

          {/* ── DETAILS ── */}
          <Text style={s.sectionTitle}>Details</Text>
          <View style={s.detailCard}>
            <View style={s.detailRow}>
              <Ionicons name="cash-outline" size={18} color={COLORS.primary} />
              <Text style={s.detailLabel}>Starting price</Text>
              <Text style={s.detailValue}>GH₵ {worker.price}</Text>
            </View>
            <View style={s.detailDivider} />
            <View style={s.detailRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={s.detailLabel}>Estimated arrival</Text>
              <Text style={s.detailValue}>{worker.eta}</Text>
            </View>
            <View style={s.detailDivider} />
            <View style={s.detailRow}>
              <Ionicons name="globe-outline" size={18} color={COLORS.primary} />
              <Text style={s.detailLabel}>Languages</Text>
              <Text style={s.detailValue}>{worker.languages.join(', ')}</Text>
            </View>
            <View style={s.detailDivider} />
            <View style={s.detailRow}>
              <MaterialCommunityIcons name="calendar-check-outline" size={18} color={COLORS.primary} />
              <Text style={s.detailLabel}>Available days</Text>
              <Text style={s.detailValue}>{worker.availability.join(' · ')}</Text>
            </View>
          </View>

          {/* ── REVIEWS ── */}
          <View style={s.reviewsHeader}>
            <Text style={s.sectionTitle}>Reviews</Text>
            <View style={s.reviewsSummary}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={s.reviewsSummaryText}>{worker.rating} · {worker.reviews} reviews</Text>
            </View>
          </View>

          {worker.reviews_list.map((rev, i) => (
            <ReviewCard key={i} review={rev} />
          ))}

          <TouchableOpacity
            style={s.allReviewsBtn}
            activeOpacity={0.75}
            onPress={() => Alert.alert('Reviews', 'Full reviews page coming soon.')}
          >
            <Text style={s.allReviewsBtnText}>See all {worker.reviews} reviews</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
          </TouchableOpacity>

          {/* ── REPORT ── */}
          <TouchableOpacity
            style={s.reportBtn}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Report', 'Report this worker for inappropriate behaviour?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Report', style: 'destructive' },
            ])}
          >
            <Ionicons name="flag-outline" size={14} color={COLORS.muted} />
            <Text style={s.reportText}>Report this worker</Text>
          </TouchableOpacity>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* ── STICKY BOTTOM CTA ── */}
      <View style={s.bottomBar}>
        <View style={s.bottomPrice}>
          <Text style={s.bottomPriceLabel}>Starting from</Text>
          <Text style={s.bottomPriceValue}>GH₵ {worker.price}</Text>
        </View>
        <View style={s.bottomActions}>
          <TouchableOpacity
            style={s.bottomMsgBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/messages' as any)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
            <Text style={s.bottomMsgText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.bottomHireBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/post-job' as any)}
          >
            <Text style={s.bottomHireText}>Hire Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },

  /* Hero */
  hero: { paddingBottom: 28, paddingTop: 52 },
  heroTopBar: { position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  heroActions: { flexDirection: 'row', gap: 8 },
  heroBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { alignSelf: 'center', position: 'relative', marginBottom: 14 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarInitials: { fontSize: 38, fontWeight: '900', color: '#fff' },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#fff' },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 4 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  heroService: { textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 10, fontWeight: '500' },
  heroMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  heroMetaText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  heroDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },

  /* Stats strip */
  statsStrip: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statBorder: { borderRightWidth: 1, borderColor: '#F0F0F0' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '500' },

  /* Body */
  body: { paddingHorizontal: 16, paddingTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 10, marginTop: 4 },
  aboutText: { fontSize: 14, color: '#444', lineHeight: 22, marginBottom: 18 },

  /* Inline actions */
  inlineActions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, paddingVertical: 12 },
  msgBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  hireBtn: { flex: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  hireBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* Skills */
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  skillChip: { backgroundColor: COLORS.primary + '14', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  skillText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  /* Detail card */
  detailCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EDEDED', marginBottom: 22, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  detailLabel: { flex: 1, fontSize: 13, color: '#555', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#1A1A1A', fontWeight: '700' },
  detailDivider: { height: 1, backgroundColor: '#F2F2F2', marginHorizontal: 16 },

  /* Reviews */
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  reviewsSummary: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reviewsSummaryText: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  allReviewsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 14, marginBottom: 10 },
  allReviewsBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  /* Report */
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginTop: 4 },
  reportText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },

  /* Sticky bottom bar */
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#EBEBEB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 10 },
  bottomPrice: { gap: 2 },
  bottomPriceLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '500' },
  bottomPriceValue: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  bottomActions: { flexDirection: 'row', gap: 10 },
  bottomMsgBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  bottomMsgText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  bottomHireBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 22, paddingVertical: 10, shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  bottomHireText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
