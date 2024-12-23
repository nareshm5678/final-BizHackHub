import { motion } from 'framer-motion';
import { slideUp } from '../styles/animations';

const GameOver = ({ timeTaken, username, onRestart }) => {
  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div 
        className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4
                   border-2 border-red-200 transform"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-red-600 to-pink-600 
                      text-transparent bg-clip-text">
          Game Over!
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-gray-700 text-lg mb-2">Player:</p>
          <p className="text-2xl font-bold text-purple-600 mb-4">{username}</p>
          <p className="text-gray-700 text-lg mb-2">Time Played:</p>
          <p className="text-2xl font-bold text-red-600">{Math.floor(timeTaken)} seconds</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl
                     hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg
                     font-semibold text-lg"
          onClick={onRestart}
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;
