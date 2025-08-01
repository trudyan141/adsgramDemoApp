"use client";

import { Modal, Button } from 'antd';
import { useTranslations } from 'next-intl';
interface EmailVerificationSuccessProps {
    isVisible: boolean;
    onClose: () => void;
}

const EmailVerificationSuccess = ({ isVisible, onClose }: EmailVerificationSuccessProps) => {
    const t = useTranslations();
    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null}
            closable={false}
            centered
        >
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t('VERIFY_EMAIL_SUCCESS_MODAL_TITLE')}</h2>
                <p className="text-gray-600 mb-2">
                    {t('VERIFY_EMAIL_SUCCESS_MODAL_DESCRIPTION_1')}
                </p>
                <p className="text-gray-600 mb-6">
                    {t('VERIFY_EMAIL_SUCCESS_MODAL_DESCRIPTION_2')}
                </p>
                <Button type="primary" onClick={onClose} className="w-120">
                    {t('VERIFY_EMAIL_SUCCESS_MODAL_BTN_GO_TO_HOME')}
                </Button>
            </div>
        </Modal>
    );
};

export default EmailVerificationSuccess;
