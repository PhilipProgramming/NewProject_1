import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { images } from '@/constants/assets';
import { colors, fonts, spacing } from '@/constants/theme';
import { useTypewriter } from '@/hooks/useTypewriter';
import { markWelcomeEntered } from '@/lib/welcomeSession';

const HEADING = "Welcome to L'Étape";
const START_TEXT = 'Click here to start...';
const BLANK_MS = 600;
const PAUSE_BEFORE_BASKET_MS = 400;
const PAUSE_BEFORE_START_MS = 350;
const HEADING_CHAR_MS = 95;
const START_CHAR_MS = 72;
const BASKET_WIDTH = 268;

const AnimatedImage = Animated.createAnimatedComponent(Image);

/**
 * Introductory welcome experience — shown once per browser session before Today.
 * Only the blueberry basket is interactive; all copy is presentational.
 */
export function WelcomeScreen() {
  const [showContent, setShowContent] = useState(false);
  const [startTypingEnabled, setStartTypingEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [basketFocused, setBasketFocused] = useState(false);
  const [basketHovered, setBasketHovered] = useState(false);

  const screenOpacity = useSharedValue(1);
  const headingOpacity = useSharedValue(1);
  const startOpacity = useSharedValue(1);
  const basketOpacity = useSharedValue(0);
  const basketTranslateY = useSharedValue(14);
  const basketScale = useSharedValue(1);
  const basketHover = useSharedValue(0);

  const { displayed: headingText, done: headingDone } = useTypewriter(HEADING, {
    delay: BLANK_MS,
    charDelay: HEADING_CHAR_MS,
    enabled: true,
  });

  const { displayed: startText, done: startDone } = useTypewriter(START_TEXT, {
    delay: 0,
    charDelay: START_CHAR_MS,
    enabled: startTypingEnabled,
  });

  useEffect(() => {
    const id = setTimeout(() => setShowContent(true), BLANK_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!headingDone) {
      return;
    }

    const id = setTimeout(() => {
      basketOpacity.value = withTiming(1, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      });
      basketTranslateY.value = withTiming(0, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      });
    }, PAUSE_BEFORE_BASKET_MS);

    const startId = setTimeout(() => {
      setStartTypingEnabled(true);
    }, PAUSE_BEFORE_BASKET_MS + 650 + PAUSE_BEFORE_START_MS);

    return () => {
      clearTimeout(id);
      clearTimeout(startId);
    };
  }, [headingDone, basketOpacity, basketTranslateY]);

  useEffect(() => {
    if (!startDone) {
      return;
    }

    const id = setInterval(() => {
      setCursorVisible((visible) => !visible);
    }, 530);

    return () => clearInterval(id);
  }, [startDone]);

  const navigateToApp = useCallback(() => {
    markWelcomeEntered();
    router.replace('/(tabs)');
  }, []);

  const handleEnter = useCallback(() => {
    if (isLocked) {
      return;
    }
    setIsLocked(true);

    headingOpacity.value = withTiming(0, { duration: 420 });
    startOpacity.value = withTiming(0, { duration: 420 });
    basketScale.value = withTiming(1.1, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });

    screenOpacity.value = withDelay(
      280,
      withTiming(
        0,
        { duration: 520, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(navigateToApp)();
          }
        },
      ),
    );
  }, [
    isLocked,
    headingOpacity,
    startOpacity,
    basketScale,
    screenOpacity,
    navigateToApp,
  ]);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const headingStyle = useAnimatedStyle(() => ({
    opacity: headingOpacity.value,
  }));

  const startStyle = useAnimatedStyle(() => ({
    opacity: startOpacity.value,
  }));

  const basketStyle = useAnimatedStyle(() => {
    const hoverLift = basketHover.value * -3;
    const hoverScale = 1 + basketHover.value * 0.03;

    return {
      opacity: basketOpacity.value,
      transform: [
        { translateY: basketTranslateY.value + hoverLift },
        { scale: basketScale.value * hoverScale },
      ],
    };
  });

  const renderStartText = () => {
    if (!startTypingEnabled && !startText) {
      return null;
    }

    const base = startText.slice(0, -3);
    const dots = startText.slice(-3);

    if (!startDone) {
      return <Text style={styles.startText}>{startText}</Text>;
    }

    return (
      <Text style={styles.startText}>
        {base}
        {dots.slice(0, 2)}
        <Text style={cursorVisible ? styles.cursorVisible : styles.cursorHidden}>
          .
        </Text>
      </Text>
    );
  };

  return (
    <Animated.View style={[styles.root, screenStyle]}>
      <View style={styles.content}>
        {showContent ? (
          <Animated.Text style={[styles.heading, headingStyle]}>
            {headingText}
          </Animated.Text>
        ) : (
          <View style={styles.headingPlaceholder} />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enter L'Étape"
          disabled={isLocked || !startDone}
          onPress={handleEnter}
          onFocus={() => setBasketFocused(true)}
          onBlur={() => setBasketFocused(false)}
          onHoverIn={() => {
            setBasketHovered(true);
            basketHover.value = withTiming(1, { duration: 280 });
          }}
          onHoverOut={() => {
            setBasketHovered(false);
            basketHover.value = withTiming(0, { duration: 280 });
          }}
          style={[
            styles.basketPressable,
            basketFocused && styles.basketFocused,
            Platform.OS === 'web' && styles.basketPressableWeb,
            Platform.OS === 'web' &&
              basketHovered &&
              styles.basketPressableWebHover,
          ]}
        >
          <AnimatedImage
            source={images.welcomeBasket}
            style={[styles.basket, basketStyle]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </Pressable>

        {startTypingEnabled ? (
          <Animated.View style={[styles.startWrap, startStyle]}>
            {renderStartText()}
          </Animated.View>
        ) : (
          <View style={styles.startPlaceholder} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    marginTop: -spacing.xxl,
  },
  heading: {
    fontFamily: fonts.displayRegular,
    fontSize: 66,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 78,
    letterSpacing: -0.3,
    marginBottom: spacing.lg,
  },
  headingPlaceholder: {
    height: 78,
    marginBottom: spacing.lg,
  },
  basketPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    borderRadius: 8,
  },
  basketPressableWeb: {
    cursor: 'pointer',
  },
  basketPressableWebHover: {
    filter: 'brightness(1.06) saturate(1.08)',
  },
  basketFocused: {
    ...(Platform.OS === 'web'
      ? {
          outlineStyle: 'solid',
          outlineWidth: 2,
          outlineColor: 'rgba(7, 42, 108, 0.35)',
          outlineOffset: 6,
        }
      : {}),
  },
  basket: {
    width: BASKET_WIDTH,
    height: BASKET_WIDTH * 1.05,
    resizeMode: 'contain',
  },
  startWrap: {
    marginTop: spacing.lg,
    minHeight: 56,
  },
  startPlaceholder: {
    marginTop: spacing.lg,
    minHeight: 56,
  },
  startText: {
    fontFamily: fonts.displayRegular,
    fontSize: 40,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 56,
  },
  cursorVisible: {
    opacity: 1,
  },
  cursorHidden: {
    opacity: 0.15,
  },
});
