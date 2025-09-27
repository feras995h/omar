import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function SocialShare({ 
  title, 
  description = "", 
  url = window.location.href,
  hashtags = [],
  className = "",
  variant = "outline",
  size = "sm"
}: SocialShareProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = description ? `${title} - ${description}` : title;
  const hashtagString = hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(' ') : '';
  const fullText = `${shareText} ${hashtagString}`.trim();

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(fullText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${fullText} ${url}`)}`
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: t('success', 'تم بنجاح'),
        description: t('linkCopied', 'تم نسخ الرابط بنجاح'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('copyError', 'فشل في نسخ الرابط'),
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          {t('share', 'مشاركة')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
          {t('shareOnFacebook', 'مشاركة على فيسبوك')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
          <Twitter className="w-4 h-4 mr-2 text-sky-500" />
          {t('shareOnTwitter', 'مشاركة على تويتر')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('linkedin')} className="cursor-pointer">
          <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
          {t('shareOnLinkedIn', 'مشاركة على لينكد إن')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
          {t('shareOnWhatsApp', 'مشاركة على واتساب')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? t('copied', 'تم النسخ') : t('copyLink', 'نسخ الرابط')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}