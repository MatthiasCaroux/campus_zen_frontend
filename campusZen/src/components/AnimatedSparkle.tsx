import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, ViewStyle } from 'react-native';

interface AnimatedSparkleProps {
  style?: ViewStyle;
}

export default function AnimatedSparkle({ style }: AnimatedSparkleProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animate();
  }, [scaleAnim, opacityAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        style,
        {
          transform: [{ scale: scaleAnim }, { rotate: spin }],
          opacity: opacityAnim,
        },
      ]}
    >
      ✦
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  sparkle: {
    position: 'absolute',
    color: '#D4A855',
    fontSize: 24,
    textShadowColor: '#D4A855',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
