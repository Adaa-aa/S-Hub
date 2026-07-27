import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

type Slide = {
  key: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    key: 'find',
    icon: 'map-marker-radius',
    title: 'Find trusted workers near you',
    body: 'Connect with the best local talent in your community, from skilled trades to professional services.',
  },
  {
    key: 'bid',
    icon: 'handshake',
    title: 'Compare bids and negotiate fair prices',
    body: 'Receive multiple quotes for your task and choose the professional that fits your budget and timeline.',
  },
  {
    key: 'verify',
    icon: 'shield-check',
    title: 'Book with confidence — verified & reliable',
    body: 'Every worker on Waker is thoroughly vetted and rated by your neighbors to ensure quality service.',
  },
];

export default function OnboardingScreen() {
  const T = useThemeColors();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const goToSlide = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  const handleSkip = () => router.replace('/sign-in' as any);
  const handleGetStarted = () => router.replace('/sign-up' as any);

  const onMomentumScrollEnd = (e: any) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const renderItem = ({ item, index: i }: ListRenderItemInfo<Slide>) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
        <View style={[styles.iconWrap, { backgroundColor: COLORS.primaryLight }]}>
          <MaterialCommunityIcons name={item.icon} size={56} color={COLORS.primary} />
        </View>
        <Text style={[styles.title, { color: T.text }]}>{item.title}</Text>
        <Text style={[styles.body, { color: T.subText }]}>{item.body}</Text>
        {i === SLIDES.length - 1 && (
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted} activeOpacity={0.85}>
            <Text style={styles.ctaText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <Text style={styles.logo}>Waker</Text>
        <TouchableOpacity onPress={handleSkip} hitSlop={8}>
          <Text style={[styles.skipText, { color: T.subText }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ flexGrow: 0 }}
      />

      <View style={styles.dotsRow}>
        {SLIDES.map((s, i) => (
          <TouchableOpacity key={s.key} onPress={() => goToSlide(i)}>
            <View
              style={[
                styles.dot,
                { backgroundColor: i === index ? COLORS.primary : T.border },
                i === index && styles.dotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    height: 64,
  },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  skipText: { fontSize: 14, fontWeight: '600' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  iconWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 10, lineHeight: 28 },
  body: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  ctaButton: {
    marginTop: 28,
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  dotsRow: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 24 },
  dot: { height: 8, width: 8, borderRadius: 4 },
  dotActive: { width: 24 },
});
