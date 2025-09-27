import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Settings, FolderOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Link } from "react-router-dom";
import ProjectForm from "@/components/ProjectForm";

const Dashboard = () => {
  const { logout } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent truncate max-w-[180px] sm:max-w-none">
                {t('dashboardTitle', 'لوحة التحكم')}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('logout', 'تسجيل الخروج')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="projects" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('projects', 'المشاريع')}</span>
              <span className="sm:hidden">{t('projects', 'المشاريع').substring(0, 6)}</span>
            </TabsTrigger>
            <TabsTrigger value="new-project" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('newProject', 'مشروع جديد')}</span>
              <span className="sm:hidden">جديد</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('settings', 'الإعدادات')}</span>
              <span className="sm:hidden">إعدادات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">{t('projectsList', 'قائمة المشاريع')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('projectsDescription', 'إدارة وعرض جميع المشاريع المنشورة')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">{t('noProjects', 'لا توجد مشاريع حالياً')}</p>
                  <p className="text-xs sm:text-sm mt-2 px-4">
                    {t('createFirstProject', 'ابدأ بإنشاء مشروعك الأول من تبويب "مشروع جديد"')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-project" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">{t('createNewProject', 'إنشاء مشروع جديد')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('newProjectDescription', 'أضف مشروع جديد مع الصور والمحتوى بالعربية والإنجليزية')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">{t('systemSettings', 'إعدادات النظام')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('settingsDescription', 'إدارة إعدادات الموقع والحساب')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm sm:text-base">{t('language', 'اللغة')}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {t('languageDescription', 'تغيير لغة واجهة لوحة التحكم')}
                      </p>
                    </div>
                    <div className="flex justify-end sm:justify-start">
                      <LanguageSwitcher />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm sm:text-base">{t('websiteSettings', 'إعدادات الموقع')}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {t('websiteSettingsDescription', 'إدارة روابط التواصل الاجتماعي والبيانات الأساسية')}
                      </p>
                    </div>
                    <div className="flex justify-end sm:justify-start">
                      <Link to="/settings">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {t('manage', 'إدارة')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm sm:text-base">{t('account', 'الحساب')}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {t('accountDescription', 'إدارة بيانات الحساب وكلمة المرور')}
                      </p>
                    </div>
                    <div className="flex justify-end sm:justify-start">
                      <Link to="/account">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          {t('edit', 'تعديل')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;