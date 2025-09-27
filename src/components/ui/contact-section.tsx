import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSettings } from "@/contexts/settings-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { socialLinks, basicData } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('messageSent', 'تم إرسال الرسالة'),
      description: t('messageResponse', 'سنتواصل معك قريباً'),
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      titleAr: "البريد الإلكتروني",
      titleEn: "Email",
      valueAr: basicData.email,
      valueEn: basicData.email
    },
    {
      icon: Phone,
      titleAr: "الهاتف",
      titleEn: "Phone",
      valueAr: basicData.phone,
      valueEn: basicData.phone
    },
    {
      icon: MapPin,
      titleAr: "العنوان",
      titleEn: "Address",
      valueAr: basicData.address,
      valueEn: basicData.address
    }
  ];

  const socialLinksData = [
    { icon: Facebook, name: "Facebook", url: socialLinks.facebook || "#" },
    { icon: Instagram, name: "Instagram", url: socialLinks.instagram || "#" },
    { icon: Twitter, name: "Twitter", url: socialLinks.twitter || "#" },
    { icon: Linkedin, name: "LinkedIn", url: socialLinks.linkedin || "#" },
    { icon: Youtube, name: "YouTube", url: socialLinks.youtube || "#" }
  ].filter(social => social.url !== "#"); // Only show social links that have URLs

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t('contact', 'تواصل معنا')}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t('contactDesc', 'نحن هنا للإجابة على استفساراتكم ومساعدتكم في رحلتكم البيئية')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-primary text-lg sm:text-xl">
                {t('sendMessage', 'أرسل رسالة')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">
                      {t('name', 'الاسم')}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('namePlaceholder', 'اسمك الكامل')}
                      required
                      className="bg-input/50 border-border/50 focus:border-primary text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      {t('email', 'البريد الإلكتروني')}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('emailPlaceholder', 'your.email@example.com')}
                      required
                      className="bg-input/50 border-border/50 focus:border-primary text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm">
                    {t('subject', 'الموضوع')}
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('subjectPlaceholder', 'موضوع رسالتك')}
                    required
                    className="bg-input/50 border-border/50 focus:border-primary text-sm sm:text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm">
                    {t('message', 'الرسالة')}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('messagePlaceholder', 'اكتب رسالتك هنا...')}
                    required
                    rows={5}
                    className="bg-input/50 border-border/50 focus:border-primary resize-none text-sm sm:text-base"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-hero hover:opacity-90 transition-opacity text-sm sm:text-base"
                  size="default"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {t('sendMessage', 'إرسال الرسالة')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-primary text-lg sm:text-xl">
                  {t('contactInfo', 'معلومات التواصل')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground text-sm sm:text-base">
                        {language === 'ar' ? info.titleAr : info.titleEn}
                      </h4>
                      <p className="text-muted-foreground text-xs sm:text-sm break-words">
                        {language === 'ar' ? info.valueAr : info.valueEn}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-primary text-lg sm:text-xl">
                  {t('followUs', 'تابعنا')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {socialLinksData.map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 sm:w-12 sm:h-12 hover:border-primary hover:text-primary transition-colors"
                      asChild
                    >
                      <a href={social.url} aria-label={social.name} target="_blank" rel="noopener noreferrer">
                        <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}