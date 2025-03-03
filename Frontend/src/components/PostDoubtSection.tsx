import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, List } from 'lucide-react';

const PostDoubtSection: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
   try{
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
  
    setIsSubmitting(true);
    const apiUrl=`http://localhost:8080doubts/postDoubts`
    const response=await fetch(apiUrl,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body:JSON.stringify({doubtTitle:title,doubtDescription:description}),
    })
if(response.ok){
  setTimeout(() => {

    setIsSubmitting(false);
    setTitle('');
    setDescription('');
    alert('Your doubt has been posted successfully!');
  }, 1000);
}else{
  navigate('/login')
}
   }catch(error){
      alert("Error in posting Doubt!")
   }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., How to solve this integration problem?"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your doubt in detail..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>Post Doubt</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/solve-doubts')}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <List className="h-5 w-5" />
            <span>View All Doubts</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostDoubtSection;