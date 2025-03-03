import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, FileText, FileQuestion } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  course: string;
  branch: string;
  semester: string;
  fileType: 'notes' | 'pyq';
  uploadedBy: string;
  uploadDate: string;
  downloadUrl: string;
}

// Define types for course-related data structures
type CourseOption = 
  | 'Bachelor of Technology' 
  | 'Bachelor of Laws or Bachelor of Legislative Laws'
  | 'Bachelor of Business Administration'
  | 'Bachelor of Arts'
  | 'Bachelor of Science';

type BranchesByCourse = {
  [key in CourseOption]: string[];
};

type SemestersByCourse = {
  [key in CourseOption]: number[];
};

const DownloadMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    course: '',
    branch: '',
    semester: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'notes' | 'pyq'>('notes');
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data for dynamic dropdowns
  const courseOptions: CourseOption[] = [
    'Bachelor of Technology',
    'Bachelor of Laws or Bachelor of Legislative Laws',
    'Bachelor of Business Administration',
    'Bachelor of Arts',
    'Bachelor of Science'
  ];
  
  const branchesByCourse: BranchesByCourse = {
    'Bachelor of Technology': ['Computer Science Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    'Bachelor of Laws or Bachelor of Legislative Laws': ['Nill'],
    'Bachelor of Business Administration': ['Nill'],
    'Bachelor of Arts': ['Economic(Hons.)', 'English(Hons.)', 'Political Science(Hons.)', 'Psychology(Hons.)'],
    'Bachelor of Science': ['Mathematics(Hons.)', 'Physics(Hons.)', 'Food Technology(Hons.)', 'Agricultural Science(Hons.)', 'Hospitality and Hotel Administration', 'Hotel Management and Catering Technology']
  };
  
  const semestersByCourse: SemestersByCourse = {
    'Bachelor of Technology': [1, 2, 3, 4, 5, 6, 7, 8],
    'Bachelor of Laws or Bachelor of Legislative Laws': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'Bachelor of Business Administration': [1, 2, 3, 4, 5, 6],
    'Bachelor of Arts': [1, 2, 3, 4, 5, 6],
    'Bachelor of Science': [1, 2, 3, 4, 5, 6]
  };

  // Reset branch and semester when course changes
  useEffect(() => {
    if (filters.course) {
      setFilters(prev => ({ ...prev, branch: '', semester: '' }));
    }
  }, [filters.course]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Function to fetch all materials (both notes and PYQs) based on filters
  const fetchMaterials = async () => {
    setIsLoading(true);
    
    try {
      // Note: We're not filtering by fileType in the API call
      const apiUrl = `http://localhost:8080/userresponse/getlinks?course=${filters.course}&branch=${filters.branch}&semester=${filters.semester.charAt(filters.semester.length - 1)}`;
      
      const response = await fetch(apiUrl, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        navigate("/login");
      }
      const data = await response.json();
      setAllMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      // You might want to set an error state here
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: 'notes' | 'pyq') => {
    setActiveTab(tab);
  };
  
  // Get available branches for selected course
  const getBranchOptions = () => {
    if (!filters.course) return [];
    return branchesByCourse[filters.course as CourseOption] || [];
  };

  // Get available semesters for selected course
  const getSemesterOptions = () => {
    if (!filters.course) return [];
    return semestersByCourse[filters.course as CourseOption] || [];
  };

  // Filter materials client-side based on active tab and search term
  const filteredMaterials = allMaterials.filter(material => {
    const matchesType = material.fileType.toLowerCase() === activeTab;
    const matchesSearch = searchTerm.trim() === '' || 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const downloadFile = async (url: string,title:string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        alert("Authentication required or file not available.");
        return;
      }

  
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a hidden anchor tag and force download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = title;
      document.body.appendChild(a);
      
      
      if (window.navigator.userAgent.toLowerCase().includes("mobile")) {
        a.target = "_self";
      }
  
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the file.");
    }
  };
  
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-indigo-600 hover:text-indigo-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Download Study Material</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="course"
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="" disabled>All Courses</option>
              {courseOptions.map((course) => (
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
              value={filters.branch}
              onChange={handleFilterChange}
              disabled={!filters.course}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="" disabled>All Branches</option>
              {getBranchOptions().map((branch) => (
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
              value={filters.semester}
              onChange={handleFilterChange}
              disabled={!filters.course}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="" disabled>All Semesters</option>
              {getSemesterOptions().map((sem) => (
                <option key={sem} value={sem.toString()}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mb-6">
          <button 
            onClick={fetchMaterials}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center text-sm"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Searching...' : 'Search Materials'}
          </button>
        </div>
        
        {/* Tabs with counters for each tab */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            <button
              onClick={() => handleTabChange('notes')}
              className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Notes
              {allMaterials.length > 0 && (
                <span className="ml-1 sm:ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
                  {allMaterials.filter(m => m.fileType === 'notes').length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('pyq')}
              className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap ${
                activeTab === 'pyq'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileQuestion className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Previous Year Questions
              {allMaterials.length > 0 && (
                <span className="ml-1 sm:ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
                  {allMaterials.filter(m => m.fileType === 'pyq').length}
                </span>
              )}
            </button>
          </nav>
        </div>
        
        {/* Materials List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredMaterials.length === 0 && allMaterials.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">No materials found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or upload new materials.
            </p>
          </div>
        ) : filteredMaterials.length === 0 && allMaterials.length > 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">No {activeTab === 'notes' ? 'notes' : 'previous year questions'} found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try switching tabs or adjusting your search.
            </p>
          </div>
        ) : (
          <>
            {/* Search input field - only shown when materials are loaded */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Desktop view (hidden on mobile) */}
            <div className="hidden sm:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Course</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Branch</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Semester</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Uploaded By</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Download</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{material.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{material.course}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{material.branch}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{material.semester}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{material.uploadedBy}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(material.uploadDate)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button 
                          onClick={() => downloadFile(material.downloadUrl,material.title)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center"
                          aria-label="Download file"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile view (card layout) */}
            <div className="sm:hidden space-y-4">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{material.title}</h3>
                    <button 
                      onClick={() => downloadFile(material.downloadUrl,material.title)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      aria-label="Download file"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium text-gray-700">Course:</span> {material.course}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Branch:</span> {material.branch}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Semester:</span> {material.semester}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span> {formatDate(material.uploadDate)}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Uploaded By:</span> {material.uploadedBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadMaterialPage;