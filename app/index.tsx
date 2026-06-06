import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    icon: '🔍',
    title: 'Find Skilled Workers\nNear You',
    subtitle: 'Discover verified electricians, tailors, masons and more in your neighbourhood instantly.',
    bg: '#1B8B3A',
  },
  {
    id: 2,
    icon: '⭐',
    title: 'Verified &\nTrusted Workers',
    subtitle: 'Every worker is ID-verified and rated by real customers. No more guessing or getting scammed.',
    bg: '#1D6FBA',
  },
  {
    id: 3,
    icon: '🔒',
    title: 'Pay Safely\nWith Escrow',
    subtitle: 'Your money is held securely until the job is done. You only pay when you are satisfied.',
    bg: '#D97706',
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace('/login');
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: slide.bg }]}>

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Illustration */}
      <View style={styles.illustrationBox}>
        <Text style={styles.icon}>{slide.icon}</Text>
      </View>

      {/* Text */}
      <View style={styles.textBox}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === current && styles.dotActive]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>
          {isLast ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 24,
  },

  skipBtn: {
    position: 'absolute', top: 54, right: 24,
  },
  skipText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15, fontWeight: '500',
  },

  illustrationBox: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 48,
  },
  icon: { fontSize: 100 },

  textBox: {
    alignItems: 'center', marginBottom: 40, paddingHorizontal: 10,
  },
  title: {
    fontSize: 30, fontWeight: '800', color: '#fff',
    textAlign: 'center', lineHeight: 38, marginBottom: 16,
  },
  subtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.8)',
    textAlign: 'center', lineHeight: 24,
  },

  dots: {
    flexDirection: 'row', gap: 8, marginBottom: 40,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 24, backgroundColor: '#fff',
  },

  btn: {
    backgroundColor: '#fff',
    paddingVertical: 16, paddingHorizontal: 60,
    borderRadius: 30, width: '100%', alignItems: 'center',
  },
  btnText: {
    fontSize: 16, fontWeight: '800', color: '#111',
  },
});
