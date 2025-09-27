import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Target, MessageSquare, TreePine, Globe, Users, Recycle, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const getSections = (t: (key: string, fallback: string) => string) => [
  {
    icon: Calendar,
    titleAr: "تاريخ التأسيس",
    titleEn: "Establishment Date",
    contentAr: "تأسست جمعية المحيط الأخضر للحلول البيئية في 12 نوفمبر 2024، لتكون منارة للعمل البيئي والتنمية المستدامة في المنطقة.",
    contentEn: "Green Ocean Environmental Solutions Association was established on November 12, 2024, to be a beacon for environmental work and sustainable development in the region."
  },
  {
    icon: TreePine,
    titleAr: "ثقافتنا البيئية",
    titleEn: "Our Environmental Culture",
    contentAr: "نؤمن بأن البيئة ليست مجرد محيط نعيش فيه، بل هي مسؤولية مشتركة من جميعنا. من خلال الممارسة اليومية، يتوسع الوعي ويترسخ قناعة راسخة بأن التغيير يبدأ من ثقافتنا البيئية.",
    contentEn: "We believe that the environment is not just a surrounding we live in, but a shared responsibility from all of us. Through daily practice, awareness expands and a firm conviction is established that change begins with our environmental culture."
  },
  {
    icon: Target,
    titleAr: "رؤيتنا",
    titleEn: "Our Vision",
    contentAr: "بيئة صحية ومستدامة يقودها وعي مجتمعي ومسؤول.",
    contentEn: "A healthy and sustainable environment led by responsible community awareness."
  },
  {
    icon: MessageSquare,
    titleAr: "رسالتنا",
    titleEn: "Our Mission",
    contentAr: "تعزيز الحلول البيئية المبتكرة ونشر الوعي البيئي من خلال مشاريع تعليمية مستدامة وتبني أنماط مشاركة مجتمعية وتشجيعها ميدانياً.",
    contentEn: "Promoting innovative environmental solutions and spreading environmental awareness through sustainable educational projects and adopting and encouraging community participation patterns in the field."
  },
  {
    icon: Leaf,
    titleAr: "مكافحة التصحر",
    titleEn: "Combating Desertification",
    contentAr: "يعد التصحر من أخطر التحديات البيئية التي تواجه العالم اليوم، خاصة في المناطق الجافة. قدرة الأرض على الإنتاج تتناقص تدريجياً بسبب الأنشطة البشرية.",
    contentEn: "Desertification is one of the most dangerous environmental challenges facing the world today, especially in arid regions. The earth's production capacity is gradually declining due to human activities."
  },
  {
    icon: Globe,
    titleAr: "الاستدامة البيئية",
    titleEn: "Environmental Sustainability",
    contentAr: "نعمل على تطوير برامج شاملة لضمان الاستدامة البيئية من خلال استخدام الموارد الطبيعية بشكل مسؤول وتطوير تقنيات صديقة للبيئة.",
    contentEn: "We work on developing comprehensive programs to ensure environmental sustainability through responsible use of natural resources and developing eco-friendly technologies."
  },
  {
    icon: Users,
    titleAr: "المشاركة المجتمعية",
    titleEn: "Community Participation",
    contentAr: "نؤمن بقوة المجتمع في إحداث التغيير الإيجابي، لذلك نعمل على إشراك جميع فئات المجتمع في برامجنا البيئية والتوعوية.",
    contentEn: "We believe in the power of community to create positive change, so we work to involve all segments of society in our environmental and awareness programs."
  }
];

export function AboutSection() {
  const { language, t } = useLanguage();
  const sections = getSections(t);
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t('aboutTitle', 'من نحن')}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t('aboutDescription', 'جمعية المحيط الأخضر للحلول البيئية - رائدة في مجال الحلول المستدامة والوعي البيئي')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {sections.map((section, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-elegant group"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-primary group-hover:text-primary-light transition-colors text-sm sm:text-base">
                  <section.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="leading-tight">
                    {language === 'ar' ? section.titleAr : section.titleEn}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {language === 'ar' ? section.contentAr : section.contentEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}