import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const SLIDE_TEXT_VARIANTS = {
    hidden: { x: "-100%" },
    show: {
      x: 0,
      transition: { type: "tween", duration: 1.5, ease: "easeInOut" },
    },
  };

  return (
    <section id="home">
      <div
        className="relative h-auto p-8 md:p-14 flex flex-col items-center md:h-[900px] text-white bg-cover bg-center"
        style={{
          backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/011/332/525/small_2x/hand-drawn-coffee-concept-background-free-vector.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative w-full flex flex-col items-center p-10">
          {/* Kolom Kiri (Teks dan Tombol) */}
          <div className="w-full text-center z-10 mb-6">
            <motion.div
              initial="hidden"
              animate="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.h1
                className="font-display text-3xl md:text-4xl lg:text-7xl font-bold tracking-[-0.02em] drop-shadow-sm leading-[2.5rem] md:leading-[3rem] lg:leading-[5rem] mb-6"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                Selamat Datang <br />
                <motion.span
                  className="block"
                  initial="hidden"
                  animate="show"
                  variants={SLIDE_TEXT_VARIANTS}
                >
                  DI MyWebsite Coffee ☕
                </motion.span>
              </motion.h1>

              <motion.div
                className="mt-8"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Link
                  to={"product"}
                  className="btn border-none bg-amber-700 hover:bg-amber-900 rounded-xl px-6 py-3 md:px-8 md:py-4 text-sm md:text-base text-brown-900 font-semibold shadow-md"
                >
                  Explore Sekarang
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="w-full flex justify-center z-10 mb-6">
            <img
              src="./coffee.gif"
              alt="Hero Image"
              className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg drop-shadow-lg rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
