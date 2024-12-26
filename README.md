# BizHackHub

BizHackHub is a comprehensive business learning and development platform built with React, TypeScript, and Node.js. It combines modern frontend technologies with a robust backend to create an engaging learning experience.

## Project Structure

The project is organized into two main directories:

- `Bis-dashboard/`: Frontend application built with React and TypeScript
- `server/`: Backend API server

### Frontend (`Bis-dashboard/`)

- Built with React 18 and TypeScript
- Uses Vite as the build tool
- Styled with Tailwind CSS
- Features modern routing with React Router DOM
- Includes hot toast notifications

### Backend (`server/`)

- Express.js server
- MongoDB database with Mongoose ORM
- JWT authentication
- File upload capabilities with Multer

## Project Components

### Interactive Games
Located in `Bis-dashboard/public/games`:

1. **Quiz App**
   - Interactive business knowledge assessment
   - Multiple categories and difficulty levels
   - Real-time scoring and feedback
   - Progress tracking

2. **Jigsaw React Game**
   - Visual puzzle challenges
   - Strategic thinking development
   - Problem-solving exercises
   - Different difficulty levels

3. **Fruit Cutter Game**
   - Hand-eye coordination training
   - Quick decision-making practice
   - Score-based progression
   - Reflexes improvement

4. **Easter Egg Hunt**
   - Hidden challenges and rewards
   - Exploration-based learning
   - Special achievements
   - Bonus content unlocks

### Learning Hub Projects
Located in `Bis-dashboard/learningHub`:

**Business Stream Platform**
- Comprehensive business education modules
- Interactive learning materials
- Real-time collaboration features
- Progress tracking and assessments
- Industry-specific case studies
- Expert-curated content
- Practical business simulations

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios for API calls
- Lucide React for icons

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file handling
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd Bis-dashboard
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

### Running the Application

1. Start the frontend development server:
```bash
cd Bis-dashboard
npm run dev
```

2. Start the backend server:
```bash
cd server
npm start
```

## Development

- Frontend development server runs on default Vite port
- Backend API server configuration can be modified through environment variables
- Use `npm run build` to create production builds
- Use `npm run lint` to run ESLint checks

## Features

- User authentication and authorization
- Learning management system
- Interactive dashboard
- File upload capabilities
- Responsive design
- Modern UI/UX
- Interactive games and learning hub projects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
