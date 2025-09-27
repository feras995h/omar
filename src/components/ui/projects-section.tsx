import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/ui/social-share";
import { TreePine, MapPin, Calendar, Users } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const projects = [
  {
    id: 1,
    titleAr: "المحيط الأخضر وليبانا شراكة من أجل الغطاء النباتي",
    titleEn: "Green Ocean and Libyana A Partnership for Vegetation Cover",
    descriptionAr: "وبالشراكة الفاعلة مع شركة ليبانا للهاتف المحمول قامت جمعية المحيط الأخضر للحلول البيئية بتنفيذ حملة تشجير تهدف إلى الإسهام في حماية البيئة ودعم الاستدامة البيئية في عدة مناطق، وقد حققت هذه العملية ثمرة تعاون بناء بين الطرفين حيث تم العمل بشكل منظم ومتكامل على تنفيذ أنشطة ميدانية تضمنت غرس عدد كبير من الأشجار في مواقع مختارة بعناية مع مراعاة الجوانب البيئية والتخطيط الحضري للمناطق المستهدفة",
    descriptionEn: "supporting environmental sustainability in several regions. This campaign represents the fruit of constructive cooperation between both parties, where organized and integrated work was carried out to implement field activities that included planting a large number of trees in carefully selected locations, taking into consideration environmental aspects and urban planning for the targeted areas",
    location: "ليبيا",
    locationEn: "Libya",
    status: "مكتمل",
    statusEn: "Completed",
    year: "2024",
    participants: 150,
    treesPlanted: 500
  }
];

export function ProjectsSection() {
  const { language, t } = useLanguage();
  
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
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-elegant group"
            >
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl mb-3 text-primary group-hover:text-primary-light transition-colors leading-tight">
                      {language === 'ar' ? project.titleAr : project.titleEn}
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        {language === 'ar' ? project.location : project.locationEn}
                      </Badge>
                      <Badge 
                        variant={project.status === 'مكتمل' ? 'default' : 'outline'} 
                        className="gap-1 text-xs"
                      >
                        <Calendar className="w-3 h-3" />
                        {language === 'ar' ? project.status : project.statusEn}
                      </Badge>
                    </div>
                  </div>
                  <TreePine className="w-6 h-6 sm:w-8 sm:h-8 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0 self-center sm:self-start" />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  {language === 'ar' ? project.descriptionAr : project.descriptionEn}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{project.year}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{t('year', 'السنة')}</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-secondary/10 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">{project.participants}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{t('participants', 'المشاركون')}</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-accent/10 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-accent mb-1">{project.treesPlanted}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{t('treesPlanted', 'شجرة مزروعة')}</div>
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
                  title={language === 'ar' ? project.titleAr : project.titleEn}
                  description={language === 'ar' ? project.descriptionAr.substring(0, 100) + '...' : project.descriptionEn.substring(0, 100) + '...'}
                  hashtags={['البيئة', 'التشجير', 'الاستدامة', 'ليبيا']}
                  className="w-full"
                  variant="ghost"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}