import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

type StepStatus = 'done' | 'pending' | 'locked';

const STEPS: { key: string; title: string; note: string; status: StepStatus }[] = [
  { key: 'submission', title: 'Document Submission', note: 'Completed', status: 'done' },
  { key: 'background', title: 'Background Check', note: 'Currently in review…', status: 'pending' },
  { key: 'activation', title: 'Account Activation', note: 'Unlocked after approval', status: 'locked' },
];

export default function VerificationPendingScreen() {
  const T = useThemeColors();

  const iconFor = (status: StepStatus) => {
    if (status === 'done') return { name: 'checkmark' as const, bg: COLORS.primary };
    if (status === 'pending') return { name: 'sync' as const, bg: COLORS.accent };
    return { name: 'lock-closed' as const, bg: T.inputBg };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <Text style={styles.logo}>Waker</Text>
        <Ionicons name="notifications-outline" size={22} color={T.text} />
      </View>

      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: T.card, borderColor: T.border }]}>
          <Ionicons name="hourglass-outline" size={56} color={COLORS.accentDark} />
        </View>

        <Text style={[styles.title, { color: T.text }]}>Verification in Progress</Text>
        <Text style={[styles.subtitle, { color: T.subText }]}>
          Our team is reviewing your documents. This usually takes 24–48 hours. We&apos;ll notify
          you once you&apos;re ready to start working!
        </Text>

        <View style={styles.stepsList}>
          {STEPS.map((step) => {
            const icon = iconFor(step.status);
            return (
              <View
                key={step.key}
                style={[
                  styles.stepRow,
                  { backgroundColor: T.card, borderColor: T.border },
                  step.status === 'pending' && { borderColor: COLORS.accent, borderWidth: 2 },
                ]}
              >
                <View style={[styles.stepIconWrap, { backgroundColor: icon.bg }]}>
                  <Ionicons
                    name={icon.name}
                    size={18}
                    color={step.status === 'locked' ? T.subText : '#fff'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, { color: T.text }]}>{step.title}</Text>
                  <Text style={[styles.stepNote, { color: T.subText }]}>{step.note}</Text>
                </View>
                {step.status === 'pending' && (
                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingPillText}>PENDING</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/home' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/support' as any)}>
          <Text style={[styles.supportText, { color: T.subText }]}>
            Need help? <Text style={styles.supportLink}>Contact Support</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  stepsList: { width: '100%', gap: 12, marginBottom: 28 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  stepIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: 15, fontWeight: '700' },
  stepNote: { fontSize: 12, marginTop: 2 },
  pendingPill: { backgroundColor: COLORS.accentLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pendingPillText: { fontSize: 10, fontWeight: '700', color: COLORS.accentDark },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  supportText: { fontSize: 13 },
  supportLink: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
});
