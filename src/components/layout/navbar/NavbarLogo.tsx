import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LazyImage from "@/components/ui/LazyImage";

const NavbarLogo = () => {
  const logoVariants = {
    initial: { opacity: 0, scale: 0.5, rotate: -180 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Link to="/">
      <motion.div
        className="flex items-center gap-2 group cursor-pointer"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="relative"
          variants={logoVariants}
          whileHover={{
            scale: 1.15,
            rotate: 10,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-10 h-10">
            <LazyImage
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div className="hidden sm:block" variants={textVariants}>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GetCar
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Premium Rides
            </span>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default NavbarLogo;
