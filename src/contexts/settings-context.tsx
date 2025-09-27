import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface BasicData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface ImageSettings {
  logo: string;
  favicon: string;
  heroImage: string;
  aboutImage: string;
}

interface SettingsContextType {
  socialLinks: SocialLinks;
  basicData: BasicData;
  imageSettings: ImageSettings;
  updateSocialLinks: (links: SocialLinks) => Promise<void>;
  updateBasicData: (data: BasicData) => Promise<void>;
  updateImageSettings: (images: ImageSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSocialLinks: SocialLinks = {
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: ''
};

const defaultBasicData: BasicData = {
  siteName: 'Story Board Engine',
  siteDescription: 'منصة إدارة المحتوى المتقدمة',
  contactEmail: 'info@example.com',
  contactPhone: '+966 50 123 4567',
  address: 'الرياض، المملكة العربية السعودية'
};

const defaultImageSettings: ImageSettings = {
  logo: '',
  favicon: '',
  heroImage: '',
  aboutImage: ''
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [basicData, setBasicData] = useState<BasicData>(defaultBasicData);
  const [imageSettings, setImageSettings] = useState<ImageSettings>(defaultImageSettings);

  // Load settings from API on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.socialLinks) setSocialLinks(settings.socialLinks);
        if (settings.basicData) setBasicData(settings.basicData);
        if (settings.imageSettings) setImageSettings(settings.imageSettings);
      }
    } catch (error) {
      console.error('Error loading settings from API:', error);
    }
  };

  const updateSocialLinks = async (links: SocialLinks) => {
    try {
      const response = await fetch('/api/settings/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(links),
      });

      if (response.ok) {
        setSocialLinks(links);
      } else {
        throw new Error('Failed to update social links');
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      throw error;
    }
  };

  const updateBasicData = async (data: BasicData) => {
    try {
      const response = await fetch('/api/settings/basic-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setBasicData(data);
      } else {
        throw new Error('Failed to update basic data');
      }
    } catch (error) {
      console.error('Error updating basic data:', error);
      throw error;
    }
  };

  const updateImageSettings = async (images: ImageSettings) => {
    try {
      const response = await fetch('/api/settings/image-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(images),
      });

      if (response.ok) {
        setImageSettings(images);
      } else {
        throw new Error('Failed to update image settings');
      }
    } catch (error) {
      console.error('Error updating image settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        socialLinks,
        basicData,
        imageSettings,
        updateSocialLinks,
        updateBasicData,
        updateImageSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
