import React, { ComponentRef, ReactNode, RefObject, useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import type { Position } from 'geojson';

import { Spacing } from '@src/constants/layout';

interface DraggableMarkerProps {
  coordinate: Position;
  /** The map the marker sits on, used to convert screen points to coordinates. */
  mapRef: RefObject<Mapbox.MapView | null>;
  /** The view wrapping the map, used to find the map's position on screen. */
  mapContainerRef: RefObject<ComponentRef<typeof View> | null>;
  accessibilityLabel: string;
  children: ReactNode;
  onDragStart?: () => void;
  onDrag: (coordinate: Position) => void;
  onDragEnd?: () => void;
}

interface DragState {
  ready: boolean;
  mapX: number;
  mapY: number;
  /** Distance from the finger to the marker's center when the drag began. */
  offsetX: number;
  offsetY: number;
  /** Increments per move so only the latest coordinate lookup is applied. */
  sequence: number;
}

/**
 * Map marker that follows the user's finger. Must be rendered inside a MapView.
 */
export const DraggableMarker = (props: DraggableMarkerProps) => {
  const { coordinate, accessibilityLabel, children } = props;

  // The responder is created once, so it reads the latest props from a ref.
  const propsRef = useRef(props);
  propsRef.current = props;

  const dragState = useRef<DragState>({
    ready: false,
    mapX: 0,
    mapY: 0,
    offsetX: 0,
    offsetY: 0,
    sequence: 0,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_event, gesture) => {
        const { mapRef, mapContainerRef, onDragStart } = propsRef.current;
        const state = dragState.current;
        state.ready = false;
        onDragStart?.();

        mapContainerRef.current?.measureInWindow((mapX, mapY) => {
          state.mapX = mapX;
          state.mapY = mapY;
          mapRef.current
            ?.getPointInView(propsRef.current.coordinate)
            .then(([pointX, pointY]) => {
              state.offsetX = pointX - (gesture.x0 - mapX);
              state.offsetY = pointY - (gesture.y0 - mapY);
              state.ready = true;
            });
        });
      },
      onPanResponderMove: (_event, gesture) => {
        const state = dragState.current;
        if (!state.ready) {
          return;
        }
        const sequence = ++state.sequence;
        propsRef.current.mapRef.current
          ?.getCoordinateFromView([
            gesture.moveX - state.mapX + state.offsetX,
            gesture.moveY - state.mapY + state.offsetY,
          ])
          .then(nextCoordinate => {
            if (sequence === state.sequence) {
              propsRef.current.onDrag(nextCoordinate);
            }
          });
      },
      onPanResponderRelease: () => propsRef.current.onDragEnd?.(),
      onPanResponderTerminate: () => propsRef.current.onDragEnd?.(),
    }),
  ).current;

  return (
    <Mapbox.MarkerView
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      allowOverlap
      allowOverlapWithPuck
    >
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        style={styles.touchArea}
        {...panResponder.panHandlers}
      >
        {children}
      </View>
    </Mapbox.MarkerView>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    padding: Spacing.sm,
  },
});
