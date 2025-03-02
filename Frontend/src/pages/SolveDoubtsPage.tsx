import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Clock, User, Search } from 'lucide-react';
import axios from 'axios';

interface Reply {
  id: string;
  repliedBy: string;
  message: string;
  dateTime: string;
}

interface Doubt {
  id: string;
  title: string;
  description: string;
  postedBy: string;
  dateTime: string;
  replies: Reply[];
  solved: boolean;
}

const SolveDoubtsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://paperpalprod.onrender.com/doubts/allDoubts', {
          withCredentials: true
        });
        
        if (response.status !== 200) {
            navigate('/login');
        }

        const transformedDoubts = response.data.map((doubt: any) => ({
          id: doubt.doubtId,
          title: doubt.doubtTitle,
          description: doubt.doubtDescription,
          postedBy: doubt.userName,
          dateTime: doubt.doubtDate,
          replies: doubt.replies || [],
          solved: !!doubt.doubtStatus
        }));
        
        setDoubts(transformedDoubts);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching doubts:', err);
        setError(`Failed to load doubts: ${err.message || 'Unknown error'}`);
        setDoubts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoubts();
  }, [navigate]);

  const filteredDoubts = doubts.filter(doubt =>
    doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doubt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-3 sm:mr-4 text-indigo-600 hover:text-indigo-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Solve Doubts</h1>
      </div>
     
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doubts..."
              className="block w-full pl-10 pr-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
       
        {/* Error Message */}
        {error && (
          <div className="text-center py-3 px-4 mb-6 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
       
        {/* Doubts List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredDoubts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">No doubts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or post a new doubt.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredDoubts.map((doubt) => (
              <div
                key={doubt.id}
                onClick={() => navigate(`/doubt/${doubt.id}`)}
                className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                    {doubt.title}
                    {doubt.solved && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Solved
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 shrink-0">
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>
                      {doubt.replies ? doubt.replies.length : 0}
                      {doubt.replies && doubt.replies.length === 1 ? ' reply' : ' replies'}
                    </span>
                  </div>
                </div>
               
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{doubt.description}</p>
               
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="truncate max-w-xs">{doubt.postedBy}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>{doubt.dateTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button for mobile */}
        <div className="fixed right-6 bottom-6 sm:hidden">
          <button
            onClick={() => navigate('/ask-doubt')}
            className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Post new doubt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolveDoubtsPage;