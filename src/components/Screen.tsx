import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle>; edges?: readonly Edge[] }>;

// A simple wrapper to ensure content is not overlapped by the system status bar (top inset)
export default function Screen({ children, style, edges = ['top'] }: Props) {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
