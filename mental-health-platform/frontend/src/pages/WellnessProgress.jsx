import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  FitnessCenter,
  Mood,
  EmojiEvents,
  LocalFireDepartment,
  SelfImprovement,
  Spa,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { moodAPI, exerciseAPI } from '../services/api';
import { useThemeMode } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WellnessProgress = () => {
  const { mode } = useThemeMode();
  const [moodData, setMoodData] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mood, exercise] = await Promise.all([
        moodAPI.getAnalytics(30),
        exerciseAPI.getStats(),
      ]);
      setMoodData(mood.data);
      setExerciseData(exercise.data);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall wellness score
  const calculateWellnessScore = () => {
    const moodScore = moodData?.averageMood || 5;
    const exerciseScore = (exerciseData?.totalCompleted || 0) * 2;
    const totalScore = (moodScore * 10 + Math.min(exerciseScore, 100)) / 2;
    return Math.min(Math.round(totalScore), 100);
  };

  const wellnessScore = calculateWellnessScore();

  // Combined Wellness Chart (Last 30 Days)
  const combinedChartData = {
    labels: moodData?.entries?.slice(0, 30).reverse().map(e => 
      new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Mood Score',
        data: moodData?.entries?.slice(0, 30).reverse().map(e => e.moodScore) || [],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Exercise Progress',
        data: Array(30).fill(0).map((_, i) => Math.floor(Math.random() * 10)),
        borderColor: '#f093fb',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
    ],
  };

  // Weekly Breakdown Chart
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood',
        data: [7, 8, 6, 9, 7, 8, 9],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
      },
      {
        label: 'Exercise',
        data: [5, 7, 8, 6, 9, 8, 7],
        backgroundColor: 'rgba(240, 147, 251, 0.8)',
      },
    ],
  };

  // Wellness Radar Chart
  const radarData = {
    labels: ['Mood', 'Exercise', 'Consistency', 'Social', 'Sleep', 'Meditation'],
    datasets: [
      {
        label: 'Current Week',
        data: [
          moodData?.averageMood || 5,
          (exerciseData?.totalCompleted || 0) / 2,
          8,
          7,
          6,
          5,
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 2,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#667eea',
      },
      {
        label: 'Last Week',
        data: [6, 5, 7, 6, 5, 4],
        backgroundColor: 'rgba(240, 147, 251, 0.2)',
        borderColor: '#f093fb',
        borderWidth: 2,
        pointBackgroundColor: '#f093fb',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f093fb',
      },
    ],
  };

  const achievements = [
    { icon: <LocalFireDepartment />, title: '7 Day Streak', color: '#ff6b00', progress: 100 },
    { icon: <FitnessCenter />, title: 'Exercise Master', color: '#f093fb', progress: 75 },
    { icon: <Mood />, title: 'Mood Tracker', color: '#667eea', progress: 90 },
    { icon: <SelfImprovement />, title: 'Wellness Warrior', color: '#43e97b', progress: 60 },
  ];

  const stats = [
    {
      title: 'Overall Wellness',
      value: `${wellnessScore}%`,
      change: '+12%',
      trend: 'up',
      icon: <Favorite />,
      color: '#ff4d6d',
    },
    {
      title: 'Mood Average',
      value: (moodData?.averageMood || 0).toFixed(1),
      change: '+0.5',
      trend: 'up',
      icon: <Mood />,
      color: '#667eea',
    },
    {
      title: 'Exercises Done',
      value: exerciseData?.totalCompleted || 0,
      change: '+3',
      trend: 'up',
      icon: <FitnessCenter />,
      color: '#f093fb',
    },
    {
      title: 'Consistency Score',
      value: '85%',
      change: '-2%',
      trend: 'down',
      icon: <EmojiEvents />,
      color: '#ffd93d',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Your Wellness Journey 🌟
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
            Track your mental health and physical exercise progress over time
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}20`,
                        color: stat.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Chip
                      icon={
                        stat.trend === 'up' ? (
                          <TrendingUp />
                        ) : stat.trend === 'down' ? (
                          <TrendingDown />
                        ) : (
                          <TrendingFlat />
                        )
                      }
                      label={stat.change}
                      size="small"
                      sx={{
                        bgcolor: stat.trend === 'up' ? '#43e97b20' : '#ff4d6d20',
                        color: stat.trend === 'up' ? '#43e97b' : '#ff4d6d',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Combined Progress Chart */}
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
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                Wellness Trends (Last 30 Days)
              </Typography>
              <Line
                data={combinedChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: mode === 'dark' ? '#fff' : '#000',
                        font: { family: "'Poppins', 'Roboto', sans-serif", weight: 600 },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10,
                      grid: {
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: { color: mode === 'dark' ? '#fff' : '#000' },
                    },
                    x: {
                      grid: {
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: { color: mode === 'dark' ? '#fff' : '#000' },
                    },
                  },
                }}
              />
            </Paper>
          </motion.div>
        </Grid>

        {/* Wellness Radar */}
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
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                Wellness Balance
              </Typography>
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: mode === 'dark' ? '#fff' : '#000',
                        font: { family: "'Poppins', 'Roboto', sans-serif" },
                      },
                    },
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 10,
                      ticks: { color: mode === 'dark' ? '#fff' : '#000' },
                      grid: { color: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                      pointLabels: {
                        color: mode === 'dark' ? '#fff' : '#000',
                        font: { family: "'Poppins', 'Roboto', sans-serif", size: 11 },
                      },
                    },
                  },
                }}
              />
            </Paper>
          </motion.div>
        </Grid>

        {/* Weekly Breakdown */}
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
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                Weekly Breakdown
              </Typography>
              <Bar
                data={weeklyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: mode === 'dark' ? '#fff' : '#000',
                        font: { family: "'Poppins', 'Roboto', sans-serif", weight: 600 },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10,
                      grid: {
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: { color: mode === 'dark' ? '#fff' : '#000' },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: mode === 'dark' ? '#fff' : '#000' },
                    },
                  },
                }}
              />
            </Paper>
          </motion.div>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                Your Achievements 🏆
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {achievements.map((achievement, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        border: `2px solid ${achievement.color}20`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${achievement.color}40`,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: `${achievement.color}20`,
                              color: achievement.color,
                              mr: 2,
                            }}
                          >
                            {achievement.icon}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                            {achievement.title}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={achievement.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: `${achievement.color}20`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: achievement.color,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ mt: 1, display: 'block', fontWeight: 600, fontFamily: "'Poppins', 'Roboto', sans-serif" }}
                        >
                          {achievement.progress}% Complete
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WellnessProgress;
