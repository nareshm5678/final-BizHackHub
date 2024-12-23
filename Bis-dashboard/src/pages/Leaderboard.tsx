import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Award, Medal } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  points: number;
  achievements: Array<{
    title: string;
    description: string;
    badge: string;
    dateEarned: Date;
  }>;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshBadges = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/user/refresh-badges',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchLeaderboard(); // Refresh the leaderboard after resetting badges
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh badges');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Set up polling for real-time updates
    const interval = setInterval(fetchLeaderboard, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-600">Leaderboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => fetchLeaderboard()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={refreshBadges}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Award className="w-5 h-5" />
                Reset Badges
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">Points</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">Achievements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <Medal className={`w-6 h-6 ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-400'
                        }`} />
                      ) : (
                        <span className="text-gray-600">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.points}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.achievements.map((achievement, i) => (
                        <div
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          title={achievement.description}
                        >
                          {achievement.title}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;