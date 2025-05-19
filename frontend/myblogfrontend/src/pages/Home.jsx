// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function Home() {
//   const [articles, setArticles] = useState([]);
//   const [user, setUser] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   useEffect(() => {
//     if (user) {
//       const fetchArticles = async () => {
//         try {
//           const response = await axios.get(
//             "https://newsapi.org/v2/top-headlines",
//             {
//               params: {
//                 country: "us",
//                 category: "entertainment",
//                 apiKey: "8c866b53ba254aceb2197af70286766b",
//                 pageSize: 10,
//               },
//             }
//           );
//           setArticles(response.data.articles);
//         } catch (error) {
//           console.error("Failed to fetch articles", error);
//         }
//       };

//       fetchArticles();
//     }
//   }, [user]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowWelcome(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f8f4e3] text-[#3a2e1e] p-6 flex flex-col items-center">
//       {showWelcome ? (
//         <h1 className="text-5xl font-extrabold mb-6">Welcome to MyBlog</h1>
//       ) : (
//         <>
//           {!user ? (
//             <div className="text-center mb-6">
//               <p className="text-lg font-medium mb-4">
//                 Please log in or register to access content.
//               </p>
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="bg-[#7a6e4f] hover:bg-[#6b6344] text-white font-semibold px-6 py-2 rounded shadow transition"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => navigate("/register")}
//                   className="bg-[#a8997e] hover:bg-[#988a6e] text-[#3a2e1e] font-semibold px-6 py-2 rounded shadow transition"
//                 >
//                   Register
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <p className="text-center mb-6 text-lg font-medium">
//                 Hello, {user.username}! Check out these latest blogs
//               </p>

//               {/* Action Buttons */}
//               <div className="flex gap-6 mb-8">
//                 <button
//                   onClick={() => navigate("/create-post")}
//                   className="bg-[#7a6e4f] hover:bg-[#6b6344] text-white font-semibold px-6 py-3 rounded shadow transition"
//                 >
//                   Create Your Own Blog/Post
//                 </button>
//                 <button
//                   onClick={() => navigate("/explore")}
//                   className="bg-[#a8997e] hover:bg-[#988a6e] text-[#3a2e1e] font-semibold px-6 py-3 rounded shadow transition"
//                 >
//                   Explore Other Users' Blogs
//                 </button>
//               </div>

//               {/* Articles Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
//                 {articles.map((article, idx) => (
//                   <div
//                     key={idx}
//                     className="border rounded-lg p-4 bg-[#f4ecdc] shadow-md flex flex-col"
//                   >
//                     {article.urlToImage && (
//                       <img
//                         src={article.urlToImage}
//                         alt={article.title}
//                         className="rounded-md mb-4 object-cover h-40 w-full"
//                       />
//                     )}
//                     <h2 className="text-xl font-bold mb-2">{article.title}</h2>
//                     <p className="text-sm mb-3 flex-grow">
//                       {article.description}
//                     </p>
//                     <a
//                       href={article.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-700 underline mt-auto"
//                     >
//                       Read More
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Home;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (user) {
      const fetchArticles = async () => {
        try {
          const response = await axios.get(
            "https://newsapi.org/v2/top-headlines",
            {
              params: {
                country: "us",
                category: "entertainment",
                apiKey: "8c866b53ba254aceb2197af70286766b",
                pageSize: 10,
              },
            }
          );
          setArticles(response.data.articles);
        } catch (error) {
          console.error("Failed to fetch articles", error);
        }
      };

      fetchArticles();
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e0e0e0] p-6 flex flex-col items-center font-sans">
      {showWelcome ? (
        <h1 className="text-5xl font-extrabold mb-6 text-white tracking-wide">
          Welcome to MyBlog
        </h1>
      ) : (
        <>
          {!user ? (
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-4 text-gray-400">
                Please log in or register to access content.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#c7c7c7] font-semibold px-6 py-2 rounded-lg shadow transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-[#d0d0d0] font-semibold px-6 py-2 rounded-lg shadow transition"
                >
                  Register
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center mb-6 text-lg font-medium text-gray-400">
                Hello,{" "}
                <span className="text-white font-bold">{user.username}</span>!
                Check out these latest blogs
              </p>

              <div className="flex gap-6 mb-8 flex-wrap justify-center">
                <button
                  onClick={() => navigate("/create-post")}
                  className="bg-[#1f1f1f] hover:bg-[#292929] text-[#c7c7c7] font-semibold px-6 py-3 rounded-lg shadow transition"
                >
                  Create Your Own Blog/Post
                </button>
                <button
                  onClick={() => navigate("/explore")}
                  className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-[#d0d0d0] font-semibold px-6 py-3 rounded-lg shadow transition"
                >
                  Explore Other Users' Blogs
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                {articles.map((article, idx) => (
                  <div
                    key={idx}
                    className="border border-[#2e2e2e] rounded-lg p-4 bg-[#1a1a1a] shadow-lg flex flex-col transition hover:scale-[1.01]"
                  >
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="rounded-md mb-4 object-cover h-40 w-full"
                      />
                    )}
                    <h2 className="text-xl font-bold mb-2 text-white">
                      {article.title}
                    </h2>
                    <p className="text-sm mb-3 text-gray-400 flex-grow">
                      {article.description}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9ca3af] underline mt-auto"
                    >
                      Read More
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
