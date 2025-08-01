"use client";

import { useAdsgram as useAdsgramReact } from '@adsgram/react';

export function useAdsgram(blockId: string) {
  // Using any type to avoid TypeScript errors with the library
  const adsgram = useAdsgramReact({ 
    blockId: blockId as any
  } as any);

  const showAd = async () => {
    try {
      const result = await adsgram.show();
      return !!result?.done;
    } catch (error) {
      console.error('Error showing ad:', error);
      return false;
    }
  };

  return { 
    showAd,
    isReady: true, 
    isLoading: false 
  };
}
