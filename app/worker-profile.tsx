import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── Worker data ─── */
const WORKER_DATA: Record<string, {
  name: string; initials: string; color: string; service: string;
  rating: number; reviews: number; distance: string; eta: string;
  jobs: number; onTime: number; experience: string; price: number;
  about: string; verified: boolean; online: boolean; badge: string;
  skills: string[]; languages: string[];
  ratingBreakdown: { label: string; count: number }[];
  reviews_list: { author: string; initials: string; rating: number; text: string; date: string; color: string }[];
  availability: { day: string; available: boolean }[];
  certifications: string[];
  phone: string;
}> = {
  '1': {
    name: 'Kofi Mensah', initials: 'KM', color: '#006B3F',
    service: 'Master Plumber', rating: 4.9, reviews: 143,
    distance: '1.2 km', eta: '12 min',
    jobs: 143, onTime: 98, experience: '6 yrs', price: 450,
    verified: true, online: true, badge: 'Top Rated',
    phone: '+233 24 123 4567',
    about: 'Professional plumber with 6+ years of experience in fixing pipes, leaks and bathroom installations. I work neatly, arrive on time and ensure every job is done right the first time. Fully insured and licensed.',
    skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater', 'Gutter Repair', 'Boiler Service', 'Sink Install'],
    languages: ['English', 'Twi'],
    certifications: ['Ghana Water & Sanitation', 'GESE Certified', 'First Aid'],
    ratingBreakdown: [
      { label: '5 ★', count: 112 },
      { label: '4 ★', count: 22 },
      { label: '3 ★', count: 6 },
      { label: '2 ★', count: 2 },
      { label: '1 ★', count: 1 },
    ],
    availability: [
      { day: 'Mon', available: true },
      { day: 'Tue', available: true },
      { day: 'Wed', available: true },
      { day: 'Thu', available: true },
      { day: 'Fri', available: true },
      { day: 'Sat', available: false },
      { day: 'Sun', available: false },
    ],
    reviews_list: [
      { author: 'Akosua B.', initials: 'AB', color: '#7C3AED', rating: 5, text: 'Kofi was amazing! Fixed the leak in under an hour and left the place spotless. Will definitely call again.', date: '2 days ago' },
      { author: 'Ernest O.', initials: 'EO', color: '#1D6FBA', rating: 5, text: 'Very professional and punctual. Knew exactly what the issue was and fixed it without any drama.', date: '1 week ago' },
      { author: 'Mabel A.', initials: 'MA', color: '#92400E', rating: 4, text: 'Did a great job on the bathroom pipe. Minor delay but he communicated well throughout the whole process.', date: '2 weeks ago' },
    ],
  },
  '2': {
    name: 'Kwame Adjei', initials: 'KA', color: '#1D6FBA',
    service: 'Certified Electrician', rating: 4.7, reviews: 89,
    distance: '1.8 km', eta: '18 min',
    jobs: 98, onTime: 95, experience: '4 yrs', price: 400,
    verified: true, online: true, badge: 'Verified Pro',
    phone: '+233 50 987 6543',
    about: 'Certified electrician specialising in residential wiring, socket installation and electrical fault diagnosis. Safety is my top priority on every job. Every repair is tested before I leave.',
    skills: ['Wiring', 'Socket Install', 'Fault Diagnosis', 'Lighting', 'Panel Upgrade', 'CCTV Fitting'],
    languages: ['English', 'Ga'],
    certifications: ['Ghana Energy Commission', 'IEE Wiring Regs'],
    ratingBreakdown: [
      { label: '5 ★', count: 62 },
      { label: '4 ★', count: 18 },
      { label: '3 ★', count: 6 },
      { label: '2 ★', count: 2 },
      { label: '1 ★', count: 1 },
    ],
    availability: [
      { day: 'Mon', available: true },
      { day: 'Tue', available: true },
      { day: 'Wed', available: false },
      { day: 'Thu', available: true },
      { day: 'Fri', available: true },
      { day: 'Sat', available: true },
      { day: 'Sun', available: false },
    ],
    reviews_list: [
      { author: 'Linda K.', initials: 'LK', color: '#006B3F', rating: 5, text: 'Fixed our faulty sockets quickly. Very knowledgeable and didn\'t leave a single mess behind.', date: '3 days ago' },
      { author: 'Frank M.', initials: 'FM', color: '#CE1126', rating: 4, text: 'Good work, arrived a bit late but did an excellent job rewiring the kitchen.', date: '2 weeks ago' },
    ],
  },
  'w1': {
    name: 'Kofi Mensah', initials: 'KM', color: '#006B3F',
    service: 'Master Plumber', rating: 4.9, reviews: 143,
    distance: '1.2 km', eta: '12 min',
    jobs: 143, onTime: 98, experience: '6 yrs', price: 450,
    verified: true, online: true, badge: 'Top Rated',
    phone: '+233 24 123 4567',
    about: 'Professional plumber with 6+ years of experience in fixing pipes, leaks and bathroom installations. I work neatly, arrive on time and ensure every job is done right the first time. Fully insured and licensed.',
    skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater', 'Gutter Repair', 'Boiler Service', 'Sink Install'],
    languages: ['English', 'Twi'],
    certifications: ['Ghana Water & Sanitation', 'GESE Certified', 'First Aid'],
    ratingBreakdown: [
      { label: '5 ★', count: 112 },
      { label: '4 ★', count: 22 },
      { label: '3 ★', count: 6 },
      { label: '2 ★', count: 2 },
      { label: '1 ★', count: 1 },
    ],
    availability: [
      { day: 'Mon', available: true },
      { day: 'Tue', available: true },
      { day: 'Wed', available: true },
      { day: 'Thu', available: true },
      { day: 'Fri', available: true },
      { day: 'Sat', available: false },
      { day: 'Sun', available: false },
    ],
    reviews_list: [
      { author: 'Akosua B.', initials: 'AB', color: '#7C3AED', rating: 5, text: 'Kofi was amazing! Fixed the leak in under an hour and left the place spotless. Will definitely call again.', date: '2 days ago' },
      { author: 'Ernest O.', initials: 'EO', color: '#1D6FBA', rating: 5, text: 'Very professional and punctual. Knew exactly what the issue was and fixed it without any drama.', date: '1 week ago' },
      { author: 'Mabel A.', initials: 'MA', color: '#92400E', rating: 4, text: 'Did a great job on the bathroom pipe. Minor delay but he communicated well throughout the whole process.', date: '2 weeks ago' },
    ],
  },
};

