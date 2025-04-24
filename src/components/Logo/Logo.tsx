import { motion } from "framer-motion";

export default function Logo() {
  return (
    <motion.div
      variants={{
        hidden: { y: -10, opacity: 0 },
        visible: { y: 10, opacity: 1 },
      }}
      transition={{ staggerChildren: 0.15 }}
      initial="hidden"
      animate="visible"
      className="w-[300px] mx-auto mt-10 mb-14"
    >
      <motion.img
        src="/logo.png"
        alt="logo"
        transition={{
          duration: 1,
          type: "spring",
        }}
      />
      <motion.div
        transition={{
          duration: 1,
          type: "spring",
        }}
        className="text-center mt-2 text-lg"
      >
        Customized by Georges Neil
      </motion.div>
    </motion.div>
  );
}
