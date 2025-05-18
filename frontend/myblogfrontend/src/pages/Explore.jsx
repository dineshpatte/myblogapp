import { useEffect, useState } from "react";
import axios from "../api";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({}); // track expanded state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/posts/getallposts", {
          params: { status: "published", page: 1, limit: 10 },
        });

        const postsArray = res.data?.data?.posts;

        if (Array.isArray(postsArray)) {
          setPosts(postsArray);
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

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (postId) => {
    const comment = comments[postId];
    if (comment) {
      alert(`Comment on post ${postId}: ${comment}`);
      setComments((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Explore Posts</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(posts) &&
          posts
            .filter((post) => post.thumbnail)
            .map((post) => (
              <div
                key={post._id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-col"
              >
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />

                <h3 className="text-lg font-semibold mb-1">{post.title}</h3>

                {post.author?.username && (
                  <p className="text-sm text-gray-500 mb-2">
                    By{" "}
                    <span className="font-medium">{post.author.username}</span>
                  </p>
                )}

                <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                  {expandedPosts[post._id]
                    ? post.content
                    : post.content.slice(0, 100) + "..."}
                </p>

                <button
                  onClick={() => toggleExpand(post._id)}
                  className="text-blue-600 text-sm font-semibold mb-4"
                >
                  {expandedPosts[post._id] ? "Read Less" : "Read More"}
                </button>

                <div className="mt-auto">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full border rounded p-2 text-sm mb-2"
                    rows="2"
                    value={comments[post._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Explore;