const DEFAULT_WORKER = WORKER_DATA['1'];

/* ─── Stars ─── */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
          size={size}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

/* ─── Rating breakdown bar ─── */
function RatingBar({ label, count, total, T }: { label: string; count: number; total: number; T: any }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={rb.row}>
      <Text style={[rb.label, { color: T.subText }]}>{label}</Text>
      <View style={[rb.track, { backgroundColor: T.border }]}>
        <View style={[rb.fill, { width: `${pct}%` as any }]} />
      </View>
      <Text style={[rb.count, { color: T.subText }]}>{count}</Text>
    </View>
  );
}
const rb = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  label: { fontSize: 11, fontWeight: '600', width: 28, textAlign: 'right' },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
  count: { fontSize: 11, width: 20 },
});

/* ─── Review card ─── */
function ReviewCard({ review, T }: { review: typeof DEFAULT_WORKER['reviews_list'][0]; T: any }) {
  return (
    <View style={[rc.card, { backgroundColor: T.card, borderColor: T.border }]}>
      <View style={rc.top}>
        <View style={[rc.avatar, { backgroundColor: review.color + '20' }]}>
          <Text style={[rc.initials, { color: review.color }]}>{review.initials}</Text>
        </View>
        <View style={rc.info}>
          <Text style={[rc.author, { color: T.text }]}>{review.author}</Text>
          <Stars rating={review.rating} />
        </View>
        <Text style={[rc.date, { color: T.subText }]}>{review.date}</Text>
      </View>
      <Text style={[rc.text, { color: T.subText }]}>{review.text}</Text>
    </View>
  );
}
const rc = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  initials: { fontSize: 13, fontWeight: '800' },
  info: { flex: 1, gap: 3 },
  author: { fontSize: 13, fontWeight: '700' },
  date: { fontSize: 11 },
  text: { fontSize: 13, lineHeight: 20 },
});

/* ─── Section heading ─── */
function SectionHeading({ title, color }: { title: string; color: string }) {
  return <Text style={[sh.title, { color }]}>{title}</Text>;
}
const sh = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '800', marginBottom: 12, marginTop: 6 },
});

