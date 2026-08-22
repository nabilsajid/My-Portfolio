import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Crop as CropIcon } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => Promise<void>;
  aspect?: number;
  mimeType?: string;
}

export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  mimeType: string = 'image/jpeg'
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2d context');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.9
    );
  });
}

const ImageCropperModal = ({ isOpen, onClose, imageSrc, onCropComplete, aspect, mimeType = 'image/jpeg' }: ImageCropperModalProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localAspect, setLocalAspect] = useState<number | undefined>(aspect);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalAspect(aspect);
    }
  }, [aspect, isOpen]);

  const handleAspectChange = (newAspect: number | undefined) => {
    setLocalAspect(newAspect);
    if (imageRef.current) {
      const { width, height } = imageRef.current;
      let cropWidth = 90;
      let cropHeight = newAspect ? (cropWidth / newAspect) * (width / height) : 90;
      
      if (cropHeight > 90) {
        cropHeight = 90;
        cropWidth = newAspect ? (cropHeight * newAspect) * (height / width) : 90;
      }
      
      setCrop({
        unit: '%',
        width: cropWidth,
        height: cropHeight,
        x: (100 - cropWidth) / 2,
        y: (100 - cropHeight) / 2
      });
    }
  };

  const handleSave = async () => {
    if (!completedCrop || !imageRef.current) return;
    
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageRef.current, completedCrop, mimeType);
      await onCropComplete(croppedBlob);
      onClose();
    } catch (e) {
      console.error("Failed to crop image", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4 bg-black/5 rounded-lg">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={localAspect}
            >
              <img
                ref={imageRef}
                alt="Crop me"
                src={imageSrc}
                crossOrigin="anonymous"
                className="max-h-[60vh] max-w-full"
                onLoad={(e) => {
                  const { width, height } = e.currentTarget;
                  let cropWidth = 90;
                  let cropHeight = localAspect ? (cropWidth / localAspect) * (width / height) : 90;
                  
                  if (cropHeight > 90) {
                    cropHeight = 90;
                    cropWidth = localAspect ? (cropHeight * localAspect) * (height / width) : 90;
                  }
                  
                  setCrop({
                    unit: '%',
                    width: cropWidth,
                    height: cropHeight,
                    x: (100 - cropWidth) / 2,
                    y: (100 - cropHeight) / 2
                  });
                }}
              />
            </ReactCrop>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground mr-2 font-medium flex items-center gap-1">
            <CropIcon className="w-4 h-4" /> Ratio:
          </span>
          {[
            { label: 'Free', value: undefined },
            { label: '1:1', value: 1 },
            { label: '4:3', value: 4 / 3 },
            { label: '16:9', value: 16 / 9 },
            { label: '3:4', value: 3 / 4 },
            { label: '9:16', value: 9 / 16 },
          ].map((ratio) => (
            <Button
              key={ratio.label}
              type="button"
              variant={localAspect === ratio.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectChange(ratio.value)}
              className="h-8 text-xs px-3"
            >
              {ratio.label}
            </Button>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop || isProcessing}>
            {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Crop & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropperModal;
