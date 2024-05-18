"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ColorableImageProps {
    imagePath: string;
}

const Odontogram: React.FC<ColorableImageProps> = ({ imagePath }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [prevPos, setPrevPos] = useState<{ x: number; y: number } | null>(null);

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
    if (isWhitePixel(imageData)) {
      setIsPainting(true);
      setPrevPos({ x: offsetX, y: offsetY });
    }
  };

  const paint = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const imageData = getPixelData(offsetX, offsetY);
    if (isWhitePixel(imageData)) {
      if (prevPos) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.strokeStyle = 'black';
        context.lineWidth = 5;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(prevPos.x, prevPos.y);
        context.lineTo(offsetX, offsetY);
        context.closePath();
        context.stroke();

        
      }
    }
    setPrevPos({ x: offsetX, y: offsetY });
  };

  const endPaint = () => {
    setIsPainting(false);
    setPrevPos(null);
  };

  const getPixelData = (x: number, y: number): ImageData => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    return context?.getImageData(x, y, 1, 1) || new ImageData(1, 1);
  };

  const isWhitePixel = (imageData: ImageData): boolean => {
    const [red, green, blue, alpha] = imageData.data as any;
    console.log(red, green, blue, alpha);
    return red >= 250 && green >= 250 && blue >= 250 && alpha === 255;
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
