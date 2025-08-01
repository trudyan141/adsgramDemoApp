
import { Button } from 'antd';
import { useState } from 'react';
import cssClass from './banner.module.scss';
import { useTranslations } from 'next-intl';
import SafeHtmlComponent from '@/components/safeHtml/safe-html.component';
const BannerComponent = () => {
  /***
   * STATES
   */
  const [urlLink, setUrlLink] = useState('https://dmtp.gitbook.io/dmtp-sdk'); 
  /**
   * HOOKS
   */
  const t = useTranslations();
  /**
   * FUNCTIONS
   */
  const handleOpenLink= () => {
    // open link
    window.open(urlLink, '_blank');
  };
  /**
   * RENDERS
   */
  return (
    <div className={`${cssClass.BannerComponent}`}>
      <div className="banner-container">
        <div className="banner-left" data-aos="fade-right" data-aos-delay="300">
          <div className="banner-title"> 
              <SafeHtmlComponent htmlContent={t.raw('BANNER_COMP_TITLE')} />
          </div>
          <div className="banner-description">
           {t('BANNER_COMP_DESCRIPTION')}
          </div>
          <div className="button-connect-container">
            <Button  onClick={handleOpenLink} className="button-connect">
            {t('BANNER_COMP_BTN_LEARN_MORE')}
            </Button>
          </div>
        </div>
        <div className="banner-right" data-aos="fade-down" data-aos-delay="1000">
          <img className="banner-logo" src="/images/homePage/banner-logo.png" alt="banner" />
        </div>
      </div>
    </div>
  );
};

export default BannerComponent;
