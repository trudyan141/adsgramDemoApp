"use client";
import { Card, Row, Col, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import backendService from '@/services/backend/backend.service';
import { useRouter } from 'next/navigation';
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAds: 0,
    totalInventory: 0,
  });
  const router = useRouter();
 
  useEffect(() => {
    router.push("/admin/dashboard");
  }, []);
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={stats.totalAds}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Inventory Items"
              value={stats.totalInventory}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
