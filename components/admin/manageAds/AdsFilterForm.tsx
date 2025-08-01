import { Form, Input, Select, Button } from 'antd';
import { AD_STATUS } from '@/constants/common';
import { useTranslations } from 'next-intl';
interface AdsFilterFormProps {
  onFilterSubmit: (values: any) => void;
}

const AdsFilterForm: React.FC<AdsFilterFormProps> = ({ onFilterSubmit }) => {
  const t = useTranslations();
  const handleStatusChange = (value: string) => {
    // Trigger the filter submit with the updated status
    onFilterSubmit({ status: value });
  };

  return (
    <Form 
      layout="inline" 
      onFinish={onFilterSubmit} 
      style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
    >
      <div style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}>
        <Form.Item name="title" label={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_TITLE')} style={{ marginRight: 16, flex: '1 1 200px' }}>
          <Input placeholder={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_TITLE_PLACEHOLDER')} />
        </Form.Item>
        <Form.Item name="adId" label={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_AD_ID')} style={{ marginRight: 16, flex: '1 1 200px' }}>
          <Input placeholder={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_AD_ID_PLACEHOLDER')} />
        </Form.Item>
        <Form.Item name="userId" label={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_USER_ID')} style={{ marginRight: 16, flex: '1 1 200px' }}>
          <Input placeholder={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_USER_ID_PLACEHOLDER')} />
        </Form.Item>
        <Form.Item name="status" label={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_STATUS')} style={{ marginRight: 16, flex: '1 1 200px' }}>
          <Select placeholder={t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_STATUS_PLACEHOLDER')} onChange={handleStatusChange} style={{ width: '100%' }}>
            <Select.Option value={''}>{t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_STATUS_ALL')}</Select.Option>
            <Select.Option value={AD_STATUS.active}>{t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_STATUS_ACTIVE')}</Select.Option>
            <Select.Option value={AD_STATUS.rejected}>{t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_STATUS_REJECTED')}</Select.Option>
            <Select.Option value={AD_STATUS.inReview}>{t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_STATUS_IN_REVIEW')}</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <Form.Item>
        <Button type="primary" htmlType="submit">{t('ADMIN_PAGE_ADS_LIST_FORM_BTN_FILTER')}</Button>
      </Form.Item>
    </Form>
  );
};

export default AdsFilterForm;