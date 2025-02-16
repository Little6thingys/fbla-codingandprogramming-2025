// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': {material: 'home', fontAwesome5: 'home'},
  'paperplane.fill': {material: 'send', fontAwesome5: undefined},
  'chevron.left.forwardslash.chevron.right': {material: 'code', fontAwesome5: undefined},
  'chevron.right': {material: 'chevron-right', fontAwesome5: undefined},
  'coloncurrencysign.circle': {material: undefined, fontAwesome5: 'coins'},
  'line.horizontal.3': {material: 'menu', fontAwesome5: undefined},
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    { 
      material?: React.ComponentProps<typeof MaterialIcons>['name'] | undefined; 
      fontAwesome5?: React.ComponentProps<typeof FontAwesome5>['name'] | undefined;
    }
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
  library = 'material',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  library?: 'material' | 'fontAwesome5';
}) {
  const iconName = MAPPING[name]?.[library];

  if(!iconName){
    console.warn('No icon mapping found for "${name}"');
    return null;
  }

  return library === 'material' ? (
    <MaterialIcons color={color} size={size} name={iconName}/>
  ) : (
    <FontAwesome5 color={color} size={size} name={iconName} style={style} />
  );
}
