import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onUpload: (imageBase64: string) => void;
  loading: boolean;
}

function ImageUpload({ onUpload, loading }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
        transition-all duration-200 min-h-[300px] flex flex-col items-center justify-center
        ${isDragActive 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {loading ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Analyzing image with AI...</p>
        </div>
      ) : (
        <>
          <div className="text-6xl mb-4">📤</div>
          <p className="text-xl font-semibold text-white mb-2">
            {isDragActive ? 'Drop your screenshot here' : 'Upload a movie screenshot'}
          </p>
          <p className="text-gray-400 mb-4">
            Drag & drop a poster, streaming UI, or any movie image
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Select Image
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Supports: PNG, JPG, WEBP
          </p>
        </>
      )}
    </div>
  );
}

export default ImageUpload;
