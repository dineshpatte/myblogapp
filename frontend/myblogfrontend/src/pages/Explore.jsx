import { useEffect, useState } from "react";
import axios from "axios";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/getallposts`, {
          headers: authHeaders,
          params: { status: "published", page: 1, limit: 50 },
        });

        const postsArray = res.data?.data?.posts;
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (Array.isArray(postsArray)) {
          const filteredPosts = postsArray.filter(
            (post) => post.author?._id !== userId && post.thumbnail
          );
          setPosts(filteredPosts);

          // Fetch all comments in parallel for filtered posts
          const commentsResults = await Promise.all(
            filteredPosts.map(async (post) => {
              const resComments = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/comments/getcommentsbypost/${post._id}`,
                { headers: authHeaders }
              );
              return { postId: post._id, comments: resComments.data.data };
            })
          );

          // Build comments object keyed by postId
          const commentsMap = {};
          commentsResults.forEach(({ postId, comments }) => {
            commentsMap[postId] = comments;
          });

          setComments(commentsMap);
        } else {
          setError("Posts data is not an array");
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching posts and comments:", err);
        setError("Failed to fetch posts.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndComments();
  }, []); // empty deps, run once on mount

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const comment = newComments[postId];
    if (!comment) return;

    try {
      await axios.post(
       ` ${import.meta.env.VITE_BACKEND_URL}/comments/addcomment`,
        {
          content: comment,
          postId,
        },
        {
          headers: authHeaders,
          withCredentials: true,
        }
      );

      setNewComments((prev) => ({ ...prev, [postId]: "" }));

      // Refresh comments for this post after adding new one
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/comments/getcommentsbypost/${postId}`,
        { headers: authHeaders }
      );
      setComments((prev) => ({ ...prev, [postId]: res.data.data }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return (
      <div className="p-6 bg-black min-h-screen flex justify-center items-center text-white">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen font-serif text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Explore Posts</h2>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#1a1a1a] shadow-md rounded-xl border border-[#333] p-5 transition-transform transform hover:scale-[1.01]"
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-52 object-cover rounded-md mb-4 border border-[#444]"
            />

            <h3 className="text-xl font-bold text-white mb-1">{post.title}</h3>

            <p className="text-sm text-gray-400 mb-2 italic">
              By <span className="font-semibold text-gray-200">{post.author?.username}</span>
            </p>

            <p className="text-gray-200 text-sm mb-3 whitespace-pre-line">
              {expandedPosts[post._id] ? post.content : post.content.slice(0, 100) + "..."}
            </p>

            <button
              onClick={() => toggleExpand(post._id)}
              className="text-gray-300 hover:underline text-sm mb-4"
            >
              {expandedPosts[post._id] ? "Read Less" : "Read More"}
            </button>

            <textarea
              placeholder="Write a comment..."
              className="w-full border border-gray-600 rounded p-2 text-sm mb-2 bg-[#222] text-white focus:outline-none"
              rows="2"
              value={newComments[post._id] || ""}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
            />
            <button
              onClick={() => handleCommentSubmit(post._id)}
              className="bg-white text-black px-4 py-1 rounded text-sm hover:bg-gray-300"
            >
              Submit
            </button>

            <div className="bg-[#111] mt-4 border-t border-gray-700 pt-3 px-6 py-4 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold mb-2 text-white">🗨 Comments</h4>
              {comments[post._id]?.length > 0 ? (
                comments[post._id].map((comment) => (
                  <div key={comment._id} className="text-sm text-gray-300 mb-2">
                    <span className="font-medium text-white">
                      {comment.commenter?.username || "Anonymous"}:
                    </span>{" "}
                    {comment.content}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No comments yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
