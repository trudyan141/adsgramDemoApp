"use client";

import { AdsgramTask as AdsgramTaskComponent } from '@adsgram/react';
import { Button } from 'antd';
import styles from './AdsgramTask.module.css';

interface AdsgramTaskProps {
  blockId: string;
  debug?: boolean;
  className?: string;
  rewardText?: string;
  buttonText?: string;
  claimText?: string;
  doneText?: string;
  onReward?: (event: CustomEvent<string>) => void;
  onError?: (event: CustomEvent<string>) => void;
  onBannerNotFound?: (event: CustomEvent<string>) => void;
  onTooLongSession?: (event: CustomEvent<string>) => void;
}

export default function AdsgramTask({
  blockId,
  debug = false,
  className = '',
  rewardText = '🪙 100',
  buttonText = 'Go',
  claimText = 'Claim',
  doneText = 'Done',
  onReward,
  onError,
  onBannerNotFound,
  onTooLongSession
}: AdsgramTaskProps) {
  const handleCheck = () => {
    console.log('Check');
  };

  // Format blockId to ensure it matches the required format
  const formattedBlockId = blockId.startsWith('task-') ? blockId : `task-${blockId}`;

  return (
    <AdsgramTaskComponent
      blockId={formattedBlockId as any}
      debug={debug}
      className={`${styles.task} ${className}`}
      onReward={onReward}
      onError={onError}
      onBannerNotFound={onBannerNotFound}
      onTooLongSession={onTooLongSession}
    >
      <p slot="reward" className={styles.reward}>{rewardText} <Button onClick={handleCheck}>Check</Button></p>
      <div slot="button" className={styles.button}>{buttonText}</div>
      <div slot="claim" className={styles.button_claim}>{claimText}</div>
      <div slot="done" className={styles.button_done}>{doneText}</div>
    </AdsgramTaskComponent>
  );
} 