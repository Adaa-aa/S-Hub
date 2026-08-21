import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
import { CONVERSATIONS } from './messages';
import { WORKERS } from './search';

/* ─── Extra detail not carried on the search-result cards ───
   Keyed by worker id — bio, skills, certifications, reviews. */
const WORKER_DETAILS: Record<number, {
    bio: string;
    jobsDone: number;
    onTime: number;
    experience: string;
    skills: string[];
    certifications: string[];
    reviews: { author: string; initials: string; color: string; rating: number; comment: string; date: string }[];
}> = {
    1: {
        bio: 'Licensed plumber with 6 years of experience fixing leaks, installing fittings, and handling full bathroom plumbing across Kumasi.',
        jobsDone: 143, onTime: 98, experience: '6 yrs',
        skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater'],
        certifications: ['Ghana Water & Sanitation', 'First Aid Certified'],
        reviews: [
            { author: 'Akosua Badu', initials: 'AB', color: '#7C3AED', rating: 5, comment: 'Fixed the leak fast and left everything clean. Highly recommend!', date: '30 Jun' },
            { author: 'Ernest Ofori', initials: 'EO', color: '#1D6FBA', rating: 5, comment: 'Very professional, arrived on time and explained everything clearly.', date: '28 Jun' },
        ],
    },
    2: {
        bio: 'Certified electrician specializing in home wiring, socket installation, and safety inspections. Fast, careful, and reliable.',
        jobsDone: 96, onTime: 95, experience: '5 yrs',
        skills: ['Wiring', 'Socket Installation', 'Circuit Repair', 'Safety Inspection'],
        certifications: ['GESE Certified', 'Electrical Safety Board'],
        reviews: [
            { author: 'Linda Owusu', initials: 'LO', color: '#DC2626', rating: 4, comment: 'Good work, a little late but communicated well.', date: '2 days ago' },
        ],
    },
    3: {
        bio: 'Skilled carpenter for cabinets, furniture repair, and custom woodwork. Detail-oriented with a strong eye for finish quality.',
        jobsDone: 73, onTime: 92, experience: '4 yrs',
        skills: ['Cabinet Making', 'Furniture Repair', 'Custom Woodwork', 'Door Fitting'],
        certifications: ['Ghana Carpentry Guild'],
        reviews: [
            { author: 'Mabel Asante', initials: 'MA', color: '#D97706', rating: 5, comment: 'Beautiful cabinet work, exactly what I asked for.', date: '1 week ago' },
        ],
    },
    4: {
        bio: 'Professional painter offering interior and exterior painting with premium, long-lasting finishes.',
        jobsDone: 54, onTime: 97, experience: '3 yrs',
        skills: ['Interior Painting', 'Exterior Painting', 'Wall Prep', 'Color Consulting'],
        certifications: ['First Aid Certified'],
        reviews: [
            { author: 'Kojo Antwi', initials: 'KA', color: '#0891B2', rating: 5, comment: 'Neat work, finished ahead of schedule.', date: '3 days ago' },
        ],
    },
    5: {
        bio: 'Reliable home cleaner offering deep cleaning, move-in/move-out cleaning, and regular housekeeping.',
        jobsDone: 38, onTime: 99, experience: '2 yrs',
        skills: ['Deep Cleaning', 'Move-in/out Cleaning', 'Laundry', 'Kitchen Detailing'],
        certifications: [],
        reviews: [
            { author: 'Efua Mensah', initials: 'EM', color: '#7C3AED', rating: 5, comment: 'Spotless every time. Very trustworthy.', date: '5 days ago' },
        ],
    },
};

