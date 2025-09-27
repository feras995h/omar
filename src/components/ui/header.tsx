import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useSettings } from "@/contexts/settings-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import logo from "@/assets/logo.svg";

interface HeaderProps {
  // Remove onOpenAdmin prop as we'll handle navigation internally
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { imageSettings } = useSettings();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const menuItems = [
    { label: t('home', 'ط§ظ„ط±ط¦ظٹط³ظٹط©'), href: "/" },
    { label: t('about', 'ظ…ظ† ظ†ط­ظ†'), href: "/about" },
    { label: t('projects', 'ظ…ط´ط§ط±ظٹط¹ظ†ط§'), href: "/projects" },
    { label: t('contact', 'طھظˆط§طµظ„ ظ…ط¹ظ†ط§'), href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src={imageSettings.logo || logo} 
              alt="المحيط الأخضر" 
              className="h-8 sm:h-10 w-auto"
            />
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-hero bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-none">
              {t('heroTitle', 'ط§ظ„ظ…ط­ظٹط· ط§ظ„ط£ط®ط¶ط±')}
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdminClick}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">{t('adminPanel', 'ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…')}</span>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-1.5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-3">
            <nav className="flex flex-col space-y-2">
              {/* Language switcher for mobile */}
              <div className="px-2 py-1 sm:hidden">
                <LanguageSwitcher />
              </div>
              
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-2 rounded-md hover:bg-accent/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleAdminClick();
                  setIsMenuOpen(false);
                }}
                className="justify-start gap-2 text-muted-foreground hover:text-primary px-2 py-2 rounded-md hover:bg-accent/50"
              >
                <Settings className="w-4 h-4" />
                {t('adminPanel', 'ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}