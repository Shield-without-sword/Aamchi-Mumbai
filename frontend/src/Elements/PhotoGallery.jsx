import React, { useState, useCallback, Suspense } from 'react';
import { Upload, Search, Grid, Loader2, Plus, X, CheckCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import { toast, Toaster } from 'sonner';

const ImageCard = ({ src, alt, similarity = null, onRemove = null }) => (
  <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
    <CardContent className="p-0 relative">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {similarity !== null && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm backdrop-blur-sm">
          Match: {(similarity * 100).toFixed(1)}%
        </div>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </CardContent>
  </Card>
);

const UploadPreview = ({ file, onRemove, uploadProgress, uploadStatus }) => (
  <Card className="relative overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
    <CardContent className="p-0">
      <img
        src={URL.createObjectURL(file)}
        alt="Upload preview"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
        {uploadStatus === 'uploading' && (
          <>
            <div className="mb-2">Uploading... {uploadProgress}%</div>
            <div className="w-3/4 h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        )}
        {uploadStatus === 'success' && (
          <CheckCircle className="w-12 h-12 text-green-400" />
        )}
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </CardContent>
  </Card>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-64">
    <Loader2 className="w-8 h-8 animate-spin text-white" />
  </div>
);

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [uploadQueue, setUploadQueue] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories for filtering images
  const categories = [
    'All', 'People', 'Nature', 'Events', 'Architecture', 'Food'
  ];

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchImages();
  }, []);

  const uploadImage = async (file) => {
    const uploadId = Date.now().toString();
    const newUpload = {
      id: uploadId,
      file,
      progress: 0,
      status: 'uploading'
    };
    
    setUploadQueue(prev => [...prev, newUpload]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      setUploadQueue(prev => 
        prev.map(upload => 
          upload.id === uploadId 
            ? { ...upload, status: 'success', progress: 100 }
            : upload
        )
      );

      fetchImages();
      toast.success('Image uploaded successfully');

      setTimeout(() => {
        setUploadQueue(prev => prev.filter(upload => upload.id !== uploadId));
      }, 2000);

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setUploadQueue(prev => prev.filter(upload => upload.id !== uploadId));
    }
  };

  const onGalleryDrop = useCallback(async (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      toast.promise(uploadImage(file), {
        loading: 'Uploading image...',
        success: 'Image uploaded successfully',
        error: 'Failed to upload image'
      });
    });
  }, []);

  const onSearchDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    toast.promise(
      fetch('http://localhost:8000/api/search', {
        method: 'POST',
        body: formData,
      }).then(async (response) => {
        const data = await response.json();
        setSearchResults(data.results);
        setActiveTab('search');
      }).finally(() => setIsLoading(false)),
      {
        loading: 'Searching faces...',
        success: 'Search completed',
        error: 'Face search failed'
      }
    );
  }, []);

  const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
    onDrop: onGalleryDrop,
    accept: {'image/*': []},
  });

  const { getRootProps: getSearchRootProps, getInputProps: getSearchInputProps, isDragActive: isSearchDragActive } = useDropzone({
    onDrop: onSearchDrop,
    accept: {'image/*': []},
    maxFiles: 1
  });

  const handleSearch = (e) => {
    // This would typically call a filtered search API
    console.log('Searching for:', e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-fixed relative">
      {/* Orange top to blue gradient as in the EmployeeManagementApp */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 via-purple-700/80 to-blue-900/90 backdrop-filter backdrop-blur-sm"></div>
      
      {/* Mumbai Skyline Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
        <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,200 L0,150 L50,150 L75,100 L100,150 L125,120 L150,150 L175,130 L200,150 L250,150 L250,200 Z" fill="black" opacity="0.7" />
          {/* Gateway of India */}
          <path d="M400,200 L400,80 C400,70 420,70 420,80 L420,50 L480,50 L480,80 C480,70 500,70 500,80 L500,200 Z" fill="black" opacity="0.7" />
          <path d="M430,50 L470,50 L470,30 C470,10 430,10 430,30 Z" fill="black" opacity="0.7" />
          {/* Marine Drive Buildings */}
          <path d="M600,200 L600,100 L620,100 L620,200 Z M630,200 L630,120 L650,120 L650,200 Z M660,200 L660,90 L680,90 L680,200 Z M690,200 L690,110 L710,110 L710,200 Z M720,200 L720,80 L740,80 L740,200 Z" fill="black" opacity="0.7" />
          {/* Local train */}
          <path d="M800,150 L800,120 L950,120 L950,150 L800,150 Z M810,120 L810,110 L830,110 L830,120 Z M840,120 L840,110 L860,110 L860,120 Z M870,120 L870,110 L890,110 L890,120 Z M900,120 L900,110 L920,110 L920,120 Z" fill="black" opacity="0.6" />
          <path d="M790,150 L800,120 M950,120 L960,150 L790,150 Z" fill="black" opacity="0.6" />
          {/* Bandra-Worli Sea Link */}
          <path d="M1000,200 C1000,120 1100,120 1100,200" stroke="black" strokeWidth="5" fill="none" opacity="0.7" />
          <path d="M1000,160 L1100,160" stroke="black" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M1020,160 L1020,130 M1050,160 L1050,130 M1080,160 L1080,130" stroke="black" strokeWidth="3" fill="none" opacity="0.7" />
        </svg>
      </div>
      
      <Toaster 
        position="top-right"
        expand={true}
        richColors
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Mumbai Themed Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">मुंबई</span>
              <span className="text-white px-2">FotoGallery</span>
            </h1>
            <div className="text-white/80 text-sm">Capturing the Spirit and Soul of Mumbai</div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <button 
              onClick={() => document.getElementById('uploadButton').click()}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border-none flex items-center justify-center"
            >
              <Heart className="mr-2 h-5 w-5" />
              Add New Photo
            </button>
            <input id="uploadButton" type="file" className="hidden" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])} />
            
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                onChange={handleSearch}
                type="text"
                placeholder="Search photos..."
                className="w-full bg-black/30 text-white placeholder-white/60 border border-white/20 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Photo categories */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                    : 'bg-black/30 text-white/80 hover:bg-black/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 gap-4 p-1 bg-black/30 rounded-lg">
              <TabsTrigger 
                value="gallery" 
                className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg"
              >
                <Grid className="w-4 h-4" />
                Gallery
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg"
              >
                <Search className="w-4 h-4" />
                Face Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
            <div {...getGalleryRootProps()} className="cursor-pointer">
                <div className={`
                  flex flex-col items-center justify-center w-full h-32
                  border-2 border-dashed rounded-xl transition-colors duration-200
                  bg-black/30 backdrop-blur-sm
                  ${isGalleryDragActive ? 'border-white border-opacity-80' : 'border-white/30 hover:border-white/50'}
                `}>
                  <Plus className={`w-8 h-8 mb-4 ${isGalleryDragActive ? 'text-white' : 'text-white/70'}`} />
                  <input {...getGalleryInputProps()} />
                  <p className="text-sm text-white text-center">
                    {isGalleryDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                  </p>
                </div>
              </div>

              {uploadQueue.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                  {uploadQueue.map(upload => (
                    <UploadPreview
                      key={upload.id}
                      file={upload.file}
                      uploadProgress={upload.progress}
                      uploadStatus={upload.status}
                      onRemove={() => setUploadQueue(prev => prev.filter(u => u.id !== upload.id))}
                    />
                  ))}
                </div>
              )}

              <div className="bg-black/30 rounded-xl p-6 backdrop-blur-md border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">All Photos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      images.map((image) => (
                        <ImageCard 
                          key={image._id}
                          src={image.cloudinary_url}
                          alt={image.filename}
                        />
                      ))
                    )}
                  </Suspense>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-8">
              <div {...getSearchRootProps()} className="cursor-pointer">
                <div className={`
                  flex flex-col items-center justify-center w-full h-48
                  border-2 border-dashed rounded-xl transition-colors duration-200
                  bg-black/30 backdrop-blur-sm
                  ${isSearchDragActive ? 'border-white border-opacity-80' : 'border-white/30 hover:border-white/50'}
                `}>
                  <Upload className={`w-8 h-8 mb-4 ${isSearchDragActive ? 'text-white' : 'text-white/70'}`} />
                  <input {...getSearchInputProps()} />
                  <p className="text-sm text-white text-center">
                    {isSearchDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
                  </p>
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-6 backdrop-blur-md border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    searchResults.map((result) => (
                      <ImageCard
                        key={result._id}
                        src={result.cloudinary_url}
                        alt="Search result"
                        similarity={result.similarity}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;