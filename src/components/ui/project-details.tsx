import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/ui/social-share";
import { TreePine, MapPin, Calendar, Users, ArrowLeft, Image as ImageIcon, FileText, Clock, User } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

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

interface ProjectDetailsProps {
  projectId: number;
  onClose: () => void;
}

export function ProjectDetails({ projectId, onClose }: ProjectDetailsProps) {
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // Load project details
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        const result = await response.json();
        
        if (result.status === 'OK') {
          setProject(result.data);
          // Load project images
          loadProjectImages(result.data.id);
        } else {
          throw new Error(result.message || 'فشل في تحميل تفاصيل المشروع');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Load project images
  const loadProjectImages = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/images`);
      const result = await response.json();
      
      if (result.status === 'OK') {
        setImages(result.data.map((img: any) => img.url));
      }
    } catch (error) {
      console.error('Error loading project images:', error);
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { ar: string; en: string } } = {
      'draft': { ar: 'مسودة', en: 'Draft' },
      'in_progress': { ar: 'قيد التنفيذ', en: 'In Progress' },
      'completed': { ar: 'مكتمل', en: 'Completed' },
      'archived': { ar: 'مؤرشف', en: 'Archived' }
    };
    
    return statusMap[status] || { ar: status, en: status };
  };

  // Get priority display text
  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: { ar: string; en: string } } = {
      'low': { ar: 'منخفض', en: 'Low' },
      'medium': { ar: 'متوسط', en: 'Medium' },
      'high': { ar: 'عالي', en: 'High' },
      'urgent': { ar: 'عاجل', en: 'Urgent' }
    };
    
    return priorityMap[priority] || { ar: priority, en: priority };
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل تفاصيل المشروع...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || 'المشروع غير موجود'}</p>
              <Button onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusText = getStatusText(project.status);
  const priorityText = getPriorityText(project.priority);
  const createdDate = new Date(project.created_at).toLocaleDateString('ar');
  const updatedDate = new Date(project.updated_at).toLocaleDateString('ar');

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للمشاريع
            </Button>
            <div className="flex items-center gap-2">
              <TreePine className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">تفاصيل المشروع</span>
            </div>
          </div>

          {/* Project Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl sm:text-3xl mb-4 text-primary">
                    {project.title}
                  </CardTitle>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge 
                      variant={project.status === 'completed' ? 'default' : 'outline'} 
                      className="gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      {language === 'ar' ? statusText.ar : statusText.en}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="w-3 h-3" />
                      {language === 'ar' ? priorityText.ar : priorityText.en}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {createdDate}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    وصف المشروع
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Project Images */}
                {images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      صور المشروع
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`صورة المشروع ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => window.open(imageUrl, '_blank')}
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              عرض
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">المالك:</span>
                      <span className="text-sm">{project.owner_name || `مستخدم ${project.owner_id}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">تاريخ الإنشاء:</span>
                      <span className="text-sm">{createdDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">آخر تحديث:</span>
                      <span className="text-sm">{updatedDate}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">رقم المشروع:</span>
                      <span className="text-sm font-mono">#{project.id}</span>
                    </div>
                    {project.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">الموعد النهائي:</span>
                        <span className="text-sm">{new Date(project.deadline).toLocaleDateString('ar')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Share */}
                <div className="pt-4 border-t">
                  <SocialShare
                    title={project.title}
                    description={project.description.substring(0, 100) + '...'}
                    hashtags={['مشروع', 'بيئة', 'استدامة']}
                    className="w-full"
                    variant="outline"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
