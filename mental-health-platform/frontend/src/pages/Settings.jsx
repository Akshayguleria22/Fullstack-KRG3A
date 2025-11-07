import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  VolumeUp,
  DeleteOutline,
  Logout,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    moodReminders: true,
    soundEffects: true,
    language: 'en',
    dataSharing: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: <Palette />,
      color: '#667eea',
      settings: [
        {
          label: 'Dark Mode',
          description: 'Toggle dark/light theme',
          value: mode === 'dark',
          onChange: toggleTheme,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      color: '#f093fb',
      settings: [
        {
          label: 'Email Notifications',
          description: 'Receive updates via email',
          value: settings.emailNotifications,
          onChange: () => setSettings({ ...settings, emailNotifications: !settings.emailNotifications }),
          type: 'switch',
        },
        {
          label: 'Push Notifications',
          description: 'Browser notifications',
          value: settings.pushNotifications,
          onChange: () => setSettings({ ...settings, pushNotifications: !settings.pushNotifications }),
          type: 'switch',
        },
        {
          label: 'Daily Mood Reminders',
          description: 'Get reminded to log your mood',
          value: settings.moodReminders,
          onChange: () => setSettings({ ...settings, moodReminders: !settings.moodReminders }),
          type: 'switch',
        },
      ],
    },
    {
      title: 'Sound & Language',
      icon: <VolumeUp />,
      color: '#22c55e',
      settings: [
        {
          label: 'Sound Effects',
          description: 'Enable app sounds',
          value: settings.soundEffects,
          onChange: () => setSettings({ ...settings, soundEffects: !settings.soundEffects }),
          type: 'switch',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: <Security />,
      color: '#ef4444',
      settings: [
        {
          label: 'Anonymous Data Sharing',
          description: 'Help improve the app',
          value: settings.dataSharing,
          onChange: () => setSettings({ ...settings, dataSharing: !settings.dataSharing }),
          type: 'switch',
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          ⚙️ Settings
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {settingsSections.map((section, sectionIndex) => (
            <Grid item xs={12} key={sectionIndex}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha(section.color, 0.1)} 0%, ${alpha(section.color, 0.02)} 100%)`
                      : `linear-gradient(135deg, ${alpha(section.color, 0.05)} 0%, #ffffff 100%)`,
                    border: `2px solid ${alpha(section.color, 0.2)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(section.color, 0.2),
                        color: section.color,
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {section.title}
                    </Typography>
                  </Box>

                  {section.settings.map((setting, index) => (
                    <Box key={index}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" fontWeight="600">
                            {setting.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {setting.description}
                          </Typography>
                        </Box>
                        {setting.type === 'switch' && (
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Switch
                              checked={setting.value}
                              onChange={setting.onChange}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: section.color,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: section.color,
                                },
                              }}
                            />
                          </motion.div>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </motion.div>
            </Grid>
          ))}

          {/* Language Selection */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Language color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Language Preferences
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  label="Language"
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                  <MenuItem value="en">🇺🇸 English</MenuItem>
                  <MenuItem value="es">🇪🇸 Spanish</MenuItem>
                  <MenuItem value="fr">🇫🇷 French</MenuItem>
                  <MenuItem value="de">🇩🇪 German</MenuItem>
                  <MenuItem value="ja">🇯🇵 Japanese</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Danger Zone */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, #ffffff 100%)',
                border: '2px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>
                ⚠️ Danger Zone
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<DeleteOutline />}
                  >
                    Delete Account
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Settings;
