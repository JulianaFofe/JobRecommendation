import { motion } from "framer-motion";
import NavBar from "../../containers/navbar";
import work from "../../assets/images/work.jpg";

export default function Hero() {
  return (
    <div>
      <NavBar />
      <section className="relative">
        {/* Background */}
        <div
          className="h-[68vh] md:h-[78vh] bg-center rounded-4xl bg-cover relative"
          style={{ backgroundImage: `url(${work})` }}
        >
          {/* Overlay (makes image softer) */}
          <div className="rounded-4xl absolute inset-0 bg-black/60"></div>
        </div>
        <div className="h-10"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {/* Welcoming message */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 3 }}
          >
            <h1 className="h-15 text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              Welcome to <span className="text-primary">SmartHire</span>
            </h1>
            <p className="mt-3 font-bold text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
              Your gateway to endless opportunities — whether you’re looking for the right job or the best talent.
            </p>
          </motion.div>
          <div className="h-20"></div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2  gap-6 md:gap-12 w-full max-w-5xl"
          >
            <CTA text="Get started as an employer" href="/signup" />
            <CTA text="Get started as an employee" href="/signup" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CTA({ text, href }: { text: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-primary hover:text-primary hover:bg-white  text-white hover:bg-w font-semibold text-center rounded-md px-6 py-5 md:py-6 shadow-soft relative z-10"
    >
      {text}
    </motion.a>
  );
}
