import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  placeholder?: string;
  description?: string;
}

export const ImageUpload = ({ 
  label, 
  value, 
  onChange, 
  accept = "image/*", 
  placeholder,
  description 
}: ImageUploadProps) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file) {
      // Create a URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      onChange(fileUrl);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  const clearImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm">
        <Image className="w-4 h-4" />
        {label}
      </Label>
      
      {/* URL Input */}
      <div className="space-y-2">
        <Input
          type="text"
          placeholder={placeholder || t('imageUrlPlaceholder', 'أدخل رابط الصورة أو ارفع ملف')}
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="text-sm"
        />
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <div className="text-sm text-gray-600">
            <p>{t('dragDropImage', 'اسحب وأفلت الصورة هنا')}</p>
            <p className="text-xs text-gray-500">
              {t('orClickToUpload', 'أو انقر لاختيار ملف')}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('selectFile', 'اختر ملف')}
          </Button>
        </div>
      </div>

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <div className="border rounded-lg p-2 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {value.startsWith('blob:') ? t('uploadedFile', 'ملف مرفوع') : value}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearImage}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};