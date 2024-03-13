import React, { useCallback } from 'react';
import { memo, useState } from 'react';
import FastImage from 'react-native-fast-image';

const AutoHeightImage = memo(function AutoHeightImage({
  width,
  style,
  maxHeight,
  ...props
}: ImageProps) {
  const [height, setHeight] = useState(0);

  const calculateHeight = useCallback(
    (imageWidth: number, imageHeight: number) => {
      const aspectRatio = imageHeight / imageWidth;
      const calculatedHeight = aspectRatio * width;

      if (calculatedHeight > maxHeight) {
        return maxHeight;
      }

      return calculatedHeight;
    },
    [maxHeight, width],
  );

  const onLoad = useCallback(
    (evt) => {
      const calculatedHeight = calculateHeight(evt.nativeEvent.width, evt.nativeEvent.height);
      setHeight(calculatedHeight);
    },
    [calculateHeight],
  );

  return (
    <FastImage
      {...props}
      style={[style, { width: width, height: height, maxHeight: maxHeight }]}
      onLoad={onLoad}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
});

export default AutoHeightImage;
