import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSettings } from "@/contexts/settings-context";
import heroBackground from "@/assets/hero-forest.jpg";

export function HeroSection() {
  const { t } = useLanguage();
  const { imageSettings } = useSettings();
  const dynamicHeroImage = imageSettings.heroBackground;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-32">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm"></div>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-transparent to-emerald-900/30 animate-pulse"></div>
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-br from-emerald-400/15 to-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-300/25 to-emerald-400/12 rounded-full blur-xl animate-pulse delay-500"></div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-green-400/60 rounded-full animate-bounce delay-300 shadow-lg"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-bounce delay-700 shadow-md"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-green-300/70 rounded-full animate-bounce delay-1000 shadow-sm"></div>
        <div className="absolute bottom-1/4 left-1/5 w-2.5 h-2.5 bg-emerald-300/40 rounded-full animate-bounce delay-200 shadow-lg"></div>
      </div>
      
      {/* Content Grid */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left Column: Dynamic Image */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <div className="w-full max-w-md h-auto aspect-square">
              <div className="relative w-full h-full bg-slate-900/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                {dynamicHeroImage ? (
                  <img
                    src={dynamicHeroImage}
                    alt="Hero Background"
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                ) : (
                  <div className="text-center text-slate-300 flex flex-col items-center justify-center">
                    <ImageIcon className="w-16 h-16 mb-6 opacity-60" />
                    <p className="font-medium text-lg">Hero Background</p>
                  </div>
                )}
                
                {/* Enhanced Decorative circles */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-400/30 to-emerald-500/20 rounded-full animate-pulse blur-sm"></div>
                <div className="absolute -bottom-12 -right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/10 rounded-full animate-pulse delay-500 blur-sm"></div>
                <div className="absolute top-1/2 -right-6 w-12 h-12 bg-gradient-to-br from-green-400/25 to-emerald-500/15 rounded-full animate-pulse delay-1000 blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Text Content */}
          <div className="text-center md:text-right space-y-8 order-1 md:order-2">
            {/* Main Title with Enhanced Typography */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent block drop-shadow-lg filter">
                  {t('heroTitle', 'جمعية المحيط الأخضر')}
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/95 block mt-4 font-bold tracking-wide drop-shadow-xl">
                  {t('heroSubtitle', 'للحلول البيئية المستدامة')}
                </span>
              </h1>
              
              {/* Enhanced Decorative Line */}
              <div className="flex justify-center md:justify-end">
                <div className="w-32 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full shadow-lg animate-pulse"></div>
              </div>
            </div>
            
            {/* Enhanced Main Description */}
            <div className="space-y-6">
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl mx-auto md:mx-0 drop-shadow-lg">
                {t('heroDescription', 'نعمل معاً من أجل بيئة صحية ومستدامة من خلال الحلول المبتكرة والوعي البيئي المتخصص')}
              </p>
              
              {/* Key Features with Enhanced Styling */}
              <div className="space-y-4 max-w-2xl mx-auto md:mx-0">
                <div className="flex items-center justify-center md:justify-end space-x-reverse space-x-4 text-white/85 text-base md:text-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full shadow-lg animate-pulse"></span>
                  <span className="font-semibold drop-shadow-md">حلول بيئية مبتكرة ومستدامة</span>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-reverse space-x-4 text-white/85 text-base md:text-lg">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg animate-pulse delay-300"></span>
                  <span className="font-semibold drop-shadow-md">فريق متخصص في البيئة والاستدامة</span>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-reverse space-x-4 text-white/85 text-base md:text-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full shadow-lg animate-pulse delay-700"></span>
                  <span className="font-semibold drop-shadow-md">شراكات استراتيجية لتحقيق الأهداف</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-end items-center pt-4">
              <button 
                onClick={() => {
                  // التوجه إلى صفحة "من نحن"
                  const aboutSection = document.getElementById('about-section');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // التوجه إلى صفحة من نحن (يمكن تعديل الرابط حسب الحاجة)
                    window.location.href = '/about';
                  }
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm cursor-pointer"
              >
                <span className="relative z-10 flex items-center space-x-reverse space-x-3">
                  <Leaf className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="drop-shadow-sm">اعرف المزيد</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              <button 
                onClick={() => {
                  // التوجه إلى صفحة "تواصل معنا"
                  const contactSection = document.getElementById('contact-section');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // التوجه إلى صفحة تواصل معنا (يمكن تعديل الرابط حسب الحاجة)
                    window.location.href = '/contact';
                  }
                }}
                className="group relative overflow-hidden bg-slate-800/60 hover:bg-slate-700/70 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30 backdrop-blur-lg cursor-pointer"
              >
                <span className="relative z-10 flex items-center space-x-reverse space-x-3">
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="drop-shadow-sm">انضم إلينا</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-4 h-4 bg-green-400/40 rounded-full animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] right-[10%] w-6 h-6 bg-green-400/30 rounded-full animate-blob"></div>
      <div className="absolute bottom-[15%] left-[20%] w-5 h-5 bg-green-400/50 rounded-full animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[10%] right-[5%] w-3 h-3 bg-green-400/20 rounded-full animate-blob animation-delay-1000"></div>
    </section>
  );
}