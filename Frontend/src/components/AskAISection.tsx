import React, { useState } from 'react';
import { Send, Loader, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AskAISection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);

    const apiUrl = `https://paperpalprod.onrender.com/ai/generateStream?prompt=${encodeURIComponent(question)}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        navigate('/login');
      }
      console.log(response);
      const data = await response.text();
      console.log(response, data);

      setTimeout(() => {
        setResponse(data);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClearResponse = () => {
    setResponse('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any academic question..."
            className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg sm:rounded-l-none hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center"
          >
            {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </form>

      {response && (
        <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">AI Response:</h3>
          <p className="text-gray-700 break-words">{response}</p>
          <button
            onClick={handleClearResponse}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center sm:justify-start"
          >
            <X className="h-5 w-5 mr-2" />
            Clear Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default AskAISection;