import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, User, Lock, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/ui/header";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Account = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localProfile, setLocalProfile] = useState<UserProfile>({
    username: user?.username || '',
    email: 'admin@greenocean.ly',
    fullName: 'مدير النظام',
    phone: '+218 21 123456'
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setLocalProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success', 'تم بنجاح'),
        description: t('profileUpdated', 'تم تحديث بيانات الحساب بنجاح'),
      });
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('profileUpdateError', 'حدث خطأ أثناء تحديث بيانات الحساب'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t('error', 'خطأ'),
        description: t('passwordMismatch', 'كلمة المرور الجديدة وتأكيدها غير متطابقين'),
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: t('error', 'خطأ'),
        description: t('passwordTooShort', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: t('success', 'تم بنجاح'),
        description: t('passwordChanged', 'تم تغيير كلمة المرور بنجاح'),
      });
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('passwordChangeError', 'حدث خطأ أثناء تغيير كلمة المرور'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 ml-2" />
                {t('backToDashboard', 'العودة للوحة التحكم')}
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{t('accountManagement', 'إدارة الحساب')}</h1>
              <p className="text-muted-foreground">
                {t('accountManagementDescription', 'إدارة بيانات حسابك وتغيير كلمة المرور')}
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('profileData', 'بيانات الحساب')}</span>
                <span className="sm:hidden">{t('profile', 'الحساب')}</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">{t('changePassword', 'تغيير كلمة المرور')}</span>
                <span className="sm:hidden">{t('password', 'كلمة المرور')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    {t('profileData', 'بيانات الحساب')}
                  </CardTitle>
                  <CardDescription>
                    {t('profileDataDescription', 'تحديث معلومات حسابك الشخصية')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">
                        {t('username', 'اسم المستخدم')}
                      </Label>
                      <Input
                        id="username"
                        value={localProfile.username}
                        onChange={(e) => handleProfileChange('username', e.target.value)}
                        placeholder={t('enterUsername', 'أدخل اسم المستخدم')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {t('fullName', 'الاسم الكامل')}
                      </Label>
                      <Input
                        id="fullName"
                        value={localProfile.fullName}
                        onChange={(e) => handleProfileChange('fullName', e.target.value)}
                        placeholder={t('enterFullName', 'أدخل الاسم الكامل')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t('email', 'البريد الإلكتروني')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={localProfile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        placeholder={t('enterEmail', 'أدخل البريد الإلكتروني')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t('phoneNumber', 'رقم الهاتف')}
                      </Label>
                      <Input
                        id="phone"
                        value={localProfile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        placeholder={t('enterPhone', 'أدخل رقم الهاتف')}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? t('saving', 'جاري الحفظ...') : t('saveChanges', 'حفظ التغييرات')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    {t('changePassword', 'تغيير كلمة المرور')}
                  </CardTitle>
                  <CardDescription>
                    {t('changePasswordDescription', 'تحديث كلمة المرور لحسابك لضمان الأمان')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        {t('currentPassword', 'كلمة المرور الحالية')}
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        placeholder={t('enterCurrentPassword', 'أدخل كلمة المرور الحالية')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">
                        {t('newPassword', 'كلمة المرور الجديدة')}
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        placeholder={t('enterNewPassword', 'أدخل كلمة المرور الجديدة')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {t('confirmPassword', 'تأكيد كلمة المرور')}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        placeholder={t('confirmNewPassword', 'أكد كلمة المرور الجديدة')}
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{t('passwordRequirements', 'متطلبات كلمة المرور:')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('passwordLength', 'يجب أن تكون 6 أحرف على الأقل')}</li>
                      <li>• {t('passwordSecurity', 'يُنصح باستخدام أحرف وأرقام ورموز')}</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleChangePassword} 
                    disabled={isSubmitting || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isSubmitting ? t('changing', 'جاري التغيير...') : t('changePassword', 'تغيير كلمة المرور')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Account;