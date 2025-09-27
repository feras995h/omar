import { useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { Save, Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, MapPin, Mail, Image } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/ui/header";
import { useToast } from "@/hooks/use-toast";

interface SocialMediaLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

interface BasicData {
  phone: string;
  address: string;
  email: string;
}

interface ImageSettings {
  logo: string;
  heroBackground: string;
}

const Settings = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const { socialLinks, basicData, imageSettings, updateSocialLinks, updateBasicData, updateImageSettings } = useSettings();
  
  // Local state for form inputs
  const [localSocialLinks, setLocalSocialLinks] = useState<SocialMediaLinks>(socialLinks);
  const [localBasicData, setLocalBasicData] = useState<BasicData>(basicData);
  const [localImageSettings, setLocalImageSettings] = useState<ImageSettings>(imageSettings);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSocialLinkChange = (platform: keyof typeof localSocialLinks, value: string) => {
    setLocalSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleBasicDataChange = (field: keyof typeof localBasicData, value: string) => {
    setLocalBasicData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSettingsChange = (field: keyof typeof localImageSettings, value: string) => {
    setLocalImageSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSocialLinks = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateSocialLinks(localSocialLinks);
      
      toast({
        title: t('success', 'نجح'),
        description: t('socialLinksSaved', 'تم حفظ روابط وسائل التواصل الاجتماعي بنجاح'),
      });
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('saveFailed', 'فشل في حفظ البيانات'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBasicData = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateBasicData(localBasicData);
      
      toast({
        title: t('success', 'نجح'),
        description: t('basicDataSaved', 'تم حفظ البيانات الأساسية بنجاح'),
      });
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('saveFailed', 'فشل في حفظ البيانات'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveImageSettings = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateImageSettings(localImageSettings);
      
      toast({
        title: t('success', 'نجح'),
        description: t('imageSettingsSaved', 'تم حفظ إعدادات الصور بنجاح'),
      });
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('saveFailed', 'فشل في حفظ البيانات'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('settings', 'الإعدادات')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t('settingsDescription', 'إدارة إعدادات الموقع والبيانات الأساسية')}
            </p>
          </div>

          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="social" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="hidden sm:inline">{t('socialMedia', 'وسائل التواصل الاجتماعي')}</span>
                <span className="sm:hidden">{t('social', 'التواصل')}</span>
              </TabsTrigger>
              <TabsTrigger value="basic" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="hidden sm:inline">{t('basicData', 'البيانات الأساسية')}</span>
                <span className="sm:hidden">{t('basic', 'البيانات')}</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="hidden sm:inline">{t('images', 'الصور')}</span>
                <span className="sm:hidden">{t('images', 'الصور')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('socialMediaLinks', 'روابط وسائل التواصل الاجتماعي')}</span>
                    <span className="sm:hidden">{t('socialLinks', 'روابط التواصل')}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t('socialMediaDescription', 'إدارة روابط حسابات وسائل التواصل الاجتماعي الخاصة بالشركة')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2 text-sm">
                        <Facebook className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        {t('facebook', 'فيسبوك')}
                      </Label>
                      <Input
                        id="facebook"
                        type="url"
                        placeholder="https://facebook.com/yourpage"
                        value={localSocialLinks.facebook}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2 text-sm">
                        <Twitter className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                        {t('twitter', 'تويتر')}
                      </Label>
                      <Input
                        id="twitter"
                        type="url"
                        placeholder="https://twitter.com/yourhandle"
                        value={localSocialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2 text-sm">
                        <Instagram className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
                        {t('instagram', 'إنستغرام')}
                      </Label>
                      <Input
                        id="instagram"
                        type="url"
                        placeholder="https://instagram.com/yourprofile"
                        value={localSocialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2 text-sm">
                        <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
                        {t('linkedin', 'لينكد إن')}
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/company/yourcompany"
                        value={localSocialLinks.linkedin}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube" className="flex items-center gap-2 text-sm">
                        <Youtube className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        {t('youtube', 'يوتيوب')}
                      </Label>
                      <Input
                        id="youtube"
                        type="url"
                        placeholder="https://youtube.com/channel/yourchannel"
                        value={localSocialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSaveSocialLinks}
                      disabled={isSubmitting}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isSubmitting ? t('saving', 'جاري الحفظ...') : t('saveChanges', 'حفظ التغييرات')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="basic" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('basicInformation', 'المعلومات الأساسية')}</span>
                    <span className="sm:hidden">{t('basicInfo', 'المعلومات')}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t('basicDataDescription', 'إدارة البيانات الأساسية للشركة مثل رقم الهاتف والعنوان')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        {t('phoneNumber', 'رقم الهاتف')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={localBasicData.phone}
                        onChange={(e) => handleBasicDataChange('phone', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        {t('email', 'البريد الإلكتروني')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@company.com"
                        value={localBasicData.email}
                        onChange={(e) => handleBasicDataChange('email', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        {t('address', 'العنوان')}
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder={t('addressPlaceholder', 'الرياض، المملكة العربية السعودية')}
                        value={localBasicData.address}
                        onChange={(e) => handleBasicDataChange('address', e.target.value)}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSaveBasicData}
                      disabled={isSubmitting}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isSubmitting ? t('saving', 'جاري الحفظ...') : t('saveChanges', 'حفظ التغييرات')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('imageSettings', 'إعدادات الصور')}</span>
                    <span className="sm:hidden">{t('images', 'الصور')}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t('imageSettingsDescription', 'إدارة صور الموقع مثل اللوجو وصورة الخلفية الرئيسية')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid gap-3 sm:gap-4">
                    <ImageUpload
                      label={t('logo', 'اللوجو')}
                      value={localImageSettings.logo}
                      onChange={(value) => handleImageSettingsChange('logo', value)}
                      placeholder="/src/assets/logo.svg"
                      description={t('logoDescription', 'مسار ملف اللوجو (SVG مفضل)')}
                      accept="image/svg+xml,image/png,image/jpg,image/jpeg"
                    />

                    <ImageUpload
                      label={t('heroBackground', 'خلفية القسم الرئيسي')}
                      value={localImageSettings.heroBackground}
                      onChange={(value) => handleImageSettingsChange('heroBackground', value)}
                      placeholder="/src/assets/hero-background.svg"
                      description={t('heroBackgroundDescription', 'مسار ملف خلفية القسم الرئيسي (SVG أو JPG)')}
                      accept="image/*"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSaveImageSettings}
                      disabled={isSubmitting}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isSubmitting ? t('saving', 'جاري الحفظ...') : t('saveChanges', 'حفظ التغييرات')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;