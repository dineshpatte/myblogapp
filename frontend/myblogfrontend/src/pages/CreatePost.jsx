import { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail") {
      setThumbnail(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.title || !formData.content) {
      setMessage("Title and content are required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("status", formData.status);
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const res = await axios.post("/posts/createpost", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Post created successfully!");
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-[#f8f4e3] rounded-3xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-[#3a2e1e] tracking-wide">
        Create New Post
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          className="rounded-full border border-[#d6c9b8] focus:border-[#b39e7f] focus:ring-2 focus:ring-[#b39e7f] px-6 py-3 text-lg font-semibold shadow-sm placeholder-[#a08c75] text-[#3a2e1e] bg-white transition duration-300"
        />

        <textarea
          name="content"
          placeholder="Write your content..."
          value={formData.content}
          onChange={handleChange}
          rows="6"
          className="rounded-2xl border border-[#d6c9b8] focus:border-[#b39e7f] focus:ring-2 focus:ring-[#b39e7f] px-6 py-4 text-lg resize-none shadow-sm placeholder-[#a08c75] text-[#3a2e1e] bg-white transition duration-300"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="rounded-full border border-[#d6c9b8] focus:border-[#b39e7f] focus:ring-2 focus:ring-[#b39e7f] px-6 py-3 text-lg font-semibold shadow-sm bg-white text-[#3a2e1e] transition duration-300"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label className="flex flex-col items-center border-2 border-dashed border-[#d6c9b8] rounded-3xl py-6 cursor-pointer hover:bg-[#e9e3d8] transition duration-300 text-[#3a2e1e]">
          {thumbnail ? (
            <p className="font-semibold">{`Selected File: ${thumbnail.name}`}</p>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2 text-[#b39e7f]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 8v4m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span className="font-semibold">Upload Thumbnail Image</span>
            </>
          )}
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          className="bg-[#b39e7f] hover:bg-[#a58f6b] text-[#3a2e1e] font-bold py-3 rounded-full shadow-md transition duration-300"
        >
          Create Post
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 text-center font-semibold ${
            message.includes("successfully") ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CreatePost;
