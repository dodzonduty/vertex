import { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdated: (newPhotoUrl: string) => void;
}

export function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdated }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/upload-profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      const data = await response.json();
      toast.success('Profile photo updated successfully!');
      onPhotoUpdated(data.profile_photo_url);
      setPreviewUrl(data.profile_photo_url);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload photo');
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-indigo-200">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {!uploading && (
              <button
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-indigo-300" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : previewUrl ? 'Change Photo' : 'Upload Photo'}
      </button>

      <p className="text-xs text-slate-500 mt-2 text-center">
        Max 5MB • JPEG, PNG, WebP
      </p>
    </div>
  );
}
