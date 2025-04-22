import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function App() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:8080/getPosts?token=${token}`).then(res => {
        setPosts(res.data.data);
      }).catch(err => {
        console.error('Error fetching media:', err);
      });
    }
  }, [token]);

  const handleCommentChange = (id, value) => {
    setComments(prev => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = (id) => {
    //todo: api call for comments setup
  };

  if (!token) {
    return <button className='h-screen w-full flex items-center justify-center' onClick={() => window.location.href = "http://localhost:8080/api/v1/auth"}>Login with Instagram</button>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Instagram Posts</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded shadow">
            <img src={post.media_url} alt="post" className="w-full" />
            <p className="mt-2">{post.caption}</p>
            <input
              className="border mt-2 p-1 w-full"
              type="text"
              placeholder="Add comment"
              value={comments[post.id] || ''}
              onChange={e => handleCommentChange(post.id, e.target.value)}
            />
            <button
              onClick={() => handleCommentSubmit(post.id)}
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >Submit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
