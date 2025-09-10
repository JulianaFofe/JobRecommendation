import React from "react";
import { useState, useEffect } from "react";
import b from "../../assets/images/download.jpeg";
import c from "../../assets/images/download (1).jpeg";
import d from "../../assets/images/download (1).jpeg";
import e from "../../assets/images/excited.png";
import f from "../../assets/images/teamClogo2.png";
import { motion, AnimatePresence } from "framer-motion";

function Blog() {
  const posts = [
    {
      img: c,
      title: "Data Scientist: Lead Technologies",
      desc: "Happy Mother's Day! - The Bloom Shop Offer: Hey there! Don't miss out on our exclusive Mother",
    },
    {
      img: d,
      title: "Frontend Developer: Creative Minds",
      desc: "Happy Mother's Day! - The Bloom Shop Offer: Hey there! Don't miss out on our exclusive Mother",
    },
    {
      img: b,
      title: "Backend Engineer: Cloud Solutions",
      desc: "Happy Mother's Day! - The Bloom Shop Offer: Hey there! Don't miss out on our exclusive Mother",
    },
    {
      img: c,
      title: "UI/UX Designer: Future Vision",
      desc: "Happy Mother's Day! - The Bloom Shop Offer: Hey there! Don't miss out on our exclusive Mother",
    },
    {
      img: d,
      title: "AI Engineer: NextGen Tech",
      desc: "Happy Mother's Day! - The Bloom Shop Offer: Hey there! Don't miss out on our exclusive Mother",
    },
    {
      img: b,
      title: "Fullstack Developer: Startup Lab",
      desc: "Happy Mother's Day! - The Bloom Shop Offer: Hey there! Don't miss out on our exclusive Mother",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % posts.length),
      3000
    );
    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-150 mt-5 shadow-lg shadow-slate-500 rounded-b font-bold  sm:justify-start">
        <img src={f} alt="Logo" className="w-32 sm:w-23" />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-20 mt-2 sm:mt-3 sm:pl-5">
          <span className="text-green-500 hover:text-yellow-300 cursor-pointer">
            Home
          </span>
          <span className="text-green-500 hover:text-yellow-500 cursor-pointer">
            Profile
          </span>
          <span className="text-green-500 hover:text-yellow-500 cursor-pointer">
            Our Blog
          </span>
        </div>
      </div>

      {/* Featured Section */}
      <div className="relative w-full h-[400px] sm:h-[500px] mt-5 mx-4 sm:mx-0">
        <img src={e} alt="" className="w-full h-full object-cover rounded" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded p-4 sm:p-10 text-center sm:text-left">
          <h1 className="text-yellow-500 text-2xl sm:text-3xl font-bold mb-4">
            WELCOME TO OUR BLOG
          </h1>
          <p className="text-white text-sm sm:text-base">
            Hey there! Don't miss out on our exclusive Mother’s Day offer! Get
            30% off all floral arrangements this weekend only.
            <span className="block mt-2 sm:mt-4 sm:pl-50">
              Visit our website or drop by our store to avail the discount.
            </span>
          </p>
        </div>
      </div>

      {/* Dynamic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mx-4 sm:mx-8">
        {posts.map((post, index) => (
          <motion.div
            key={index}
            className="rounded border border-gray-200 p-3 shadow hover:shadow-lg transition"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              src={post.img}
              alt={post.title}
              className="rounded-t-lg w-full h-48 sm:h-56 object-cover"
            />
            <h1 className="font-bold mt-2 text-yellow-500 text-sm sm:text-lg">
              {post.title}
            </h1>
            <p className="text-sm text-gray-600">{post.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Carousel Section */}
      <div className="mt-12 flex flex-col items-center mx-4 sm:mx-0">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">
          Others Who found jobs
        </h2>
        <div className="relative w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="rounded overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={posts[currentIndex].img}
                alt={posts[currentIndex].title}
                className="w-full h-64 sm:h-80 object-cover rounded"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-yellow-500">
                  {posts[currentIndex].title}
                </h3>
                <p className="text-sm text-gray-600">
                  {posts[currentIndex].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 rounded-full shadow hover:bg-gray-100"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 rounded-full shadow hover:bg-gray-100"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default Blog;
