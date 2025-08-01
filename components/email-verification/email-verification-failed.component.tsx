"use client";

import { Modal, Button } from 'antd';
import { useTranslations } from 'next-intl';
interface EmailVerificationFailedProps {
    isVisible: boolean;
    onClose: () => void;
    onResend: () => void;
    onContactSupport: () => void;
}

const EmailVerificationFailed = ({ 
    isVisible, 
    onClose, 
    onResend, 
    onContactSupport 
}: EmailVerificationFailedProps) => {
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
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t('VERIFY_EMAIL_FAILED_MODAL_TITLE')}</h2>
                <p className="text-gray-600 mb-2">
                    {t('VERIFY_EMAIL_FAILED_MODAL_DESCRIPTION_1')}
                </p>
                <p className="text-gray-600 mb-6">
                    {t('VERIFY_EMAIL_FAILED_MODAL_DESCRIPTION_2')}
                </p>
                <div className="flex items-center gap-4 justify-center">
                    <Button onClick={onResend} className="">
                        {t('VERIFY_EMAIL_FAILED_MODAL_BTN_RESEND')}
                    </Button>
                    <Button type="primary" onClick={onContactSupport} className="">
                        {t('VERIFY_EMAIL_FAILED_MODAL_BTN_CONTACT')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EmailVerificationFailed;
