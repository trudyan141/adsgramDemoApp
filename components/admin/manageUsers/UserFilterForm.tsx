"use client";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Card } from 'antd';
import { useTranslations } from 'next-intl';

interface UserFilterFormProps {
  onFilterSubmit: (values: any) => void;
  loading?: boolean;
}

export default function UserFilterForm({ onFilterSubmit, loading }: UserFilterFormProps) {
  const [form] = Form.useForm();
  const t = useTranslations();
  const handleChange = (value: string[]) => {
    form.setFieldsValue({ roles: value });
  };
  return (
    <Card title={t('ADMIN_PAGE_USER_TITLE')} className="mb-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFilterSubmit}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <Form.Item 
            name="userId" 
            label={t('ADMIN_PAGE_USER_SEARCH_LABEL_USER_ID')}
          >
            <Input 
              placeholder={t('ADMIN_PAGE_USER_SEARCH_PLACEHOLDER_USER_ID')} 
            />
          </Form.Item>
          <Form.Item 
            name="username" 
            label={t('ADMIN_PAGE_USER_SEARCH_LABEL_USERNAME')}
          >
            <Input 
              placeholder={t('ADMIN_PAGE_USER_SEARCH_PLACEHOLDER_USERNAME')} 
            />
          </Form.Item> */}
          <Form.Item 
            name="projectName" 
            label={t('ADMIN_PAGE_USER_SEARCH_LABEL_PROJECT_NAME')}
          >
            <Input 
              placeholder={t('ADMIN_PAGE_USER_SEARCH_PLACEHOLDER_PROJECT_NAME')} 
            />
          </Form.Item>
          {/* <Form.Item 
            name="roles" 
            label={t('ADMIN_PAGE_USER_SEARCH_LABEL_ROLE')}
          >
            <Select
              onChange={handleChange}
              mode="multiple"
              placeholder={t('ADMIN_PAGE_USER_SEARCH_PLACEHOLDER_ROLE')}
              options={[
                { 
                  label: t('ADMIN_PAGE_USER_ROLE_ADVERTISER'), 
                  value: 'advertiser' 
                },
                { 
                  label: t('ADMIN_PAGE_USER_ROLE_PUBLISHER'), 
                  value: 'publisher' 
                },
              ]}
            />
          </Form.Item> */}
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
          >
            {t('ADMIN_PAGE_USER_SEARCH_BUTTON')}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
