import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, Send, MessageSquare } from 'lucide-react';

// Updated interfaces to match the actual backend structure
interface Doubt {
  doubtId: string;
  doubtTitle: string;
  doubtDescription: string;
  userName: string;
  doubtDate: string;
  doubtStatus: boolean;
  replies?: Reply[];
}

interface Reply {
  id: { // Notice the id might be an object based on your data
    $oid?: string; // MongoDB ObjectId format
  };
  repliedBy: string;
  message: string;
  dateTime: string; // Assuming this is the timestamp field
  doubtId?: string;
}

const DoubtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoubtDetails = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('https://paperpalprod.onrender.com/doubts/allDoubts',{
          credentials:"include"
        });
        
        if (!response.ok) {
          console.log(response)
          navigate("/login");
        }
        
        const allDoubts = await response.json();
        console.log('All doubts:', allDoubts); // Debug log
        
        const currentDoubt = allDoubts.find((d: Doubt) => d.doubtId === id);
        
        if (currentDoubt) {
          console.log('Found doubt:', currentDoubt); // Debug log
          setDoubt(currentDoubt);
          
          // If the doubt already has replies, use them directly
          if (currentDoubt.replies && currentDoubt.replies.length > 0) {
            setReplies(currentDoubt.replies);
            setIsLoading(false);
          } else {
            // Otherwise, fetch replies separately
            fetchReplies(currentDoubt.doubtId);
          }
        } else {
          console.error('Doubt not found with id:', id); // Debug log
          setError('Doubt not found');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching doubt details:', err);
        setError('Error fetching doubt details');
        setIsLoading(false);
      }
    };

    const fetchReplies = async (doubtId: string) => {
      try {
        const response = await fetch(`https://paperpalprod.onrender.com/doubts/getReply/${doubtId}`,{
          credentials:'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setReplies(data);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDoubtDetails();
    }
  }, [id, navigate]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !doubt) return;
    
    setIsSubmitting(true);
    
    try {
    
      const replyPayload = {
        message: newReply, 
        id: doubt.doubtId,
      };
      
      console.log(replyPayload);
      const response = await fetch('https://paperpalprod.onrender.com/doubts/addReply', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyPayload),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }
      
      const savedReply = await response.json();

      setReplies(prev => [...prev, savedReply]);
      setNewReply('');
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateTimeString: string) => {
    try {
      // Check if the input is valid
      if (!dateTimeString) {
        return 'Invalid date';
      }
      
      // Parse the date
      const date = new Date(dateTimeString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid date';
    }
  };

  const getReplyKey = (reply: Reply) => {
    if (typeof reply.id === 'object' && reply.id && reply.id.$oid) {
      return reply.id.$oid;
    }
    return typeof reply.id === 'string' ? reply.id : Math.random().toString(36).substring(7);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !doubt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-red-50 p-4 sm:p-6 rounded-lg text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-red-700 mb-2">
            {error || 'Doubt not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            The doubt you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/solve-doubts')}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doubts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/solve-doubts')}
          className="mr-3 sm:mr-4 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Doubt Details</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Doubt Question */}
        <div className="p-4 sm:p-6 border-b">
          <div className="mb-3 sm:mb-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{doubt.doubtTitle}</h2>
              {doubt.doubtStatus && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                  Solved
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-y-1">
            <div className="flex items-center mr-4">
              <User className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{doubt.userName}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{formatDate(doubt.doubtDate)}</span>
            </div>
          </div>
          
          <div className="prose max-w-none text-gray-700 break-words">
            {doubt.doubtDescription.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
  <div className="mb-4">
    <h3 className="text-base sm:text-lg font-medium text-gray-900">
      Replies ({replies.length})
    </h3>
  </div>
 
  {replies.length === 0 ? (
    <div className="text-center py-6 sm:py-8 border rounded-lg bg-gray-50">
      <MessageSquare className="h-6 sm:h-8 w-6 sm:w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500">No replies yet. Be the first to reply!</p>
    </div>
  ) : (
    <div className="space-y-4 sm:space-y-6">
      {replies.map((reply) => (
        <div key={getReplyKey(reply)} className="border rounded-lg p-3 sm:p-4">
          {/* Fixed mobile layout issues by separating user and time info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate font-medium">{reply.repliedBy}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{formatDate(reply.dateTime)}</span>
            </div>
          </div>
         
          <div className="prose max-w-none text-gray-700 break-words">
            {reply.message.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
          {/* Reply Form */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Add your reply</h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Write your reply here..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newReply.trim()}
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtDetailPage;