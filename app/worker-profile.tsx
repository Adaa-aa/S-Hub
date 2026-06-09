import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={styles.emoji}>👷</Text>
        <Text style={styles.title}>Worker Profile</Text>
        <Text style={styles.sub}>Worker ID: {id ?? 'unknown'}{'\n'}This screen is coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  back: { padding: 16 },
  backText: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  sub: { fontSize: 14, color: COLORS.muted, textAlign: 'center', lineHeight: 22 },
});
