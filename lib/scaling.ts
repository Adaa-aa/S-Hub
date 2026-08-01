import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design dimensions (iPhone 11 / standard mobile design width)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * Horizontal scale — scales a dimension based on the screen width.
 * Capped at 0.92x so content is slightly narrower than the original design,
 * giving a more compact, comfortable layout.
 * Only scales DOWN further on screens narrower than 375px to fit content.
 * Use for padding, margins, widths, etc.
 */
export const scale = (size: number): number =>
  size * Math.min(widthScale, 0.92);

/**
 * Vertical scale — scales a dimension based on the screen height.
 * Never scales UP beyond the original design size (capped at 1.0x).
 * Only scales DOWN on screens shorter than 812px to fit content.
 * Use for vertical spacing, heights, etc.
 */
export const verticalScale = (size: number): number =>
  size * Math.min(heightScale, 1.0);

/**
 * Moderate scale — scales fonts and elements.
 * Never scales UP (capped at 1.0x) so text stays at original size on large screens.
 * Only scales DOWN slightly on smaller screens for a subtle responsive effect.
 */
export const moderateScale = (size: number, factor = 0.2): number => {
  const scaled = size + (scale(size) - size) * factor;
  return Math.min(scaled, size);
};

// Short aliases for convenience
export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