export default function WorkerProfileScreen() {
    const T = useThemeColors();
    const { id } = useLocalSearchParams<{ id: string }>();

    const worker = WORKERS.find(w => w.id === Number(id));
    const details = worker ? WORKER_DETAILS[worker.id] : undefined;

    if (!worker || !details) {
        return (
            <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
                <View style={s.notFound}>
                    <Ionicons name="person-remove-outline" size={wms(40)} color={T.subText} />
                    <Text style={[s.notFoundText, { color: T.text }]}>Worker not found</Text>
                    <TouchableOpacity style={s.notFoundBtn} onPress={() => router.back()} activeOpacity={0.8}>
                        <Text style={s.notFoundBtnText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleMessage = () => {
        const convo = CONVERSATIONS.find(c => c.workerName === worker.name);
        if (convo) {
            router.push(`/chat?id=${convo.id}` as any);
        } else {
            router.push('/messages' as any);
        }
    };

    const handleBookNow = () => {
        Alert.alert(
            `Book ${worker.name}?`,
            `Starting price is GH₵ ${worker.price}. A request will be sent to them.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Book',
                    onPress: () => {
                        Alert.alert('Request Sent', `${worker.name} has been notified of your booking request.`);
                        router.push('/bookings' as any);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* ── HEADER ── */}
            <View style={[s.header, { backgroundColor: COLORS.primary }]}>
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={wms(22)} color="#fff" />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Worker Profile</Text>
                <View style={s.backBtn} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

                {/* ══ HERO ══ */}
                <View style={[s.heroCard, { backgroundColor: COLORS.primary }]}>
                    <View style={s.heroRow}>
                        <View style={[s.avatar, { backgroundColor: worker.color + '35' }]}>
                            <Text style={[s.avatarInitials, { color: '#fff' }]}>{worker.initials}</Text>
                        </View>
                        <View style={s.heroInfo}>
                            <View style={s.nameRow}>
                                <Text style={s.heroName}>{worker.name}</Text>
                                <Ionicons name="checkmark-circle" size={wms(17)} color="#fff" />
                            </View>
                            <Text style={s.heroService}>{worker.skill}</Text>
                            <View style={s.heroMeta}>
                                <Ionicons name="star" size={wms(12)} color="#F59E0B" />
                                <Text style={s.heroMetaText}>{worker.rating}  ·  {worker.reviews} reviews  ·  {worker.distance}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[s.availabilityPill, worker.available ? s.availOn : s.availOff]}>
                        <View style={[s.availDot, { backgroundColor: worker.available ? '#22C55E' : '#94A3B8' }]} />
                        <Text style={s.availText}>{worker.available ? 'Available now' : 'Currently unavailable'}</Text>
                    </View>
                </View>

                {/* ══ STATS STRIP ══ */}
                <View style={[s.statsStrip, { backgroundColor: T.card, borderColor: T.border }]}>
                    {[
                        { value: String(details.jobsDone), label: 'Jobs Done', icon: 'briefcase-outline' },
                        { value: String(worker.rating), label: 'Rating', icon: 'star-outline' },
                        { value: `${details.onTime}%`, label: 'On-time', icon: 'time-outline' },
                        { value: details.experience, label: 'Experience', icon: 'calendar-outline' },
                    ].map((stat, i, arr) => (
                        <View key={stat.label} style={[s.stat, i < arr.length - 1 && [s.statBorder, { borderColor: T.border }]]}>
                            <Ionicons name={stat.icon as any} size={wms(14)} color={COLORS.primary} style={{ marginBottom: wvs(4) }} />
                            <Text style={[s.statValue, { color: COLORS.primary }]}>{stat.value}</Text>
                            <Text style={[s.statLabel, { color: T.subText }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ══ ABOUT ══ */}
                <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
                    <Text style={[s.cardTitle, { color: T.text }]}>About</Text>
                    <Text style={[s.bioText, { color: T.subText }]}>{details.bio}</Text>
                </View>

                {/* ══ SKILLS ══ */}
                <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
                    <Text style={[s.cardTitle, { color: T.text }]}>Skills & Services</Text>
                    <View style={s.skillsGrid}>
                        {details.skills.map(sk => (
                            <View key={sk} style={[s.skillChip, { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary + '30' }]}>
                                <Text style={[s.skillText, { color: COLORS.primary }]}>{sk}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ══ PRICING ══ */}
                <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
                    <Text style={[s.cardTitle, { color: T.text }]}>Pricing</Text>
                    <View style={s.infoRow}>
                        <Text style={[s.infoLabel, { color: T.subText }]}>Starting price</Text>
                        <Text style={[s.infoValue, { color: T.text }]}>GH₵ {worker.price}</Text>
                    </View>
                    <View style={[s.rowDivider, { backgroundColor: T.divider }]} />
                    <View style={s.infoRow}>
                        <Text style={[s.infoLabel, { color: T.subText }]}>Distance</Text>
                        <Text style={[s.infoValue, { color: T.text }]}>{worker.distance}</Text>
                    </View>
                </View>

                {/* ══ CERTIFICATIONS ══ */}
                {details.certifications.length > 0 && (
                    <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
                        <Text style={[s.cardTitle, { color: T.text }]}>Certifications</Text>
                        {details.certifications.map((cert, i) => (
                            <View key={cert} style={[s.certRow, i > 0 && [s.rowDivider, { borderTopWidth: ws(1), borderColor: T.divider }]]}>
                                <Ionicons name="ribbon-outline" size={wms(15)} color={COLORS.primary} />
                                <Text style={[s.certText, { color: T.text }]}>{cert}</Text>
                                <Ionicons name="checkmark-circle" size={wms(16)} color="#22C55E" />
                            </View>
                        ))}
                    </View>
                )}

                {/* ══ REVIEWS ══ */}
                <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
                    <View style={s.reviewsHeaderRow}>
                        <Text style={[s.cardTitle, { color: T.text, marginBottom: 0 }]}>Reviews ({worker.reviews})</Text>
                        <View style={s.recentRow}>
                            <Ionicons name="filter-outline" size={wms(13)} color={COLORS.primary} />
                            <Text style={[s.recentText, { color: COLORS.primary }]}>Recent</Text>
                        </View>
                    </View>
                    {details.reviews.map((rev, i) => (
                        <View key={rev.author} style={[s.reviewRow, i > 0 && { borderTopWidth: ws(1), borderColor: T.divider }]}>
                            <View style={s.reviewTop}>
                                <View style={[s.reviewAvatar, { backgroundColor: rev.color + '20' }]}>
                                    <Text style={[s.reviewInitials, { color: rev.color }]}>{rev.initials}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[s.reviewAuthor, { color: T.text }]}>{rev.author}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <Ionicons key={idx} name={idx < rev.rating ? 'star' : 'star-outline'} size={wms(11)} color="#F59E0B" />
                                        ))}
                                    </View>
                                </View>
                                <Text style={[s.reviewDate, { color: T.subText }]}>{rev.date}</Text>
                            </View>
                            <Text style={[s.reviewComment, { color: T.subText }]}>{rev.comment}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: wvs(100) }} />
            </ScrollView>

            {/* ── ACTION BAR ── */}
            <View style={[s.actionBar, { backgroundColor: T.card, borderColor: T.border }]}>
                <TouchableOpacity style={[s.messageBtn, { borderColor: COLORS.primary }]} onPress={handleMessage} activeOpacity={0.8}>
                    <Ionicons name="chatbubble-outline" size={wms(17)} color={COLORS.primary} />
                    <Text style={[s.messageBtnText, { color: COLORS.primary }]}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.bookBtn, { backgroundColor: COLORS.primary }]} onPress={handleBookNow} activeOpacity={0.8}>
                    <Text style={s.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingBottom: wvs(20) },

    /* Header */
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(14), paddingVertical: wvs(12) },
    backBtn: { width: ws(38), height: ws(38), alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: wms(16), fontWeight: '700', color: '#fff' },

    /* Not found */
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: ws(12), padding: ws(24) },
    notFoundText: { fontSize: wms(15), fontWeight: '700' },
    notFoundBtn: { backgroundColor: COLORS.primary, borderRadius: ws(10), paddingHorizontal: ws(20), paddingVertical: wvs(10), marginTop: wvs(4) },
    notFoundBtnText: { color: '#fff', fontWeight: '700', fontSize: wms(13) },

    /* Hero */
    heroCard: { paddingHorizontal: ws(16), paddingTop: wvs(4), paddingBottom: wvs(16) },
    heroRow: { flexDirection: 'row', alignItems: 'center', gap: ws(14), marginBottom: wvs(14) },
    avatar: { width: ws(72), height: ws(72), borderRadius: ws(36), alignItems: 'center', justifyContent: 'center', borderWidth: ws(2.5), borderColor: 'rgba(255,255,255,0.5)' },
    avatarInitials: { fontSize: wms(26), fontWeight: '900' },
    heroInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: ws(6), marginBottom: wvs(3) },
    heroName: { fontSize: wms(18), fontWeight: '800', color: '#fff' },
    heroService: { fontSize: wms(13), color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: wvs(5) },
    heroMeta: { flexDirection: 'row', alignItems: 'center', gap: ws(5) },
    heroMetaText: { fontSize: wms(12), color: 'rgba(255,255,255,0.8)' },
    availabilityPill: { flexDirection: 'row', alignItems: 'center', gap: ws(6), alignSelf: 'flex-start', borderRadius: ws(20), paddingHorizontal: ws(12), paddingVertical: wvs(6) },
    availOn: { backgroundColor: 'rgba(34,197,94,0.2)' },
    availOff: { backgroundColor: 'rgba(148,163,184,0.2)' },
    availDot: { width: ws(7), height: ws(7), borderRadius: ws(4) },
    availText: { fontSize: wms(12), fontWeight: '600', color: '#fff' },

    /* Stats strip */
    statsStrip: { flexDirection: 'row', borderBottomWidth: ws(1), marginBottom: wvs(16) },
    stat: { flex: 1, alignItems: 'center', paddingVertical: wvs(14) },
    statBorder: { borderRightWidth: ws(1) },
    statValue: { fontSize: wms(16), fontWeight: '800', marginBottom: wvs(1) },
    statLabel: { fontSize: wms(10), fontWeight: '500' },

    /* Generic card */
    card: { borderRadius: ws(16), borderWidth: ws(1), marginHorizontal: ws(16), marginBottom: wvs(14), padding: ws(16) },
    cardTitle: { fontSize: wms(14), fontWeight: '800', marginBottom: wvs(10) },
    bioText: { fontSize: wms(13), lineHeight: wms(19) },

    /* Skills */
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ws(8) },
    skillChip: { borderRadius: ws(10), borderWidth: ws(1), paddingHorizontal: ws(12), paddingVertical: wvs(7) },
    skillText: { fontSize: wms(12), fontWeight: '700' },

    /* Info rows (pricing) */
    infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: wvs(8) },
    infoLabel: { fontSize: wms(13), fontWeight: '500' },
    infoValue: { fontSize: wms(13), fontWeight: '700' },
    rowDivider: { height: wvs(1) },

    /* Certifications */
    certRow: { flexDirection: 'row', alignItems: 'center', gap: ws(10), paddingVertical: wvs(10) },
    certText: { flex: 1, fontSize: wms(13), fontWeight: '600' },

    /* Reviews */
    reviewsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wvs(10) },
    recentRow: { flexDirection: 'row', alignItems: 'center', gap: ws(4) },
    recentText: { fontSize: wms(12), fontWeight: '700' },
    reviewRow: { paddingVertical: wvs(12) },
    reviewTop: { flexDirection: 'row', alignItems: 'center', gap: ws(10), marginBottom: wvs(6) },
    reviewAvatar: { width: ws(34), height: ws(34), borderRadius: ws(17), alignItems: 'center', justifyContent: 'center' },
    reviewInitials: { fontSize: wms(12), fontWeight: '800' },
    reviewAuthor: { fontSize: wms(13), fontWeight: '700', marginBottom: wvs(2) },
    reviewDate: { fontSize: wms(11) },
    reviewComment: { fontSize: wms(12), lineHeight: wms(17) },

    /* Action bar */
    actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: ws(10), borderTopWidth: ws(1), paddingHorizontal: ws(16), paddingTop: wvs(12), paddingBottom: wvs(28) },
    messageBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ws(7), borderWidth: ws(1.5), borderRadius: ws(12), paddingVertical: wvs(13) },
    messageBtnText: { fontSize: wms(14), fontWeight: '700' },
    bookBtn: { flex: 1.4, alignItems: 'center', justifyContent: 'center', borderRadius: ws(12), paddingVertical: wvs(13) },
    bookBtnText: { fontSize: wms(14), fontWeight: '800', color: '#fff' },
});