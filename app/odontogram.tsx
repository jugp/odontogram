"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ColorableImageProps {
    imagePath: string;
}

const Odontogram: React.FC<ColorableImageProps> = ({ imagePath }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const loadImage = async () => {
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
        };
        image.src = imagePath;
      };

    loadImage();
  }, [imagePath]);

  const startPaint = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const imageData = getPixelData(offsetX, offsetY);
    if (isTooth(imageData)) {
      setIsPainting(true);
      setCurrentPosition({ x: offsetX, y: offsetY });
    }
  };

  const paint = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const imageData = getPixelData(offsetX, offsetY);
    if (isTooth(imageData)) {
      if (currentPosition) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.lineJoin = 'round';
        context.lineCap = 'round';

        context.beginPath();
        context.moveTo(currentPosition.x, currentPosition.y);
        context.lineTo(offsetX, offsetY);
        context.closePath();
        context.stroke();

        
      }
    }
    setCurrentPosition({ x: offsetX, y: offsetY });
  };

  const endPaint = () => {
    setIsPainting(false);
    setCurrentPosition(null);
  };

  const getPixelData = (x: number, y: number): ImageData => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    return context?.getImageData(x, y, 1, 1) || new ImageData(1, 1);
  };

  const isTooth = (imageData: ImageData): boolean => {
    const [red, green, blue, alpha] = imageData.data as any;
    console.log(red, green, blue, alpha);
    return !((red == 255 && green == 255 && blue == 255) || (red == 0 && green == 0 && blue == 0))
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startPaint}
      onMouseMove={paint}
      onMouseUp={endPaint}
      onMouseLeave={endPaint}
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default Odontogram;
