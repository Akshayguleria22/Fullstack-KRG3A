import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  CalendarToday,
  EmojiEvents,
  TrendingUp,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { moodAPI, exerciseAPI } from '../services/api';

const Profile = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || user?.username || 'User',
    email: user?.email || 'Not provided',
    phone: user?.phone || 'Not provided',
    bio: user?.bio || 'Mental wellness enthusiast 🌟',
    joinedDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
  });

  const [stats, setStats] = useState([
    { label: 'Mood Entries', value: 0, icon: <TrendingUp />, color: '#667eea' },
    { label: 'Exercises Done', value: 0, icon: <Favorite />, color: '#f093fb' },
    { label: 'Days Streak', value: 0, icon: <EmojiEvents />, color: '#fbbf24' },
  ]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const [moodEntries, exerciseStats] = await Promise.all([
        moodAPI.getEntries(),
        exerciseAPI.getStats(),
      ]);

      const moodCount = moodEntries.data?.length || 0;
      const exerciseCount = exerciseStats.data?.totalCompleted || 0;
      const streak = calculateStreak(moodEntries.data || []);

      setStats([
        { label: 'Mood Entries', value: moodCount, icon: <TrendingUp />, color: '#667eea' },
        { label: 'Exercises Done', value: exerciseCount, icon: <Favorite />, color: '#f093fb' },
        { label: 'Days Streak', value: streak, icon: <EmojiEvents />, color: '#fbbf24' },
      ]);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const calculateStreak = (entries) => {
    if (!entries || entries.length === 0) return 0;

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak || (streak === 0 && diffDays === 0)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const achievements = [
    {
      title: '7 Day Streak',
      emoji: '🔥',
      unlocked: stats.find(s => s.label === 'Days Streak')?.value >= 7
    },
    {
      title: 'First Entry',
      emoji: '🌟',
      unlocked: stats.find(s => s.label === 'Mood Entries')?.value >= 1
    },
    {
      title: '30 Day Streak',
      emoji: '💎',
      unlocked: stats.find(s => s.label === 'Days Streak')?.value >= 30
    },
    {
      title: 'Meditation Master',
      emoji: '🧘',
      unlocked: stats.find(s => s.label === 'Exercises Done')?.value >= 10
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: alpha('#ffffff', 0.1),
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid white',
                      fontSize: 50,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    }}
                  >
                    {profile.fullName.charAt(0)}
                  </Avatar>
                </motion.div>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {profile.fullName}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                    {profile.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Email />}
                      label={profile.email}
                      sx={{ backgroundColor: alpha('#ffffff', 0.2), color: 'white' }}
                    />
                    <Chip
                      icon={<CalendarToday />}
                      label={`Joined ${profile.joinedDate}`}
                      sx={{ backgroundColor: alpha('#ffffff', 0.2), color: 'white' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha(stat.color, 0.2)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, #ffffff 100%)`,
                    border: `2px solid ${alpha(stat.color, 0.3)}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(stat.color, 0.2),
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(stat.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}

          {/* Achievements */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents sx={{ color: '#fbbf24' }} />
                Achievements
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {achievements.map((achievement, index) => (
                  <Grid item xs={6} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      animate={{
                        opacity: achievement.unlocked ? 1 : 0.4,
                      }}
                    >
                      <Card
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          background: achievement.unlocked
                            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            : theme.palette.background.default,
                          color: achievement.unlocked ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography sx={{ fontSize: 40, mb: 1 }}>{achievement.emoji}</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {achievement.title}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Edit Profile */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Profile Information
                </Typography>
                <Button
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'contained' : 'outlined'}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Profile;
