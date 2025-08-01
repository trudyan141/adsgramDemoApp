"use client";

import { useAdsgram } from '@/hooks/useAdsgram';
import { Button, ButtonProps, message } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AdsgramButtonProps extends ButtonProps {
  blockId: string;
  onAdCompleted?: () => void;
  onAdFailed?: () => void;
  rewardText?: string;
}

export default function AdsgramButton({
  blockId,
  onAdCompleted,
  onAdFailed,
  rewardText,
  children,
  ...buttonProps
}: AdsgramButtonProps) {
  const { showAd, isReady } = useAdsgram(blockId);
  const [localLoading, setLocalLoading] = useState(false);
  const t = useTranslations();

  const handleClick = async () => {
    if (!isReady) {
      message.error(t('MESSAGE_ADSGRAM_NOT_READY'));
      return;
    }

    setLocalLoading(true);
    try {
      const success = await showAd();
      setLocalLoading(false);
      
      if (success) {
        message.success(rewardText || t('MESSAGE_ADSGRAM_REWARD_SUCCESS'));
        onAdCompleted?.();
      } else {
        onAdFailed?.();
      }
    } catch (error) {
      console.error('Error showing ad:', error);
      setLocalLoading(false);
      onAdFailed?.();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!isReady || localLoading}
      loading={localLoading}
      {...buttonProps}
    >
      {children || t('WATCH_AD')}
    </Button>
  );
} 