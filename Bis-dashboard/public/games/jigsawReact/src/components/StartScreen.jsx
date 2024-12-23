import { useState } from 'react';
import { motion } from 'framer-motion';

const StartScreen = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] p-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 
                     text-transparent bg-clip-text">
        Welcome to the Puzzle Game!
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full mb-4 p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 
                     focus:outline-none text-lg"
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 
                     rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all
                     font-semibold text-lg shadow-md hover:shadow-lg"
          type="submit"
        >
          Start Game
        </motion.button>
      </form>
    </motion.div>
  );
};

export default StartScreen;