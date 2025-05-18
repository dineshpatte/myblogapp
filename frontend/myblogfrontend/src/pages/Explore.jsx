import { useEffect, useState } from "react";
import axios from "../api";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/posts/getallposts", {
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
          filteredPosts.forEach((post) => fetchComments(post._id));
        } else {
          setError("Posts data is not an array");
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts.");
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`/comments/getcommentsbypost/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const comment = newComments[postId];
    if (!comment) return;

    try {
      await axios.post("/comments/addcomment", {
        content: comment,
        postId,
      });
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
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

  return (
    <div className="p-6 bg-[#f9f5ec] min-h-screen font-serif">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#5c3d2e]">
        Explore Posts
      </h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#fffaf2] shadow-md rounded-xl border border-[#d9c2a3] p-5 transition-transform transform hover:scale-[1.01]"
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-52 object-cover rounded-md mb-4 border border-[#d9c2a3]"
            />

            <h3 className="text-xl font-bold text-[#5c3d2e] mb-1">
              {post.title}
            </h3>

            <p className="text-sm text-[#7a5c43] mb-2 italic">
              By <span className="font-semibold">{post.author?.username}</span>
            </p>

            <p className="text-[#4e3b2e] text-sm mb-3 whitespace-pre-line">
              {expandedPosts[post._id]
                ? post.content
                : post.content.slice(0, 100) + "..."}
            </p>

            <button
              onClick={() => toggleExpand(post._id)}
              className="text-[#9c6644] hover:underline text-sm mb-4"
            >
              {expandedPosts[post._id] ? "Read Less" : "Read More"}
            </button>

            <textarea
              placeholder="Write a comment..."
              className="w-full border border-[#e0c9aa] rounded p-2 text-sm mb-2 bg-[#fffaf3] focus:outline-none"
              rows="2"
              value={newComments[post._id] || ""}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
            />
            <button
              onClick={() => handleCommentSubmit(post._id)}
              className="bg-[#9c6644] hover:bg-[#7e4f33] text-white px-4 py-1 rounded text-sm"
            >
              Submit
            </button>

            <div className="bg-[#f5efe3] mt-4 border-t border-[#d9c2a3] pt-3 px-6 py-4">
              <h4 className="text-sm font-semibold mb-2 text-[#5c3d2e]">
                🗨 Comments
              </h4>
              {comments[post._id]?.length > 0 ? (
                comments[post._id].map((comment) => (
                  <div
                    key={comment._id}
                    className="text-sm text-[#4e3b2e] mb-2"
                  >
                    <span className="font-medium">
                      {comment.commenter?.username || "Anonymous"}:
                    </span>{" "}
                    {comment.content}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#a38b6e] italic">
                  No comments yet.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
