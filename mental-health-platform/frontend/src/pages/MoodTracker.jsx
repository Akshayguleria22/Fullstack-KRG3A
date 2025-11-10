import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { Delete, TrendingUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { moodAPI } from '../services/api';

const moodEmojis = [
  { value: 1, label: 'Very Bad', emoji: '😢', color: '#ef4444', bgColor: '#fef2f2' },
  { value: 2, label: 'Bad', emoji: '😟', color: '#f59e0b', bgColor: '#fffbeb' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#eab308', bgColor: '#fefce8' },
  { value: 4, label: 'Good', emoji: '🙂', color: '#22c55e', bgColor: '#f0fdf4' },
  { value: 5, label: 'Very Good', emoji: '😄', color: '#10b981', bgColor: '#ecfdf5' },
];

const MoodTracker = () => {
  const theme = useTheme();
  const [selectedMood, setSelectedMood] = useState(3);
  const [notes, setNotes] = useState('');
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await moodAPI.getEntries();
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedMoodData = moodEmojis.find(m => m.value === selectedMood);

      await moodAPI.createEntry({
        date: new Date().toISOString().split('T')[0],
        moodScore: selectedMood,
        moodLabel: selectedMoodData.label,
        notes,
        journalEntry: journal,
      });

      setNotes('');
      setJournal('');
      setSelectedMood(3);
      fetchEntries();
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await moodAPI.deleteEntry(id);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Mood Tracker
          </Typography>
          <Box
            component={motion.div}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            sx={{ fontSize: 40 }}
          >
            📊
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Paper 
                sx={{ 
                  p: 4, 
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="primary" />
                  How are you feeling today?
                </Typography>

                <Box sx={{ my: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    {moodEmojis.map((mood) => (
                      <motion.div
                        key={mood.value}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          scale: selectedMood === mood.value ? 1.3 : 1,
                          y: selectedMood === mood.value ? -10 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Box
                          onClick={() => setSelectedMood(mood.value)}
                          sx={{
                            fontSize: 50,
                            cursor: 'pointer',
                            padding: 2,
                            borderRadius: '50%',
                            backgroundColor: selectedMood === mood.value 
                              ? alpha(mood.color, 0.2)
                              : 'transparent',
                            border: selectedMood === mood.value 
                              ? `3px solid ${mood.color}`
                              : '3px solid transparent',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {mood.emoji}
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      label={moodEmojis.find(m => m.value === selectedMood)?.label}
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        px: 3,
                        py: 2.5,
                        backgroundColor: moodEmojis.find(m => m.value === selectedMood)?.bgColor,
                        color: moodEmojis.find(m => m.value === selectedMood)?.color,
                        border: `2px solid ${moodEmojis.find(m => m.value === selectedMood)?.color}`,
                      }}
                    />
                  </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Quick Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind?"
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.primary.main, 0.05)
                          : alpha(theme.palette.primary.main, 0.02),
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Journal Entry (Optional)"
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    placeholder="Write about your day..."
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.primary.main, 0.05)
                          : alpha(theme.palette.primary.main, 0.02),
                      }
                    }}
                  />

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        mt: 2, 
                        py: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                        }
                      }}
                    >
                      {loading ? 'Saving...' : '✨ Save Mood Entry'}
                    </Button>
                  </motion.div>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                maxHeight: 650, 
                overflow: 'auto',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.primary.main,
                  borderRadius: '10px',
                },
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📝 Recent Entries
              </Typography>

              {entries.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Typography sx={{ fontSize: 60, mb: 2 }}>😊</Typography>
                  </motion.div>
                  <Typography color="text.secondary">
                    No entries yet. Start tracking your mood!
                  </Typography>
                </Box>
              ) : (
                <AnimatePresence>
                  {entries.map((entry, index) => {
                    const entryMood = moodEmojis.find(m => m.value === entry.moodScore) || moodEmojis[2];
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card 
                          sx={{ 
                            mb: 2,
                            background: theme.palette.mode === 'dark'
                              ? `linear-gradient(135deg, ${alpha(entryMood.color, 0.1)} 0%, ${alpha(entryMood.color, 0.05)} 100%)`
                              : `linear-gradient(135deg, ${entryMood.bgColor} 0%, #ffffff 100%)`,
                            border: `2px solid ${alpha(entryMood.color, 0.2)}`,
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Box sx={{ fontSize: 30 }}>{entryMood.emoji}</Box>
                                  <Chip
                                    label={entry.moodLabel}
                                    size="small"
                                    sx={{
                                      backgroundColor: entryMood.color,
                                      color: 'white',
                                      fontWeight: 600,
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(entry.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </Typography>
                                </Box>
                                {entry.notes && (
                                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    💭 {entry.notes}
                                  </Typography>
                                )}
                                {entry.journalEntry && (
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    📖 {entry.journalEntry.substring(0, 100)}
                                    {entry.journalEntry.length > 100 && '...'}
                                  </Typography>
                                )}
                              </Box>
                              <motion.div whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(entry.id)}
                                  sx={{
                                    color: '#ef4444',
                                    '&:hover': {
                                      backgroundColor: alpha('#ef4444', 0.1),
                                    }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </motion.div>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default MoodTracker;
