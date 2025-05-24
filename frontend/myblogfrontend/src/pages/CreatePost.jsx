import { useState } from "react";
import axios from "axios";
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

      await axios.post("http://localhost:3000/api/v1/posts/createpost", data, {
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
    <div className="w-screen h-screen mx-auto p-8 bg-[#0e0e0e] shadow-xl text-[#e0e0e0]">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-white tracking-wide">
        Create New Post
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          className="focus:ring-2 focus:ring-[#555] px-6 py-3 text-lg font-semibold shadow-sm placeholder-gray-500 text-white bg-[#1a1a1a] transition duration-300 rounded-2xl"
        />

        <textarea
          name="content"
          placeholder="Write your content..."
          value={formData.content}
          onChange={handleChange}
          rows="6"
          className="rounded-2xl border border-[#2d2d2d] focus:border-[#555] focus:ring-2 focus:ring-[#555] px-6 py-4 text-lg resize-none shadow-sm placeholder-gray-500 text-white bg-[#1a1a1a] transition duration-300"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="rounded-2xl border border-[#2d2d2d] focus:border-[#555] focus:ring-2 focus:ring-[#555] px-8 py-3 text-lg font-semibold shadow-sm bg-[#1a1a1a] text-white transition duration-300 appearance-none relative pr-12"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg fill='none' stroke='%23c7c7c7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M6 9l6 6 6-6'%3e%3c/path%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1.25em",
          }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label className="flex flex-col items-center border-2 border-dashed border-[#2d2d2d] rounded-3xl py-6 cursor-pointer hover:bg-[#1f1f1f] transition duration-300 text-white">
          {thumbnail ? (
            <p className="font-semibold">{`Selected File: ${thumbnail.name}`}</p>
          ) : (
            <>
              {/* Upload icon only */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V6" />
                <path d="M5 13l7-7 7 7" />
              </svg>
              <span className="font-semibold text-gray-300">
                Upload Thumbnail Image
              </span>
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
          className="bg-[#333] hover:bg-[#444] text-white font-bold py-3 rounded-full shadow-md transition duration-300"
        >
          Create Post
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 text-center font-semibold ${
            message.includes("successfully") ? "text-[#7cd1a8]" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CreatePost;
