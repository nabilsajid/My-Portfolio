import { useState, useRef, useCallback } from 'react';
import ImageCropperModal from './ImageCropperModal';

export const useImageCropper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const resolverRef = useRef<((blob: Blob | null) => void) | null>(null);
  const fileInfoRef = useRef<{name: string, type: string} | null>(null);

  const requestCrop = useCallback((fileOrUrl: File | string, requestedAspect?: number): Promise<File | null> => {
    return new Promise((resolve) => {
      let url = "";
      let name = "cropped.jpeg";
      let type = "image/jpeg";
      
      if (typeof fileOrUrl === 'string') {
        url = fileOrUrl;
        const ext = fileOrUrl.split('.').pop()?.split('?')[0];
        if (ext) {
          name = `image.${ext}`;
          type = `image/${ext === 'png' ? 'png' : 'jpeg'}`;
        }
      } else {
        url = URL.createObjectURL(fileOrUrl);
        name = fileOrUrl.name;
        type = fileOrUrl.type;
      }
      
      setImageSrc(url);
      setAspect(requestedAspect);
      setIsOpen(true);
      
      fileInfoRef.current = { name, type };
      resolverRef.current = resolve as unknown as (blob: Blob | null) => void;
    });
  }, []);

  const handleCropComplete = async (blob: Blob) => {
    if (resolverRef.current && fileInfoRef.current) {
      // Provide the blob as a File object so it plays nicely with existing uploaders
      const file = new File([blob], fileInfoRef.current.name, { type: 'image/jpeg' });
      // Clear the resolver reference BEFORE calling it, so handleClose doesn't fire it again
      const resolve = resolverRef.current;
      resolverRef.current = null;
      resolve(file);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc('');
    // If the modal was closed without saving, resolve with null
    if (resolverRef.current) {
      resolverRef.current(null);
      resolverRef.current = null;
    }
  }, [imageSrc]);

  const CropperComponent = (
    <ImageCropperModal
      isOpen={isOpen}
      onClose={handleClose}
      imageSrc={imageSrc}
      onCropComplete={handleCropComplete}
      aspect={aspect}
    />
  );

  return { requestCrop, CropperComponent };
};
