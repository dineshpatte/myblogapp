import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    status: "draft",
  });

  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    const token = localStorage.getItem("token");
    console.log(token)
    try {
      const res = await axios.get("http://localhost:3000/api/v1/posts/getpostbyuserid", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userPosts = res.data.data || [];
      setPosts(userPosts);

      userPosts.forEach((post) => fetchComments(post._id));
    } catch (err) {
      setMessage("Could not fetch posts",err?.message);

      console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/comments/getcommentsbypost/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data.data || [] }));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/deletepost/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      content: post.content,
      status: post.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    const token = localStorage.getItem("token");

    try {
      await api.put(`/posts/updatepost/${editingPost._id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingPost(null);
      fetchMyPosts();
    } catch (err) {
      alert("Failed to update post");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto bg-[#0f0f0f] min-h-screen text-white">
      <h2 className="text-4xl font-serif font-bold mb-10 text-center text-[#dcdcdc] tracking-wide">
        My Posts
      </h2>
      {message && (
        <p className="text-red-500 mb-6 text-center font-semibold">{message}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg overflow-hidden flex flex-col"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {post.thumbnail && (
              <img
                src={
                  typeof post.thumbnail === "string"
                    ? post.thumbnail
                    : post.thumbnail.secure_url || post.thumbnail.url
                }
                alt={post.title}
                className="object-cover w-full"
                style={{ height: "180px" }}
              />
            )}

            <div className="p-6 flex flex-col flex-grow justify-between text-[#e0e0e0]">
              <div>
                <h3 className="font-serif font-bold text-2xl mb-3 tracking-tight">
                  {post.title}
                </h3>
                <p className="mb-4 leading-relaxed text-sm text-[#bcbcbc]">
                  {post.content}
                </p>
                {post.status === "published" && (
                  <div className="inline-block bg-[#3a3a3a] text-[#d0d0d0] font-semibold px-3 py-1 rounded mb-4 shadow-inner text-sm">
                    Published
                  </div>
                )}
              </div>

              <div>
                <div className="flex space-x-6 text-2xl mb-4">
                  <span
                    className="cursor-pointer hover:text-yellow-400 transition duration-300"
                    onClick={() => handleEditClick(post)}
                    title="Edit"
                  >
                    ✏️
                  </span>
                  <span
                    className="cursor-pointer hover:text-red-400 transition duration-300"
                    onClick={() => handleDelete(post._id)}
                    title="Delete"
                  >
                    🗑️
                  </span>
                </div>

                <div className="bg-[#1e1e1e] border-t border-[#333] pt-2 rounded-b max-h-32 px-6 py-4 overflow-scroll text-[#bcbcbc]">
                  <h4 className="text-xs font-semibold mb-1 flex items-center gap-1 text-[#aaa]">
                    🗨 Comments
                  </h4>
                  {comments[post._id]?.length > 0 ? (
                    comments[post._id].map((comment) => (
                      <div key={comment._id} className="text-xs mb-1">
                        <span className="font-medium">
                          {comment.commenter?.username || "Anonymous"}:
                        </span>{" "}
                        {comment.content}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-500 italic">
                      No comments yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="bg-[#1f1f1f] p-8 rounded-lg shadow-xl w-full max-w-lg font-serif text-white">
            <h3 className="text-2xl font-bold mb-6">Edit Post</h3>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full border border-[#444] bg-[#2a2a2a] px-4 py-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#666]"
              placeholder="Title"
            />
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              rows="5"
              className="w-full border border-[#444] bg-[#2a2a2a] px-4 py-3 mb-4 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#666]"
              placeholder="Content"
            ></textarea>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              className="w-full border border-[#444] bg-[#2a2a2a] px-4 py-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-[#666]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex justify-end gap-5">
              <button
                onClick={() => setEditingPost(null)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded shadow transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded shadow transition duration-300"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPosts;
