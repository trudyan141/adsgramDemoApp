"use client";

import AdsgramTask from '@/components/common/AdsgramTask';
import { AdsGram } from '@/constants/common';
import { Card, Col, Divider, Row, Typography } from 'antd';
import { useState } from 'react';

export default function ExampleTaskPage() {
  const [isLocalEnvironment, setIsLocalEnvironment] = useState(AdsGram.isLocalhost());
  
  // Get block IDs based on environment
  const blockIds = isLocalEnvironment ? AdsGram.LocalhostBlockId : AdsGram.DeployBlockId;
  const [rewardCount, setRewardCount] = useState(0);
  
  const handleReward = (event: CustomEvent<string>) => {
    console.log("Task completed successfully! Block ID:", event.detail);
    setRewardCount(prev => prev + 1);
  };
  
  const handleError = (event: CustomEvent<string>) => {
    console.error("Error during loading or rendering task:", event.detail);
  };

  const handleBannerNotFound = (event: CustomEvent<string>) => {
    console.warn("No task available for block:", event.detail);
  };

  const handleTooLongSession = (event: CustomEvent<string>) => {
    console.warn("Session is too long, please restart the app:", event.detail);
  };

  return (
    <div className="container mx-auto p-4">
      <Typography.Title level={2}>AdsGram Task Example</Typography.Title>
      
      <Typography.Paragraph>
        <Typography.Text strong>Environment:</Typography.Text> {isLocalEnvironment ? 'Local Development' : 'Production'}
      </Typography.Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Basic Task">
            <p>Complete the task below to earn rewards:</p>
            <div className="my-4">
              <AdsgramTask 
                blockId={blockIds.taskBlockId}
                debug={true}
                onReward={handleReward}
                onError={handleError}
                onBannerNotFound={handleBannerNotFound}
                onTooLongSession={handleTooLongSession}
              />
            </div>
            {rewardCount > 0 && (
              <Typography.Paragraph>
                <Typography.Text strong>Rewards earned:</Typography.Text> {rewardCount}
              </Typography.Paragraph>
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Customized Task">
            <p>This task has custom text and styling:</p>
            <div className="my-4">
              <AdsgramTask 
                blockId={blockIds.taskBlockId}
                debug={true}
                rewardText="🌟 500 Stars"
                buttonText="Play"
                claimText="Get Reward"
                doneText="Completed"
                onReward={handleReward}
              />
            </div>
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