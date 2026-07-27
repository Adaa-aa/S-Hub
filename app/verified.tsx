import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

export default function VerifiedScreen() {
  const T = useThemeColors();

  const handleGoToDashboard = () => {
    // TODO: flip the user's active role to "worker" in your app state, then navigate
    router.replace('/home' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <Text style={styles.logo}>Waker</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.badgeWrap, { backgroundColor: COLORS.primaryLight }]}>
          <Ionicons name="shield-checkmark" size={56} color={COLORS.primary} />
        </View>

        <Text style={[styles.title, { color: T.text }]}>You&apos;re Verified!</Text>
        <Text style={[styles.subtitle, { color: T.subText }]}>
          Congratulations! You&apos;ve been approved to work on{' '}
          <Text style={{ fontWeight: '800', color: COLORS.primary }}>Waker</Text>. You can now
          start bidding on jobs.
        </Text>

        <View style={[styles.infoBox, { backgroundColor: T.card, borderColor: T.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.accentDark} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: T.text }]}>Welcome to Worker Mode</Text>
            <Text style={[styles.infoBody, { color: T.subText }]}>
              Tap the &apos;Switch Role&apos; button in your profile to see available jobs in your
              area and start earning.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleGoToDashboard} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Switch to Worker Mode</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.footerNote, { color: T.subText }]}>Ready to take your first job? Let&apos;s go!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingVertical: 12 },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 24 },
  badgeWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  infoBody: { fontSize: 13, lineHeight: 19 },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  footerNote: { fontSize: 13 },
});