/* ─── Main screen ─── */
export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const worker = (id && WORKER_DATA[id]) ? WORKER_DATA[id] : DEFAULT_WORKER;
  const [saved, setSaved] = useState(false);
  const T = useThemeColors();

  const totalReviews = worker.ratingBreakdown.reduce((a, b) => a + b.count, 0);

  const handleShare = () =>
    Share.share({
      title: `${worker.name} – ${worker.service} on S-Hub`,
      message: `Check out ${worker.name}, a top-rated ${worker.service} on S-Hub! ⭐ ${worker.rating} · ${worker.jobs} jobs done.\nhttps://s-hub.com.gh`,
    });

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={worker.color} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ══ HERO ══ */}
        <View style={[s.hero, { backgroundColor: worker.color }]}>
          {/* Top action row */}
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
            <View style={s.avatar}>
              <Text style={s.avatarInitials}>{worker.initials}</Text>
            </View>
            {worker.online && <View style={s.onlineDot} />}
          </View>

          {/* Name + verified */}
          <View style={s.heroNameRow}>
            <Text style={s.heroName}>{worker.name}</Text>
            {worker.verified && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
          </View>

          <Text style={s.heroService}>{worker.service}</Text>

          {/* Badge */}
          <View style={s.heroBadgeRow}>
            <View style={s.heroBadge}>
              <MaterialCommunityIcons name="medal-outline" size={12} color={COLORS.accent} />
              <Text style={s.heroBadgeText}>{worker.badge}</Text>
            </View>
          </View>

          {/* Rating + distance row */}
          <View style={s.heroMeta}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={s.heroMetaText}>{worker.rating} ({worker.reviews})</Text>
            <View style={s.heroDot} />
            <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={s.heroMetaText}>{worker.distance} away</Text>
            <View style={s.heroDot} />
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={s.heroMetaText}>ETA {worker.eta}</Text>
          </View>
        </View>

        {/* ══ STATS STRIP ══ */}
        <View style={[s.statsStrip, { backgroundColor: T.card, borderColor: T.border }]}>
          {[
            { value: String(worker.jobs), label: 'Jobs Done' },
            { value: String(worker.rating), label: 'Rating' },
            { value: `${worker.onTime}%`, label: 'On-time' },
            { value: worker.experience, label: 'Experience' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={[s.stat, i < arr.length - 1 && [s.statBorder, { borderColor: T.border }]]}>
              <Text style={[s.statValue, { color: worker.color }]}>{stat.value}</Text>
              <Text style={[s.statLabel, { color: T.subText }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[s.body, { backgroundColor: T.bg }]}>

          {/* ── ABOUT ── */}
          <SectionHeading title="About" color={T.text} />
          <Text style={[s.aboutText, { color: T.subText }]}>{worker.about}</Text>

          {/* ── QUICK CONTACT ACTIONS ── */}
          <View style={s.quickActions}>
            <TouchableOpacity
              style={[s.quickBtn, { backgroundColor: T.card, borderColor: T.border }]}
              activeOpacity={0.8}
              onPress={() => router.push('/messages' as any)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
              <Text style={[s.quickBtnText, { color: COLORS.primary }]}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.quickBtn, { backgroundColor: T.card, borderColor: T.border }]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Call', `Call ${worker.name}?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => { } },
              ])}
            >
              <Ionicons name="call-outline" size={18} color={COLORS.primary} />
              <Text style={[s.quickBtnText, { color: COLORS.primary }]}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.quickBtn, { backgroundColor: T.card, borderColor: T.border }]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Video', 'Video call coming soon.')}
            >
              <Ionicons name="videocam-outline" size={18} color={COLORS.primary} />
              <Text style={[s.quickBtnText, { color: COLORS.primary }]}>Video</Text>
            </TouchableOpacity>
          </View>

          {/* ── SKILLS & SERVICES ── */}
          <SectionHeading title="Skills & Services" color={T.text} />
          <View style={s.skillsGrid}>
            {worker.skills.map(sk => (
              <View key={sk} style={[s.skillChip, { backgroundColor: worker.color + '14', borderColor: worker.color + '30' }]}>
                <Text style={[s.skillText, { color: worker.color }]}>{sk}</Text>
              </View>
            ))}
          </View>

          {/* ── CERTIFICATIONS ── */}
          <SectionHeading title="Certifications" color={T.text} />
          <View style={[s.certCard, { backgroundColor: T.card, borderColor: T.border }]}>
            {worker.certifications.map((cert, i) => (
              <View key={cert}>
                {i > 0 && <View style={[s.certDivider, { backgroundColor: T.divider }]} />}
                <View style={s.certRow}>
                  <View style={[s.certIcon, { backgroundColor: COLORS.primaryLight }]}>
                    <Ionicons name="ribbon-outline" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={[s.certText, { color: T.text }]}>{cert}</Text>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                </View>
              </View>
            ))}
          </View>

          {/* ── DETAILS ── */}
          <SectionHeading title="Details" color={T.text} />
          <View style={[s.detailCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={[s.detailLabel, { color: T.subText }]}>Starting price</Text>
              <Text style={[s.detailValue, { color: T.text }]}>GH₵ {worker.price}</Text>
            </View>
            <View style={[s.detailDivider, { backgroundColor: T.divider }]} />
            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={[s.detailLabel, { color: T.subText }]}>Estimated arrival</Text>
              <Text style={[s.detailValue, { color: T.text }]}>{worker.eta}</Text>
            </View>
            <View style={[s.detailDivider, { backgroundColor: T.divider }]} />
            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="location-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={[s.detailLabel, { color: T.subText }]}>Distance</Text>
              <Text style={[s.detailValue, { color: T.text }]}>{worker.distance}</Text>
            </View>
            <View style={[s.detailDivider, { backgroundColor: T.divider }]} />
            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={[s.detailLabel, { color: T.subText }]}>Languages</Text>
              <Text style={[s.detailValue, { color: T.text }]}>{worker.languages.join(', ')}</Text>
            </View>
            <View style={[s.detailDivider, { backgroundColor: T.divider }]} />
            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="call-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={[s.detailLabel, { color: T.subText }]}>Phone</Text>
              <Text style={[s.detailValue, { color: T.text }]}>{worker.phone}</Text>
            </View>
          </View>

          {/* ── AVAILABILITY ── */}
          <SectionHeading title="Weekly Availability" color={T.text} />
          <View style={[s.availCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <View style={s.availGrid}>
              {worker.availability.map(day => (
                <View key={day.day} style={[
                  s.availCell,
                  day.available
                    ? { backgroundColor: worker.color, borderColor: worker.color }
                    : { backgroundColor: T.inputBg, borderColor: T.border }
                ]}>
                  <Text style={[s.availDay, { color: day.available ? '#fff' : T.subText }]}>{day.day}</Text>
                  {day.available
                    ? <Ionicons name="checkmark" size={11} color="#fff" />
                    : <Ionicons name="close" size={11} color={T.subText} />
                  }
                </View>
              ))}
            </View>
            <View style={s.availLegend}>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: worker.color }]} />
                <Text style={[s.legendText, { color: T.subText }]}>Available</Text>
              </View>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: T.border }]} />
                <Text style={[s.legendText, { color: T.subText }]}>Unavailable</Text>
              </View>
            </View>
          </View>

          {/* ── RATINGS BREAKDOWN ── */}
          <SectionHeading title="Ratings" color={T.text} />
          <View style={[s.ratingsCard, { backgroundColor: T.card, borderColor: T.border }]}>
            {/* Big rating + bars */}
            <View style={s.ratingsInner}>
              <View style={s.bigRating}>
                <Text style={[s.bigRatingNum, { color: worker.color }]}>{worker.rating}</Text>
                <Stars rating={worker.rating} size={16} />
                <Text style={[s.bigRatingCount, { color: T.subText }]}>{totalReviews} reviews</Text>
              </View>
              <View style={s.ratingBars}>
                {worker.ratingBreakdown.map(r => (
                  <RatingBar key={r.label} label={r.label} count={r.count} total={totalReviews} T={T} />
                ))}
              </View>
            </View>
          </View>

          {/* ── REVIEWS ── */}
          <View style={s.reviewsHeader}>
            <SectionHeading title="Reviews" color={T.text} />
          </View>
          {worker.reviews_list.map((rev, i) => (
            <ReviewCard key={i} review={rev} T={T} />
          ))}

          <TouchableOpacity
            style={[s.allReviewsBtn, { borderColor: T.border }]}
            activeOpacity={0.75}
            onPress={() => Alert.alert('Reviews', 'Full reviews page coming soon.')}
          >
            <Text style={s.allReviewsBtnText}>See all {worker.reviews} reviews</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
          </TouchableOpacity>

          {/* ── TRUST & SAFETY ── */}
          <SectionHeading title="Trust & Safety" color={T.text} />
          <View style={[s.trustCard, { backgroundColor: T.card, borderColor: T.border }]}>
            {[
              { icon: 'shield-checkmark-outline', label: 'Identity Verified', ok: true },
              { icon: 'document-text-outline', label: 'Background Check Passed', ok: true },
              { icon: 'card-outline', label: 'GH ID Card on File', ok: true },
              { icon: 'star-outline', label: 'Service Guarantee', ok: true },
            ].map((item, i, arr) => (
              <View key={item.label}>
                {i > 0 && <View style={[s.certDivider, { backgroundColor: T.divider }]} />}
                <View style={s.trustRow}>
                  <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                  <Text style={[s.trustLabel, { color: T.text }]}>{item.label}</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                </View>
              </View>
            ))}
          </View>

          {/* ── REPORT ── */}
          <TouchableOpacity
            style={s.reportBtn}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Report', `Report ${worker.name} for inappropriate behaviour?`, [
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

      {/* ══ STICKY BOTTOM BAR ══ */}
      <View style={[s.bottomBar, { backgroundColor: T.card, borderColor: T.border }]}>
        <View style={s.bottomPrice}>
          <Text style={[s.bottomPriceLabel, { color: T.subText }]}>Starting from</Text>
          <Text style={[s.bottomPriceValue, { color: worker.color }]}>GH₵ {worker.price}</Text>
        </View>
        <View style={s.bottomActions}>
          <TouchableOpacity
            style={[s.bottomMsgBtn, { borderColor: worker.color }]}
            activeOpacity={0.85}
            onPress={() => router.push('/messages' as any)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={worker.color} />
            <Text style={[s.bottomMsgText, { color: worker.color }]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.bottomHireBtn, { backgroundColor: worker.color, shadowColor: worker.color }]}
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

