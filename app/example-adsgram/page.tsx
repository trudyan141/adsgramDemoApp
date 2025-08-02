"use client";

import AdsgramButton from '@/components/common/AdsgramButton';
import { AdsGram } from '@/constants/common';
import { Card, Col, Divider, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ExampleAdsgramPage() {
  const t = useTranslations();
  const [isLocalEnvironment, setIsLocalEnvironment] = useState(AdsGram.isLocalhost());
  
  // Get block IDs based on environment
  const blockIds = isLocalEnvironment ? AdsGram.LocalhostBlockId : AdsGram.DeployBlockId;
  
  const handleAdCompleted = () => {
    console.log("Ad completed successfully!");
    // Here you can add logic to reward the user
  };
  
  const handleAdFailed = () => {
    console.log("Ad failed or was skipped");
  };

  return (
    <div className="container mx-auto p-4">
      <Typography.Title level={2}>AdsGram Example</Typography.Title>
      
      <Typography.Paragraph>
        <Typography.Text strong>Environment:</Typography.Text> {isLocalEnvironment ? 'Local Development' : 'Production'}
      </Typography.Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Reward Ad">
            <p>Click the button below to show a reward ad:</p>
            <AdsgramButton 
              name="Reward Ad"
              blockId={blockIds.rewardBlockId}
              type="primary"
              onAdCompleted={handleAdCompleted}
              onAdFailed={handleAdFailed}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Reward Ad 2">
            <p>Another reward ad with custom text:</p>
            <AdsgramButton 
              name="Reward Ad 2"
              blockId={blockIds.rewardBlockId2}
              type="default"
              onAdCompleted={handleAdCompleted}
              onAdFailed={handleAdFailed}
              rewardText="Congratulations! You earned 10 points!"
            >
              Watch Ad to Earn 10 Points
            </AdsgramButton>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Interstitial Ad">
            <p>Click to show an interstitial ad:</p>
            <AdsgramButton 
              name="Interstitial Ad"
              blockId={blockIds.interstitialBlockId}
              type="primary"
              danger
              onAdCompleted={handleAdCompleted}
              onAdFailed={handleAdFailed}
            >
              Show Interstitial Ad
            </AdsgramButton>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Typography.Paragraph>
        <Typography.Text strong>Note:</Typography.Text> Block IDs are automatically selected based on your environment.
      </Typography.Paragraph>
    </div>
  );
} 