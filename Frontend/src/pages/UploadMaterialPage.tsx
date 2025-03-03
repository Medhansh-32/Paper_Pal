import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, CheckCircle } from 'lucide-react';

// Define course types to ensure type safety
type CourseType = 
  | 'Bachelor of Technology'
  | 'Bachelor of Laws or Bachelor of Legislative Laws'
  | 'Bachelor of Business Administration'
  | 'Bachelor of Arts'
  | 'Bachelor of Science';

const UploadMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course: '' as CourseType | '',
    branch: '',
    semester: '',
    fileType: 'notes',
    title: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Define the dependency data for dropdowns with explicit types
  const branchesByCourse: Record<CourseType, string[]> = {
    'Bachelor of Technology': ['Computer Science Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    'Bachelor of Laws or Bachelor of Legislative Laws': ['Nill'],
    'Bachelor of Business Administration': ['Nill'],
    'Bachelor of Arts': ['Economic(Hons.)', 'English(Hons.)', 'Political Science(Hons.)', 'Psychology(Hons.)'],
    'Bachelor of Science': ['Mathematics(Hons.)', 'Physics(Hons.)', 'Food Technology(Hons.)', 'Agricultural Science(Hons.)', 'Hospitality and Hotel Administration', 'Hotel Management and Catering Technology']
  };

  const semestersByCourse: Record<CourseType, number[]> = {
    'Bachelor of Technology': [1, 2, 3, 4, 5, 6, 7, 8],
    'Bachelor of Laws or Bachelor of Legislative Laws': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'Bachelor of Business Administration': [1, 2, 3, 4, 5, 6],
    'Bachelor of Arts': [1, 2, 3, 4, 5, 6],
    'Bachelor of Science': [1, 2, 3, 4, 5, 6]
  };

  // Update available branches and semesters when course changes
  useEffect(() => {
    if (formData.course) {
      // Type assertion to tell TypeScript that formData.course is a valid key
      const course = formData.course as CourseType;
      setAvailableBranches(branchesByCourse[course] || []);
      setAvailableSemesters(semestersByCourse[course] || []);
      
      // Reset branch and semester values when course changes
      setFormData(prev => ({
        ...prev,
        branch: '',
        semester: ''
      }));
    } else {
      setAvailableBranches([]);
      setAvailableSemesters([]);
    }
  }, [formData.course]);

  // Set up event listeners for drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
        // Also update the file input for form consistency
        if (fileInputRef.current) {
          // Create a DataTransfer object to assign files to the file input
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(e.dataTransfer.files[0]);
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    };

    // Add event listeners to the drop area
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      dropArea.addEventListener('dragover', handleDragOver);
      dropArea.addEventListener('dragleave', handleDragLeave);
      dropArea.addEventListener('drop', handleDrop);
    }

    // Clean up event listeners when component unmounts
    return () => {
      if (dropArea) {
        dropArea.removeEventListener('dragover', handleDragOver);
        dropArea.removeEventListener('dragleave', handleDragLeave);
        dropArea.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
  
    setIsUploading(true);
  
    try {
      // Create a FormData object
      const formDataToSend = new FormData();
      
      // Append all the necessary data to the FormData object
      formDataToSend.append('course', formData.course);
      formDataToSend.append('branch', formData.branch);
      formDataToSend.append('semester', formData.semester.charAt(formData.semester.length - 1));
      formDataToSend.append('fileType', formData.fileType);
      formDataToSend.append('file', file);  // This is the actual file
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
  
      // Send the form data using fetch
      const response = await fetch('http://localhost:8080/userresponse', {
        method: "POST",
        body: formDataToSend,
        credentials:'include' // Send the formData as the body
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Upload failed');
      }
      
      // Show success message instead of redirecting immediately
      setUploadSuccess(true);
      
      // Optional: Reset form after successful upload
      setFormData({
        course: '',
        branch: '',
        semester: '',
        fileType: 'notes',
        title: '',
        description: ''
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading material. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Success message component
  const SuccessMessage = () => (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Successful</h2>
          <p className="text-gray-600 mb-6">
            Your document has been successfully received. Our system is now analyzing the content for quality assurance. 
            Once the review process is complete, your material will be published to the platform.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => {
                setUploadSuccess(false);
                // Reset form state here if needed
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-3xl mx-auto">
      {uploadSuccess && <SuccessMessage />}
      
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Upload Study Material</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                id="course"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Course</option>
                {Object.keys(branchesByCourse).map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                required
                value={formData.branch}
                onChange={handleChange}
                disabled={!formData.course}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Branch</option>
                {availableBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                required
                value={formData.semester}
                onChange={handleChange}
                disabled={!formData.course}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Semester</option>
                {availableSemesters.map((semester) => (
                  <option key={semester} value={semester.toString()}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1">
                File Type
              </label>
              <select
                id="fileType"
                name="fileType"
                required
                value={formData.fileType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="notes">Notes</option>
                <option value="pyq">Previous Year Questions</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Data Structures and Algorithms Notes"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe the material..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <div 
              ref={dropAreaRef}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} border-dashed rounded-lg transition-colors`}
            >
              <div className="space-y-1 text-center">
                <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, PPT, PPTX up to 10MB
                </p>
                {file && (
                  <p className="text-sm text-indigo-600 font-medium">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mr-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Material
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterialPage;