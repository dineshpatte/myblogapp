import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

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
    try {
      const res = await axios.get("/posts/getpostbyuserid", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userPosts = res.data.data || [];
      setPosts(userPosts);

      userPosts.forEach((post) => fetchComments(post._id));
    } catch (err) {
      setMessage("Could not fetch posts");
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`/comments/getcommentsbypost/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data.data || [] }));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
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
    <div className="p-6 max-w-screen-2xl mx-auto bg-[#f5efe6] min-h-screen">
      <h2 className="text-4xl font-serif font-bold mb-10 text-center text-[#5b3a29] tracking-wide">
        My Posts
      </h2>
      {message && (
        <p className="text-red-700 mb-6 text-center font-semibold">{message}</p>
      )}

      {/* Grid with 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#faf4ea] border border-[#d7c9b6] rounded-lg shadow-lg overflow-hidden flex flex-col "
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {/* Image on top full width */}
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

            {/* Content below */}
            <div className="p-6 flex flex-col flex-grow justify-between text-[#5b3a29]">
              <div>
                <h3 className="font-serif font-bold text-2xl mb-3 tracking-tight">
                  {post.title}
                </h3>
                <p className="mb-4 leading-relaxed text-sm">{post.content}</p>
                {post.status === "published" && (
                  <div className="inline-block bg-[#c6a77b] text-[#4a2e11] font-semibold px-3 py-1 rounded mb-4 shadow-inner text-sm">
                    Published
                  </div>
                )}
              </div>

              <div>
                <div className="flex space-x-6 text-2xl mb-4">
                  <span
                    className="cursor-pointer hover:text-[#a05626] transition duration-300"
                    onClick={() => handleEditClick(post)}
                    title="Edit"
                  >
                    ✏️
                  </span>
                  <span
                    className="cursor-pointer hover:text-[#b33a1a] transition duration-300"
                    onClick={() => handleDelete(post._id)}
                    title="Delete"
                  >
                    🗑️
                  </span>
                </div>

                <div
                  className="bg-[#ede6d7] border-t border-[#d7c9b6] pt-2 rounded-b max-h-32  px-6  py-4 overflow-scroll"
                  style={{ fontFamily: "'Palatino Linotype', serif" }}
                >
                  <h4 className="text-xs font-semibold mb-1 flex items-center gap-1 text-[#6d553a]">
                    🗨 Comments
                  </h4>
                  {comments[post._id]?.length > 0 ? (
                    comments[post._id].map((comment) => (
                      <div
                        key={comment._id}
                        className="text-xs text-[#5b4a3f] mb-1"
                      >
                        <span className="font-medium">
                          {comment.commenter?.username || "Anonymous"}:
                        </span>{" "}
                        {comment.content}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#a3957a] italic">
                      No comments yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="bg-[#f9f2e9] p-8 rounded-lg shadow-xl w-full max-w-lg font-serif text-[#5b3a29]">
            <h3 className="text-2xl font-bold mb-6">Edit Post</h3>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full border border-[#d7c9b6] px-4 py-3 mb-4 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c6a77b]"
              placeholder="Title"
            />
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              rows="5"
              className="w-full border border-[#d7c9b6] px-4 py-3 mb-4 rounded shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-[#c6a77b]"
              placeholder="Content"
            ></textarea>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              className="w-full border border-[#d7c9b6] px-4 py-3 mb-6 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c6a77b]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex justify-end gap-5">
              <button
                onClick={() => setEditingPost(null)}
                className="bg-[#b4a37a] hover:bg-[#a08c4e] text-white px-6 py-2 rounded shadow transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                className="bg-[#806231] hover:bg-[#6e5124] text-white px-6 py-2 rounded shadow transition duration-300"
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
