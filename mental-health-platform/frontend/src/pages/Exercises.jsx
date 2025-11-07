import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  LinearProgress,
} from '@mui/material';
import {
  SelfImprovement,
  Air,
  Psychology,
  FitnessCenter,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { exerciseAPI } from '../services/api';

const exerciseIcons = {
  MEDITATION: <SelfImprovement />,
  BREATHING: <Air />,
  CBT: <Psychology />,
  PHYSICAL: <FitnessCenter />,
};

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progressId, setProgressId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completionDialog, setCompletionDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchExercises();
    fetchStats();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await exerciseAPI.getAll();
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await exerciseAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStartExercise = async (exercise) => {
    try {
      const response = await exerciseAPI.startExercise(exercise.id);
      setProgressId(response.data.id);
      setSelectedExercise(exercise);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error starting exercise:', error);
    }
  };

  const handleCompleteExercise = async () => {
    try {
      await exerciseAPI.completeExercise(progressId, rating, feedback);
      setDialogOpen(false);
      setCompletionDialog(false);
      setRating(5);
      setFeedback('');
      fetchStats();
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Guided Exercises 🧘
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Practice mindfulness and improve your mental wellness
        </Typography>
      </Box>

      {stats && (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalCompleted}
              </Typography>
              <Typography variant="body2">Exercises Completed</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalStarted}
              </Typography>
              <Typography variant="body2">Total Started</Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {exercises.map((exercise, index) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s',
                  },
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 80,
                    color: 'white',
                  }}
                >
                  {exerciseIcons[exercise.type] || <SelfImprovement />}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={exercise.type}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${exercise.durationMinutes} min`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {exercise.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exercise.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleStartExercise(exercise)}
                  >
                    Start Exercise
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedExercise?.title}</DialogTitle>
        <DialogContent>
          <Typography paragraph>{selectedExercise?.description}</Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Instructions:
          </Typography>
          <Typography paragraph>{selectedExercise?.instructions}</Typography>
          {selectedExercise?.steps && (
            <Box sx={{ mt: 2 }}>
              {selectedExercise.steps.map((step, i) => (
                <Typography key={i} paragraph>
                  {i + 1}. {step}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setDialogOpen(false);
              setCompletionDialog(true);
            }}
          >
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={completionDialog}
        onClose={() => setCompletionDialog(false)}
      >
        <DialogTitle>How was the exercise?</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2, textAlign: 'center' }}>
            <Typography gutterBottom>Rate your experience:</Typography>
            <Rating
              value={rating}
              onChange={(e, value) => setRating(value)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Feedback (Optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCompleteExercise}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Exercises;
