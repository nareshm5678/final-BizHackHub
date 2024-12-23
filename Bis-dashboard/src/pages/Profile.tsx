import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Camera, Loader2, CheckCircle, AlertCircle, Calendar, GraduationCap, Lock } from 'lucide-react';
import { API_URL } from '../config/config';

interface UserData {
  username: string;
  email: string;
  profilePic?: string;
  age?: number;
  college?: string;
}

interface EditedData extends UserData {
  currentPassword?: string;
  newPassword?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editedData, setEditedData] = useState<EditedData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');

      if (!token || !email) {
        setMessage({ type: 'error', text: 'Authentication required' });
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${API_URL}/api/user/profile/${encodeURIComponent(email)}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        const userData = response.data;
        setUserData(userData);
        setEditedData(userData);
        if (userData.profilePic) {
          setPreviewUrl(`${API_URL}/uploads/profiles/${userData.profilePic}`);
        }
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to fetch user data'
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedData) return;
    
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: name === 'age' ? (value ? parseInt(value) : '') : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token || !editedData) {
        setMessage({ type: 'error', text: 'Missing required data' });
        return;
      }

      // First update profile data
      const profileResponse = await axios.put(
        `${API_URL}/api/user/profile`,
        {
          username: editedData.username,
          age: editedData.age,
          college: editedData.college
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // If password change is requested, update password
      if (editedData.currentPassword && editedData.newPassword) {
        try {
          await axios.put(
            `${API_URL}/api/user/change-password`,
            {
              currentPassword: editedData.currentPassword,
              newPassword: editedData.newPassword
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Failed to update password');
        }
      }

      // If there's a new profile picture, upload it
      if (selectedFile) {
        const formData = new FormData();
        formData.append('profilePic', selectedFile);

        const picResponse = await axios.post(
          `${API_URL}/api/user/profile-picture`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (picResponse.data.profilePic) {
          profileResponse.data.profilePic = picResponse.data.profilePic;
        }
      }

      if (profileResponse.data) {
        setUserData(profileResponse.data);
        setEditedData(profileResponse.data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        if (profileResponse.data.profilePic) {
          setPreviewUrl(`${API_URL}/uploads/profiles/${profileResponse.data.profilePic}`);
        }

        // Emit profile update event
        const event = new CustomEvent('profileUpdated', {
          detail: {
            username: profileResponse.data.username,
            profilePic: profileResponse.data.profilePic ? 
              `${API_URL}/uploads/profiles/${profileResponse.data.profilePic}` : null
          }
        });
        window.dispatchEvent(event);

        // Clear password fields
        setEditedData(prev => ({
          ...prev!,
          currentPassword: '',
          newPassword: ''
        }));
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData || !editedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.type === 'error' ? <AlertCircle className="inline mr-2" /> : <CheckCircle className="inline mr-2" />}
            {message.text}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                      <User className="w-16 h-16 text-black-300" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editedData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-800">
                    <User className="w-5 h-5 text-purple-500" />
                    <span>{userData.username}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2 text-gray-800">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span>{userData.email}</span>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editedData.age || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-800">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span>{userData.age || 'Not specified'}</span>
                  </div>
                )}
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="college"
                    value={editedData.college || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-800">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    <span>{userData.college || 'Not specified'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="space-y-6 pt-6 border-t border-purple-600/10">
                <h3 className="text-lg font-medium text-purple-600">Change Password</h3>
                
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-purple-600/90 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-300" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={editedData.currentPassword || ''}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-purple-600/20 rounded-lg 
                               text-purple-600 placeholder-purple-600/50 backdrop-blur-sm
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-200"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-purple-600/90 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-300" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={editedData.newPassword || ''}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-purple-600/20 rounded-lg 
                               text-purple-600 placeholder-purple-600/50 backdrop-blur-sm
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-200"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(userData);
                      setPreviewUrl(userData.profilePic ? `${API_URL}/uploads/profiles/${userData.profilePic}` : null);
                      setSelectedFile(null);
                      setMessage({ type: '', text: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
