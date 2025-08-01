"use client";

import AdsgramButton from '@/components/common/AdsgramButton';
import { Card, Col, Divider, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';

export default function ExampleAdsgramPage() {
  const t = useTranslations();
  
  // Replace with your actual blockId from AdsGram dashboard
  const blockId = "13345";
  
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
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Basic AdsGram Button">
            <p>Click the button below to show an AdsGram ad:</p>
            <AdsgramButton 
              blockId={blockId}
              type="primary"
            />
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="AdsGram Button with Custom Text">
            <p>This button has custom text and handlers:</p>
            <AdsgramButton 
              blockId={blockId}
              type="default"
              onAdCompleted={handleAdCompleted}
              onAdFailed={handleAdFailed}
              rewardText="Congratulations! You earned 10 points!"
            >
              Watch Ad to Earn 10 Points
            </AdsgramButton>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Typography.Paragraph>
        <Typography.Text strong>Note:</Typography.Text> Make sure to replace "your-block-id" with your actual AdsGram block ID from your AdsGram dashboard.
      </Typography.Paragraph>
    </div>
  );
} 