import { Modal, Form, Input, Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import SafeHtmlComponent from '@/components/safeHtml/safe-html.component';
interface ProfileCompletionModalProps {
    email: string;
    isVisible: boolean;
    loading: boolean;
    onClose: () => void;
    onSubmit: (values: { email: string; projectName: string }) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
    email,
    isVisible,
    loading,
    onClose,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const t = useTranslations();
    
    useEffect(() => {
        if (isVisible && !email) {
            form.resetFields();
        }
    }, [isVisible]);

    const renderEmailForm = () => (
        <>
            <p className="text-gray-500 mb-6">{t('COMPLETE_PROFILE_MODAL_DESCRIPTION')}</p>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onSubmit(values);
                }}
            >
                <Form.Item
                    name="email"
                    label={t('COMPLETE_PROFILE_MODAL_FORM_LABEL_EMAIL')}
                    rules={[
                        { required: true, message: t('VALIDATE_REQUIRED') },
                        { type: 'email', message: t('VALIDATE_TYPE_EMAIL') }
                    ]}
                >
                    <Input placeholder={t('COMPLETE_PROFILE_MODAL_FORM_LABEL_EMAIL_PLACEHOLDER')} />
                </Form.Item>
                <Form.Item
                    name="projectName"
                    label={t('COMPLETE_PROFILE_MODAL_FORM_LABEL_PROJECT_NAME')}
                    rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}
                >
                    <Input placeholder={t('COMPLETE_PROFILE_MODAL_FORM_LABEL_PROJECT_NAME_PLACEHOLDER')} />
                </Form.Item>
                <Form.Item className="flex justify-center">
                    <Button loading={loading} type="primary" htmlType="submit" className="min-w-[120px]">
                        {t('COMPLETE_PROFILE_MODAL_BTN_SUBMIT')}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );

    const renderEmailSent = () => (
        <div className="text-center py-6">
            <div className="text-6xl mb-4 text-green-500"><CheckCircleFilled /></div>
            <h3 className="text-xl font-semibold mb-4">{t('EMAIL_COMPLETE_VERIFY_MODAL_MAIN_LABEL')}</h3>
            <p className="text-gray-600 mb-6">
            {t.rich('EMAIL_COMPLETE_VERIFY_MODAL_DES_1', {
                email: email,
                br: () => <br />,
                span: (children) => <span className="font-semibold">{children} <br/></span> 
            })}
            </p>
            <p className="text-gray-500 text-sm">
              {t('EMAIL_COMPLETE_VERIFY_MODAL_DES_2')} 
            </p>
        </div>
    );

    return (
        <Modal
            title={email ? t('EMAIL_COMPLETE_VERIFY_MODAL_TITLE') : t('COMPLETE_PROFILE_MODAL_TITLE')}
            open={isVisible}
            onCancel={onClose}
            footer={null}
            maskClosable={false}
            closeIcon={true}
        >
            {email ? renderEmailSent() : renderEmailForm()}
        </Modal>
    );
};

export default ProfileCompletionModal;
