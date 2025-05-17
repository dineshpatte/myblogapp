import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function MyPosts() {
  const [posts, setPosts] = useState([]);
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
    try {
      const res = await axios.get("/posts/getpostbyuserid", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data.data || []);
    } catch (err) {
      setMessage("Could not fetch posts");
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/posts/deletepost/${postId}`, {
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
      await axios.put(`/posts/updatepost/${editingPost._id}`, editForm, {
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
    <div className="p-6 max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">My Posts</h2>
      {message && <p className="text-red-600 mb-4 text-center">{message}</p>}

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border rounded shadow flex flex-col md:flex-row overflow-hidden"
          >
            {/* Content */}
            <div className="flex-1 p-6">
              <h3 className="font-bold text-2xl mb-4">{post.title}</h3>
              <p className="mb-4">{post.content}</p>
              {post.status === "published" && (
                <div className="inline-block bg-green-100 text-green-700 font-semibold px-3 py-1 rounded mb-2">
                  ✅ Published
                </div>
              )}
              <div className="flex space-x-6 text-2xl mt-4">
                <span
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleEditClick(post)}
                  title="Edit"
                >
                  ✏️
                </span>
                <span
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => handleDelete(post._id)}
                  title="Delete"
                >
                  🗑️
                </span>
                <span
                  className="cursor-pointer hover:text-gray-600"
                  onClick={() => navigate(`/post/${post._id}`)}
                  title="Comment"
                >
                  💬
                </span>
              </div>
            </div>

            {/* Image */}
            {post.thumbnail && (
              <img
                src={
                  typeof post.thumbnail === "string"
                    ? post.thumbnail
                    : post.thumbnail.secure_url || post.thumbnail.url
                }
                alt={post.title}
                className="w-full md:w-1/3 object-cover"
                style={{ minHeight: "200px" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">Edit Post</h3>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full border px-4 py-2 mb-3 rounded"
              placeholder="Title"
            />
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              rows="5"
              className="w-full border px-4 py-2 mb-3 rounded"
              placeholder="Content"
            ></textarea>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              className="w-full border px-4 py-2 mb-4 rounded"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingPost(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
