import React, { useState, useEffect } from 'react';
import { Trophy, Target, Book, Calendar, LucideIcon, Medal, Crown, Award } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/config';
import Leaderboard from './Leaderboard';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend: string;
  color: string;
}

interface Achievement {
  title: string;
  description: string;
  badge: string;
  dateEarned: string;
}

interface LeaderboardUser {
  username: string;
  points: number;
  rank: number;
  achievements: Achievement[];
}

interface UserStats {
  points: number;
  completedTasks: string[];
  achievements: Array<{
    title: string;
    description: string;
    badge: string;
    dateEarned: string;
  }>;
  lastActive: string;
  profilePic: string | null;
}

const Dashboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    completedTasks: [],
    achievements: [],
    lastActive: new Date().toISOString(),
    profilePic: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskProcessing, setIsTaskProcessing] = useState<string | null>(null);

  const dailyMissions = [
    { id: 'task1', title: 'Complete Safety Standards Quiz', points: 100, icon: Book },
    { id: 'task2', title: 'Watch Quality Control Videos', points: 50, icon: Calendar },
    { id: 'task3', title: 'Complete Practice Test', points: 75, icon: Target },
    { id: 'task4', title: 'Review Documentation', points: 50, icon: Book },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchUserStats(), fetchLeaderboardData()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserStats = async () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setUserStats(prev => ({
          ...prev,
          points: response.data.points || 0,
          completedTasks: response.data.completedTasks || [],
          achievements: response.data.achievements || [],
          lastActive: response.data.lastActive || new Date().toISOString(),
          profilePic: response.data.profilePic
        }));
      }
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${API_URL}/api/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.leaderboard) {
        setLeaderboardData(response.data.leaderboard);
      }
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
    }
  };

  const handleCompleteTask = async (taskId: string, taskTitle: string, points: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      if (userStats.completedTasks.includes(taskId)) {
        return; // Task already completed
      }

      const response = await axios.post(
        `${API_URL}/api/tasks/complete`,
        { taskId, taskTitle, points },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setUserStats(prev => ({
          ...prev,
          points: response.data.points,
          completedTasks: response.data.completedTasks,
          achievements: response.data.achievements
        }));
        if (response.data.leaderboard) {
          setLeaderboardData(response.data.leaderboard);
        }
      }
    } catch (error: any) {
      console.error('Error completing task:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
            Welcome to BIZ Hack Hub
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Trophy}
            title="Total Points"
            value={userStats.points.toString()}
            trend="+100 today"
            color="bg-yellow-500"
          />
          <StatCard
            icon={Target}
            title="Tasks Completed"
            value={userStats.completedTasks.length.toString()}
            trend="of 10 tasks"
            color="bg-blue-500"
          />
          <StatCard
            icon={Award}
            title="Achievements"
            value={userStats.achievements.length.toString()}
            trend="badges earned"
            color="bg-purple-500"
          />
          <StatCard
            icon={Medal}
            title="Current Rank"
            value={leaderboardData.find(user => user.points === userStats.points)?.rank?.toString() || '-'}
            trend="on leaderboard"
            color="bg-green-500"
          />
        </div>

        {/* Daily Missions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              Daily Missions
            </h2>
            <div className="space-y-4">
              {dailyMissions.map((mission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <mission.icon className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{mission.title}</h3>
                      <p className="text-sm text-gray-500">{mission.points} points</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(mission.id, mission.title, mission.points)}
                    disabled={userStats.completedTasks.includes(mission.id) || isTaskProcessing === mission.id}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      userStats.completedTasks.includes(mission.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isTaskProcessing === mission.id
                        ? 'bg-primary-500 text-white cursor-wait'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {userStats.completedTasks.includes(mission.id)
                      ? 'Completed'
                      : isTaskProcessing === mission.id
                      ? 'Processing...'
                      : 'Complete'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary-600" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              {userStats.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(achievement.dateEarned).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!userStats.achievements || userStats.achievements.length === 0) && (
                <div className="text-center text-gray-500 py-4">
                  No achievements yet. Complete tasks to earn badges!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-8">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, trend, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{trend}</span>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;