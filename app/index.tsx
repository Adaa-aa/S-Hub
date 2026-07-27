import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const PRIMARY = '#1B8B3A';
const PRIMARY_DARK = '#0F5C26';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetStarted = () => {
    router.replace('/onboarding' as any);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

      <View style={styles.topSection}>

        <View style={styles.logoArea}>
          <View style={styles.logoRow}>
            <Text style={styles.logoW}>W</Text>
            <View style={styles.checkBadge}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.logoRest}>Vaker</Text>
          </View>
          <Text style={styles.tagline1}>Find trusted workers.</Text>
          <Text style={styles.tagline2}>Get work done.</Text>
        </View>

        {/* Skill icons floating */}
        <View style={styles.iconsRow}>
          <View style={styles.iconBubble}>
            <Text style={styles.iconEmoji}>🔧</Text>
          </View>
          <View style={styles.iconBubble}>
            <Text style={styles.iconEmoji}>🧵</Text>
          </View>
          <View style={styles.iconBubble}>
            <Text style={styles.iconEmoji}>⚡</Text>
          </View>
          <View style={styles.iconBubble}>
            <Text style={styles.iconEmoji}>🖌️</Text>
          </View>
        </View>

        <View style={styles.workersArea}>
          <View style={styles.workersRow}>
            {[
              { emoji: '👷🏿', tool: '🔧', color: '#2EA94F' },
              { emoji: '👩🏿‍🔧', tool: '✂️', color: '#1B8B3A' },
              { emoji: '👷🏿‍♂️', tool: '🪛', color: '#0F5C26' },
              { emoji: '👩🏿‍🏭', tool: '🖌️', color: '#1B8B3A' },
            ].map((w, i) => (
              <View key={i} style={[styles.workerCard, { backgroundColor: w.color }]}>
                <Text style={styles.workerEmoji}>{w.emoji}</Text>
                <Text style={styles.workerTool}>{w.tool}</Text>
              </View>
            ))}
          </View>
        </View>

      </View>

      <View style={styles.bottomSection}>

        <View style={styles.shieldRow}>
          <View style={styles.dividerShort} />
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
          </View>
          <View style={styles.dividerShort} />
        </View>

        <Text style={styles.verifiedText}>Verified. Rated. Reliable.</Text>
        <Text style={styles.verifiedSub}>Your go-to app for skilled{'\n'}workers near you.</Text>

        <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted} activeOpacity={0.85}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_DARK,
  },
  topSection: {
    flex: 1,
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    paddingTop: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoW: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 70,
  },
  checkBadge: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginLeft: -8,
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  logoRest: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 70,
  },
  tagline1: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  tagline2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4ADE80',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconEmoji: { fontSize: 22 },
  workersArea: {
    width: '100%',
    paddingHorizontal: 20,
  },
  workersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  workerCard: {
    width: 72,
    height: 110,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  workerEmoji: { fontSize: 36 },
  workerTool: { fontSize: 18 },
  bottomSection: {
    backgroundColor: '#F2F2F2',
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dividerShort: {
    width: 48,
    height: 1.5,
    backgroundColor: PRIMARY,
    borderRadius: 2,
  },
  shieldIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldEmoji: { fontSize: 30 },
  verifiedText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  verifiedSub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: PRIMARY,
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffffff',
  },
});
