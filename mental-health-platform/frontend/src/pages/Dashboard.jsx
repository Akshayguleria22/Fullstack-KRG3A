import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  SentimentVerySatisfied,
  FitnessCenter,
  Chat as ChatIcon,
  TrendingUp,
  LocalFireDepartment,
  EmojiEvents,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { moodAPI, exerciseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const [moodData, setMoodData] = useState(null);
  const [exerciseStats, setExerciseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mood, exercise] = await Promise.all([
        moodAPI.getAnalytics(7),
        exerciseAPI.getStats(),
      ]);
      setMoodData(mood.data);
      setExerciseStats(exercise.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: moodData?.entries?.slice(0, 7).reverse().map(e => 
      new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Mood Score',
        data: moodData?.entries?.slice(0, 7).reverse().map(e => e.moodScore) || [],
        borderColor: mode === 'dark' ? '#8b9dff' : '#667eea',
        backgroundColor: mode === 'dark' 
          ? 'rgba(139, 157, 255, 0.1)' 
          : 'rgba(102, 126, 234, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderColor: mode === 'dark' ? '#8b9dff' : '#667eea',
        pointBorderWidth: 2,
      },
    ],
  };

  const moodDistributionData = {
    labels: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'],
    datasets: [
      {
        data: [5, 10, 20, 35, 30],
        backgroundColor: [
          'rgba(244, 67, 54, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(255, 235, 59, 0.8)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(33, 150, 243, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const cards = [
    {
      title: 'Mood Tracker',
      icon: <SentimentVerySatisfied sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: moodData?.averageMood?.toFixed(1) || '0',
      subtitle: 'Average mood this week',
      action: () => navigate('/mood'),
    },
    {
      title: 'Exercises',
      icon: <FitnessCenter sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      value: exerciseStats?.totalCompleted || 0,
      subtitle: 'Completed exercises',
      action: () => navigate('/exercises'),
    },
    {
      title: 'Chat Support',
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      value: 'Available',
      subtitle: 'Talk to a counselor',
      action: () => navigate('/chat'),
    },
    {
      title: 'Wellness Trend',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      value: moodData?.moodTrend || 'neutral',
      subtitle: 'Your progress',
      action: () => navigate('/wellness'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Floating background particles */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${
                ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)', 'rgba(240, 147, 251, 0.1)'][i % 3]
              } 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #8b9dff 0%, #9d7ec4 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Welcome back, {user?.username}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your mental wellness journey
            </Typography>
          </motion.div>
        </Box>

        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: mode === 'dark'
                ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(255, 159, 64, 0.1) 100%)'
                : 'linear-gradient(135deg, #ff6b00 0%, #ff9f40 100%)',
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(255, 107, 0, 0.3)' : 'transparent',
              color: mode === 'dark' ? 'text.primary' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <LocalFireDepartment sx={{ fontSize: 50 }} />
            </motion.div>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {streak} Day Streak! 🔥
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Keep it up! You're on a roll
              </Typography>
            </Box>
            <Chip
              icon={<EmojiEvents />}
              label="Amazing!"
              sx={{
                fontWeight: 'bold',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                color: mode === 'dark' ? 'text.primary' : 'white',
              }}
            />
          </Paper>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: mode === 'dark'
                      ? `${card.gradient.replace(/\d\.\d+/g, '0.15')}`
                      : card.gradient,
                    color: mode === 'dark' ? 'text.primary' : 'white',
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    boxShadow: mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transform: 'perspective(1000px) rotateX(0deg)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: mode === 'dark'
                        ? '0 12px 48px rgba(0, 0, 0, 0.5)'
                        : '0 12px 48px rgba(0, 0, 0, 0.2)',
                      transform: 'perspective(1000px) rotateX(2deg) scale(1.02)',
                    },
                  }}
                  onClick={card.action}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {card.title}
                      </Typography>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {card.icon}
                      </motion.div>
                    </Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: mode === 'dark' ? 0.7 : 0.9 }}>
                      {card.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}

          {/* Mood Trend Chart */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  boxShadow: mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Mood Trend (Last 7 Days)
                </Typography>
                {moodData?.entries && moodData.entries.length > 0 ? (
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                          titleColor: mode === 'dark' ? '#fff' : '#000',
                          bodyColor: mode === 'dark' ? '#fff' : '#000',
                          borderColor: mode === 'dark' ? '#667eea' : '#667eea',
                          borderWidth: 1,
                          padding: 12,
                          cornerRadius: 8,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                          grid: {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          },
                          ticks: {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                        x: {
                          grid: {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          },
                          ticks: {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      No mood data yet. Start tracking your mood!
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #64408a 100%)',
                        },
                      }}
                      onClick={() => navigate('/mood')}
                    >
                      Track Mood
                    </Button>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Mood Distribution Chart */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  boxShadow: mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Mood Distribution
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Doughnut
                    data={moodDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                            padding: 10,
                            font: {
                              size: 11,
                            },
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SentimentVerySatisfied />}
                      onClick={() => navigate('/mood')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: mode === 'dark' ? 'rgba(102, 126, 234, 0.5)' : '#667eea',
                        color: mode === 'dark' ? '#8b9dff' : '#667eea',
                        '&:hover': {
                          borderColor: '#667eea',
                          backgroundColor: mode === 'dark'
                            ? 'rgba(102, 126, 234, 0.1)'
                            : 'rgba(102, 126, 234, 0.05)',
                        },
                      }}
                    >
                      Log Mood
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FitnessCenter />}
                      onClick={() => navigate('/exercises')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: mode === 'dark' ? 'rgba(240, 147, 251, 0.5)' : '#f093fb',
                        color: mode === 'dark' ? '#f093fb' : '#f5576c',
                        '&:hover': {
                          borderColor: '#f093fb',
                          backgroundColor: mode === 'dark'
                            ? 'rgba(240, 147, 251, 0.1)'
                            : 'rgba(240, 147, 251, 0.05)',
                        },
                      }}
                    >
                      Start Exercise
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      onClick={() => navigate('/chat')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: mode === 'dark' ? 'rgba(79, 172, 254, 0.5)' : '#4facfe',
                        color: mode === 'dark' ? '#4facfe' : '#00f2fe',
                        '&:hover': {
                          borderColor: '#4facfe',
                          backgroundColor: mode === 'dark'
                            ? 'rgba(79, 172, 254, 0.1)'
                            : 'rgba(79, 172, 254, 0.05)',
                        },
                      }}
                    >
                      Chat Now
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EmojiEvents />}
                      onClick={() => navigate('/profile')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: mode === 'dark' ? 'rgba(67, 233, 123, 0.5)' : '#43e97b',
                        color: mode === 'dark' ? '#43e97b' : '#38f9d7',
                        '&:hover': {
                          borderColor: '#43e97b',
                          backgroundColor: mode === 'dark'
                            ? 'rgba(67, 233, 123, 0.1)'
                            : 'rgba(67, 233, 123, 0.05)',
                        },
                      }}
                    >
                      View Achievements
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
