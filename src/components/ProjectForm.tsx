import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Save, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface ProjectData {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  coverImage: File | null;
  gallery: File[];
  status: 'draft' | 'published' | 'completed' | 'in-progress';
}

const ProjectForm = () => {
  const { t, isRTL } = useLanguage();
  const [projectData, setProjectData] = useState<ProjectData>({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    coverImage: null,
    gallery: [],
    status: 'draft'
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoverImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setProjectData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleGalleryUpload = (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    setProjectData(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...imageFiles].slice(0, 10) // Limit to 10 images
    }));
  };

  const removeGalleryImage = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleGalleryUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published' | 'completed' | 'in-progress') => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Project data:', { ...projectData, status });
    
    // Reset form after successful submission
    setProjectData({
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      coverImage: null,
      gallery: [],
      status: 'draft'
    });
    
    setIsSubmitting(false);
  };

  const isFormValid = projectData.titleAr && projectData.titleEn && 
                     projectData.descriptionAr && projectData.descriptionEn;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">{t('content', 'المحتوى')}</TabsTrigger>
          <TabsTrigger value="images">{t('images', 'الصور')}</TabsTrigger>
          <TabsTrigger value="preview">{t('preview', 'معاينة')}</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('projectContent', 'محتوى المشروع')}</CardTitle>
              <CardDescription>
                {t('contentDescription', 'أدخل تفاصيل المشروع باللغتين العربية والإنجليزية')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">العربية</Badge>
                  <h3 className="text-lg font-medium">{t('arabicContent', 'المحتوى العربي')}</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titleAr">{t('projectTitle', 'عنوان المشروع')}</Label>
                  <Input
                    id="titleAr"
                    value={projectData.titleAr}
                    onChange={(e) => handleInputChange('titleAr', e.target.value)}
                    placeholder={t('titlePlaceholderAr', 'أدخل عنوان المشروع بالعربية')}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">{t('projectDescription', 'وصف المشروع')}</Label>
                  <Textarea
                    id="descriptionAr"
                    value={projectData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    placeholder={t('descriptionPlaceholderAr', 'أدخل وصف مفصل للمشروع بالعربية')}
                    className="min-h-[120px] text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* English Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">English</Badge>
                  <h3 className="text-lg font-medium">{t('englishContent', 'English Content')}</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titleEn">{t('projectTitleEn', 'Project Title')}</Label>
                  <Input
                    id="titleEn"
                    value={projectData.titleEn}
                    onChange={(e) => handleInputChange('titleEn', e.target.value)}
                    placeholder={t('titlePlaceholderEn', 'Enter project title in English')}
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">{t('projectDescriptionEn', 'Project Description')}</Label>
                  <Textarea
                    id="descriptionEn"
                    value={projectData.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    placeholder={t('descriptionPlaceholderEn', 'Enter detailed project description in English')}
                    className="min-h-[120px]"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>{t('coverImage', 'صورة الغلاف')}</CardTitle>
              <CardDescription>
                {t('coverImageDescription', 'اختر صورة رئيسية للمشروع')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.coverImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(projectData.coverImage)}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setProjectData(prev => ({ ...prev, coverImage: null }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      {t('uploadCoverImage', 'اسحب وأفلت صورة الغلاف هنا أو انقر للاختيار')}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleCoverImageUpload(e.target.files[0])}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        {t('selectImage', 'اختر صورة')}
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>{t('imageGallery', 'معرض الصور')}</CardTitle>
              <CardDescription>
                {t('galleryDescription', 'أضف صور إضافية للمشروع (حد أقصى 10 صور)')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {t('uploadGalleryImages', 'اسحب وأفلت الصور هنا أو انقر للاختيار')}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
                  className="hidden"
                  id="gallery-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    {t('selectImages', 'اختر صور')}
                  </label>
                </Button>
              </div>

              {projectData.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {projectData.gallery.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('projectPreview', 'معاينة المشروع')}</CardTitle>
              <CardDescription>
                {t('previewDescription', 'معاينة كيف سيظهر المشروع للزوار')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectData.coverImage && (
                  <img
                    src={URL.createObjectURL(projectData.coverImage)}
                    alt="Project Cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {isRTL ? projectData.titleAr : projectData.titleEn}
                    </h3>
                    <p className="text-muted-foreground">
                      {isRTL ? projectData.descriptionAr : projectData.descriptionEn}
                    </p>
                  </div>
                  
                  {projectData.gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {projectData.gallery.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => handleSubmit('draft')}
          disabled={!isFormValid || isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {t('saveDraft', 'حفظ كمسودة')}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSubmit('in-progress')}
          disabled={!isFormValid || isSubmitting}
          className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('markInProgress', 'قيد التنفيذ')}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSubmit('completed')}
          disabled={!isFormValid || isSubmitting}
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('markCompleted', 'مكتمل')}
        </Button>
        <Button
          onClick={() => handleSubmit('published')}
          disabled={!isFormValid || isSubmitting}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isSubmitting ? t('publishing', 'جاري النشر...') : t('publish', 'نشر المشروع')}
        </Button>
      </div>
    </div>
  );
};

export default ProjectForm;