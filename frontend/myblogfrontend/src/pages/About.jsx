import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e0e0e0] p-10 flex items-center justify-center">
      <div className="max-w-3xl text-center space-y-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white uppercase">
          About This Blog Platform
        </h1>

        <p className="text-xl leading-relaxed text-gray-300 max-w-xl mx-auto">
          Welcome to our blog platform – a space to express, explore, and engage
          with the world through words and ideas. Whether you're a casual writer
          or a passionate blogger, this is your creative outlet.
        </p>

        <section>
          <h2 className="text-3xl font-semibold mb-6 text-white tracking-wide">
            What Can You Do Here?
          </h2>
          <ul className="text-left text-gray-400 text-lg list-disc list-inside max-w-md mx-auto space-y-3">
            <li>
              <strong>Create Posts:</strong> Share your thoughts, experiences,
              or knowledge.
            </li>
            <li>
              <strong>Upload Thumbnails:</strong> Make your post visually
              appealing with an image.
            </li>
            <li>
              <strong>Choose Post Status:</strong> Save as draft or publish
              immediately.
            </li>
            <li>
              <strong>Explore Posts:</strong> Discover what others have written
              in the Explore section.
            </li>
            <li>
              <strong>Comment:</strong> Share your thoughts or feedback on
              others’ posts.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6 text-white tracking-wide">
            How to Get Started
          </h2>
          <ol className="text-left text-gray-400 text-lg list-decimal list-inside max-w-md mx-auto space-y-3">
            <li>
              <strong>Sign Up / Login:</strong> Create an account to unlock full
              features.
            </li>
            <li>
              <strong>Navigate to "Create Post":</strong> Add a title, content,
              and optional thumbnail.
            </li>
            <li>
              <strong>Publish or Save as Draft:</strong> Control when your post
              goes live.
            </li>
            <li>
              <strong>Browse Explore Page:</strong> Read posts from others, like
              or comment.
            </li>
            <li>
              <strong>Join the Community:</strong> Engage with fellow users and
              grow your voice.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6 text-white tracking-wide">
            Tech Behind the App
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            This platform is built using the MERN Stack – MongoDB, Express,
            React, and Node.js – ensuring a fast, modern, and secure experience.
            Images are uploaded with Cloudinary, and JWT is used for secure
            authentication.
          </p>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Start writing, start reading, and start connecting. This blog isn’t
            just a tool – it's your creative space.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
