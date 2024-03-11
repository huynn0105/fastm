import { TabViewProps, Route } from 'react-native-tab-view';
import React from 'react';
import { CollapsibleHeaderProps } from '../HeadTabView';

type ZTabViewProps<T extends Route> = Partial<TabViewProps<T>> &
  Pick<TabViewProps<T>, 'onIndexChange' | 'navigationState' | 'renderScene'> &
  CollapsibleHeaderProps;

export class CollapsibleHeaderTabView<T extends Route> extends React.Component<ZTabViewProps<T>> {}

export class SlideTabView<T extends Route> extends React.Component<ZTabViewProps<T>> {}
