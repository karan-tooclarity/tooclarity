'use client';

import React from 'react';
import styles from './SettingsSection.module.css';

interface SettingItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isDangerous?: boolean;
}

interface SettingsSectionProps {
  title?: string;
  items: SettingItem[];
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  items,
}) => {
  return (
    <div className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.list}>
        {items.map((item, index) => (
          <button
            key={index}
            className={styles.item}
            onClick={item.onClick}
          >
            <div className={styles.left}>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.text}>{item.label}</div>
            </div>
            <div className={styles.arrow}><svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.960782 12.2108L6.58578 6.58578C6.63808 6.53354 6.67957 6.4715 6.70788 6.40322C6.73618 6.33493 6.75075 6.26173 6.75075 6.18781C6.75075 6.11389 6.73618 6.0407 6.70788 5.97241C6.67957 5.90412 6.63808 5.84208 6.58578 5.78984L0.960782 0.164844C0.855234 0.0592961 0.71208 0 0.562813 0C0.413545 0 0.270392 0.0592961 0.164844 0.164844C0.0592959 0.270392 0 0.413546 0 0.562813C0 0.71208 0.0592959 0.855234 0.164844 0.960781L5.39258 6.18781L0.164844 11.4148C0.112582 11.4671 0.0711253 11.5292 0.0428413 11.5974C0.0145573 11.6657 0 11.7389 0 11.8128C0 11.8867 0.0145573 11.9599 0.0428413 12.0282C0.0711253 12.0965 0.112582 12.1585 0.164844 12.2108C0.217106 12.263 0.27915 12.3045 0.347433 12.3328C0.415717 12.3611 0.488903 12.3756 0.562813 12.3756C0.636722 12.3756 0.709908 12.3611 0.778192 12.3328C0.846475 12.3045 0.90852 12.263 0.960782 12.2108Z" fill="#697282"/>
</svg>
</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSection;