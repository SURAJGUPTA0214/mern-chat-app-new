import { CheckCircleOutlined,CloseCircleOutlined, InfoCircleFilled } from '@ant-design/icons';
import { notification } from 'antd';

import styles from './style.module.css';

export default function Toast (type, category, toastTitle, toastText='Something went wrong!') {

  if(typeof toastText !== 'string'){
    toastText = Object.values(toastText).join();
  }

  const placement = 'top';  // options are : top, bottom. topRight, topLeft, bottomRight, bottomLeft 

  const iconType = icon => {
    switch (icon) {
      case 'single-success': return <CheckCircleOutlined />;
      case 'single-warning': return <InfoCircleFilled className={`mr-2 ${styles['inf-notif']}`} />;
      case 'single-error': return <CloseCircleOutlined />;
      case 'single-general': return <InfoCircleFilled />;
      case 'multiple-success' : return <CheckCircleOutlined />;
      case 'multiple-error' : return <CloseCircleOutlined />;
      case 'multiple-general' : return <InfoCircleFilled />;
      case 'multiple-warning' : return <InfoCircleFilled />;
      default: return <CheckCircleOutlined />;
    }
  };

  const Notify = (key, icon, toastTitle, toastText) => {
    
    return (<div>{
        notification.open({
          key,
          message: toastTitle,
          description: toastText,
          icon: iconType(icon),
          placement
        })}
    </div>);
  };

  switch (category) {
    case 'warning': Notify(1, 'single-warning', toastTitle, toastText); break;
    case 'success': Notify(2, 'single-success', toastTitle, toastText); break;
    case 'error': Notify(3, 'single-error', toastTitle, toastText); break;
    case 'general':  Notify(4, 'single-general', toastTitle, toastText); break;
    default: return null;
  }
}