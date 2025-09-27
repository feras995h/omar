import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/ui/social-share";
import { TreePine, MapPin, Calendar, Users, Loader2 } from "lucide-react";
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

export function ProjectsSection() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from database
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        const result = await response.json();
        
        if (result.status === 'OK') {
          setProjects(result.data);
        } else {
          throw new Error(result.message || 'فشل في تحميل المشاريع');
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

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
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جاري تحميل المشاريع...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-red-500 mb-4">خطأ في تحميل المشاريع: {error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <TreePine className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {t('projects', 'مشاريعنا')}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 mb-8">
              {t('noProjectsYet', 'لا توجد مشاريع منشورة حالياً')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('checkBackLater', 'يرجى العودة لاحقاً لمشاهدة مشاريعنا الجديدة')}
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t('projects', 'مشاريعنا')}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t('projectsDesc', 'مشاريعنا البيئية التي تهدف إلى بناء مستقبل أخضر مستدام')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {projects.map((project) => {
            const statusText = getStatusText(project.status);
            const priorityText = getPriorityText(project.priority);
            const createdDate = new Date(project.created_at).toLocaleDateString('ar');
            
            return (
              <Card 
                key={project.id}
                className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-elegant group"
              >
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl mb-3 text-primary group-hover:text-primary-light transition-colors leading-tight">
                        {project.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 'outline'} 
                          className="gap-1 text-xs"
                        >
                          <Calendar className="w-3 h-3" />
                          {language === 'ar' ? statusText.ar : statusText.en}
                        </Badge>
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Users className="w-3 h-3" />
                          {language === 'ar' ? priorityText.ar : priorityText.en}
                        </Badge>
                        <Badge variant="outline" className="gap-1 text-xs">
                          <MapPin className="w-3 h-3" />
                          {createdDate}
                        </Badge>
                      </div>
                    </div>
                    <TreePine className="w-6 h-6 sm:w-8 sm:h-8 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0 self-center sm:self-start" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                    {project.description}
                  </p>
                  
                  {project.thumbnail_url && (
                    <div className="mb-4 sm:mb-6">
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                        {project.owner_name || `مستخدم ${project.owner_id}`}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{t('owner', 'المالك')}</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-secondary/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">
                        {project.id}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{t('projectId', 'رقم المشروع')}</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:border-primary group-hover:text-primary transition-colors text-sm sm:text-base mb-3"
                    size="sm"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {t('projectDetails', 'تفاصيل المشروع')}
                  </Button>
                  
                  <SocialShare
                    title={project.title}
                    description={project.description.substring(0, 100) + '...'}
                    hashtags={['مشروع', 'بيئة', 'استدامة']}
                    className="w-full"
                    variant="ghost"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}