/* ─── Styles ─── */
const s = StyleSheet.create({
  safe: { flex: 1 },

  /* ─ Hero ─ */
  hero: { paddingBottom: 28, paddingTop: 56 },
  heroTopBar: { position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  heroActions: { flexDirection: 'row', gap: 8 },
  heroBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },

  avatarWrap: { alignSelf: 'center', position: 'relative', marginBottom: 14 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarInitials: { fontSize: 38, fontWeight: '900', color: '#fff' },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#fff' },

  heroNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 4 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  heroService: { textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 8 },

  heroBadgeRow: { alignItems: 'center', marginBottom: 10 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5 },
  heroBadgeText: { fontSize: 11, color: COLORS.accent, fontWeight: '700' },

  heroMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  heroMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  heroDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },

  /* ─ Stats strip ─ */
  statsStrip: { flexDirection: 'row', borderBottomWidth: 1 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statBorder: { borderRightWidth: 1 },
  statValue: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '500' },

  /* ─ Body ─ */
  body: { paddingHorizontal: 16, paddingTop: 18 },
  aboutText: { fontSize: 14, lineHeight: 22, marginBottom: 18 },

  /* ─ Quick actions ─ */
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 12, paddingVertical: 11 },
  quickBtnText: { fontSize: 13, fontWeight: '700' },

  /* ─ Skills ─ */
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  skillChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  skillText: { fontSize: 12, fontWeight: '700' },

  /* ─ Certifications ─ */
  certCard: { borderRadius: 16, borderWidth: 1, marginBottom: 22, overflow: 'hidden' },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  certIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  certText: { flex: 1, fontSize: 13, fontWeight: '600' },
  certDivider: { height: 1, marginHorizontal: 16 },

  /* ─ Details ─ */
  detailCard: { borderRadius: 16, borderWidth: 1, marginBottom: 22, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  detailIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  detailValue: { fontSize: 13, fontWeight: '700' },
  detailDivider: { height: 1, marginHorizontal: 16 },

  /* ─ Availability ─ */
  availCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 22 },
  availGrid: { flexDirection: 'row', gap: 8, justifyContent: 'space-between', marginBottom: 12 },
  availCell: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, gap: 3 },
  availDay: { fontSize: 10, fontWeight: '700' },
  availLegend: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontWeight: '500' },

  /* ─ Ratings ─ */
  ratingsCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 22 },
  ratingsInner: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  bigRating: { alignItems: 'center', gap: 5, minWidth: 70 },
  bigRatingNum: { fontSize: 40, fontWeight: '900', lineHeight: 44 },
  bigRatingCount: { fontSize: 10, fontWeight: '500', textAlign: 'center' },
  ratingBars: { flex: 1 },

  /* ─ Reviews ─ */
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  allReviewsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 14, marginBottom: 16, borderRadius: 12, borderWidth: 1 },
  allReviewsBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  /* ─ Trust ─ */
  trustCard: { borderRadius: 16, borderWidth: 1, marginBottom: 22, overflow: 'hidden' },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  trustLabel: { flex: 1, fontSize: 13, fontWeight: '600' },

  /* ─ Report ─ */
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginTop: 4 },
  reportText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },

  /* ─ Bottom bar ─ */
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  bottomPrice: { gap: 2 },
  bottomPriceLabel: { fontSize: 10, fontWeight: '500' },
  bottomPriceValue: { fontSize: 22, fontWeight: '900' },
  bottomActions: { flexDirection: 'row', gap: 10 },
  bottomMsgBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  bottomMsgText: { fontSize: 13, fontWeight: '700' },
  bottomHireBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  bottomHireText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
