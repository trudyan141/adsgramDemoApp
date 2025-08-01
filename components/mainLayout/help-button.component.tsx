import cssClass from "./help-button.module.scss";
import { useTranslations } from 'next-intl';
import { HELP_CONTACT_LINK } from "@/constants/common";

export default function HelpButton() {

  /**
   * HOOKS
   */
  const t = useTranslations();
  /**
   * FUNCTIONS
   */

  /**
   * RENDERS
   */


  return (
    <div className={`${cssClass.helpButton}`}>
      <div 
      className={`help-button`}
      onClick={() => window.open(HELP_CONTACT_LINK, '_blank')}
      role="button"
    >
      <img src="/images/telegram.png" alt="Help" />
      <div className="tooltip">{t('HELP_BUTTON_TOOLTIP_TITLE')}</div>
    </div>
    </div>
   
  );
}
