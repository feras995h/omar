import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { X, Save, Plus, Trash, Eye, Settings, FileText, Palette, Users, Upload, Image, FolderOpen, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
  url: string;
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  status: string;
  priority: string;
  owner_id: number;
  owner_name?: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Load uploaded files
  const loadUploadedFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const response = await fetch('/api/files');
      const result = await response.json();
      
      if (result.status === 'OK') {
        setUploadedFiles(result.data);
      } else {
        throw new Error(result.message || 'فشل في تحميل الملفات');
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "خطأ في تحميل الملفات",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Delete file
  const deleteFile = async (fileId: number) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status === 'OK') {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
        toast({
          title: "تم حذف الملف بنجاح",
          description: "تم حذف الملف من الخادم",
        });
      } else {
        throw new Error(result.message || 'فشل في حذف الملف');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "خطأ في حذف الملف",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  // Load projects
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.status === 'OK') {
        setProjects(result.data);
      } else {
        throw new Error(result.message || 'فشل في تحميل المشاريع');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "خطأ في تحميل المشاريع",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status === 'OK') {
        setProjects(prev => prev.filter(project => project.id !== projectId));
        toast({
          title: "تم حذف المشروع بنجاح",
          description: "تم حذف المشروع من قاعدة البيانات",
        });
      } else {
        throw new Error(result.message || 'فشل في حذف المشروع');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "خطأ في حذف المشروع",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  // Load files and projects when component mounts
  useEffect(() => {
    if (isOpen) {
      loadUploadedFiles();
      loadProjects();
    }
  }, [isOpen]);

  const handleSave = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto h-full flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            لوحة تحكم المحيط الأخضر
          </h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                إدارة المحتوى
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                المشاريع
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                الملفات
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                التصميم
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                المستخدمين
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            {/* Files Management */}
            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    إدارة الملفات المرفوعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        إجمالي الملفات: {uploadedFiles.length}
                      </p>
                      <Button onClick={loadUploadedFiles} disabled={isLoadingFiles}>
                        {isLoadingFiles ? "جاري التحديث..." : "تحديث"}
                      </Button>
                    </div>
                    
                    {isLoadingFiles ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">جاري تحميل الملفات...</p>
                      </div>
                    ) : uploadedFiles.length === 0 ? (
                      <div className="text-center py-8">
                        <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">لا توجد ملفات مرفوعة</p>
                        <p className="text-sm text-gray-500">استخدم صفحة الإعدادات لرفع الملفات</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="border rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Image className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium truncate">
                                  {file.originalName}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>النوع: {file.fileType}</p>
                              <p>الحجم: {(file.fileSize / 1024).toFixed(1)} KB</p>
                              <p>التاريخ: {new Date(file.createdAt).toLocaleDateString('ar')}</p>
                            </div>
                            
                            {file.fileType === 'image' && (
                              <div className="mt-2">
                                <img
                                  src={file.url}
                                  alt={file.originalName}
                                  className="w-full h-20 object-cover rounded border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(file.url, '_blank')}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(file.url)}
                                className="flex-1"
                              >
                                نسخ الرابط
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Management */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    إدارة المشاريع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        إجمالي المشاريع: {projects.length}
                      </p>
                      <Button onClick={loadProjects} disabled={isLoadingProjects}>
                        {isLoadingProjects ? "جاري التحديث..." : "تحديث"}
                      </Button>
                    </div>
                    
                    {isLoadingProjects ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">جاري تحميل المشاريع...</p>
                      </div>
                    ) : projects.length === 0 ? (
                      <div className="text-center py-8">
                        <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">لا توجد مشاريع</p>
                        <p className="text-sm text-gray-500">استخدم صفحة المشاريع لإنشاء مشاريع جديدة</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                          <div key={project.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-sm mb-2 line-clamp-2">
                                  {project.title}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {project.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteProject(project.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Badge 
                                variant={project.status === 'completed' ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {project.status === 'completed' ? 'مكتمل' : 
                                 project.status === 'in_progress' ? 'قيد التنفيذ' : 
                                 project.status === 'draft' ? 'مسودة' : project.status}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(project.created_at).toLocaleDateString('ar')}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/projects`, '_blank')}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(`/projects`)}
                                className="flex-1"
                              >
                                نسخ الرابط
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Management */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      تحرير النص الرئيسي
                      <Button size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        حفظ
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="main-title">العنوان الرئيسي</Label>
                      <Input 
                        id="main-title" 
                        defaultValue="جمعية المحيط الأخضر للحلول البيئية"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle">العنوان الفرعي</Label>
                      <Input 
                        id="subtitle" 
                        defaultValue="معاً نحو مستقبل أخضر ومستدام للأجيال القادمة"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea 
                        id="description" 
                        rows={4}
                        defaultValue="نؤمن بأن البيئة ليست مجرد محيط نعيش فيه، بل هي مسؤولية مشتركة من جميعنا."
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      إدارة الأقسام
                      <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة قسم
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['ثقافتنا البيئية', 'رؤيتنا', 'رسالتنا', 'مكافحة التصحر'].map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="font-medium">{section}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Design Customization */}
            <TabsContent value="design" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>الألوان والتصميم</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="primary-color">اللون الأساسي</Label>
                      <div className="flex gap-2 mt-1">
                        <Input type="color" defaultValue="#22c55e" className="w-16 h-10" />
                        <Input defaultValue="#22c55e" className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary-color">اللون الثانوي</Label>
                      <div className="flex gap-2 mt-1">
                        <Input type="color" defaultValue="#16a34a" className="w-16 h-10" />
                        <Input defaultValue="#16a34a" className="flex-1" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>الوضع المظلم</Label>
                      <Switch defaultChecked />
                    </div>
                    <Button onClick={handleSave} className="w-full gap-2">
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات الخط</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="font-family">نوع الخط</Label>
                      <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                        <option>Cairo</option>
                        <option>Tajawal</option>
                        <option>Amiri</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="font-size">حجم الخط الأساسي</Label>
                      <Input type="range" min="14" max="18" defaultValue="16" className="mt-1" />
                    </div>
                    <Button onClick={handleSave} className="w-full gap-2">
                      <Save className="w-4 h-4" />
                      تطبيق التغييرات
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    إدارة المستخدمين
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة مستخدم
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">مدير النظام</h4>
                        <p className="text-sm text-muted-foreground">admin@greenocean.ly</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">تعديل</Button>
                        <Button size="sm" variant="ghost" className="text-destructive">حذف</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات عامة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="site-name">اسم الموقع</Label>
                      <Input 
                        id="site-name" 
                        defaultValue="جمعية المحيط الأخضر"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">البريد الإلكتروني</Label>
                      <Input 
                        id="contact-email" 
                        defaultValue="info@greenocean.ly"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input 
                        id="phone" 
                        defaultValue="+218 21 123456"
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full gap-2">
                      <Save className="w-4 h-4" />
                      حفظ الإعدادات
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات الأمان</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>المصادقة الثنائية</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>تسجيل العمليات</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>النسخ الاحتياطي التلقائي</Label>
                      <Switch defaultChecked />
                    </div>
                    <Button onClick={handleSave} className="w-full gap-2">
                      <Save className="w-4 h-4" />
                      تحديث الأمان
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}