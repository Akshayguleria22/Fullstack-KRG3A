package com.mentalhealth.config;

import com.mentalhealth.model.Exercise;
import com.mentalhealth.model.User;
import com.mentalhealth.repository.ExerciseRepository;
import com.mentalhealth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Create admin user if not exists
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@mentalhealth.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Administrator")
                        .roles(Set.of(User.Role.ROLE_ADMIN, User.Role.ROLE_USER))
                        .active(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created: username=admin, password=admin123");
            }
            
            // Create default counselor if not exists
            if (!userRepository.existsByUsername("counselor")) {
                User counselor = User.builder()
                        .username("counselor")
                        .email("counselor@mentalhealth.com")
                        .password(passwordEncoder.encode("counselor123"))
                        .fullName("Default Counselor")
                        .roles(Set.of(User.Role.ROLE_COUNSELOR, User.Role.ROLE_USER))
                        .active(true)
                        .build();
                userRepository.save(counselor);
                System.out.println("Counselor user created: username=counselor, password=counselor123");
            }
            
            // Initialize exercises if collection is empty
            if (exerciseRepository.count() == 0) {
                initializeExercises();
                System.out.println("Sample exercises initialized");
            }
        };
    }
    
    private void initializeExercises() {
        Exercise[] exercises = {
            Exercise.builder()
                .title("5-Minute Breathing Exercise")
                .description("A simple breathing technique to reduce stress and anxiety")
                .type(Exercise.ExerciseType.BREATHING)
                .durationMinutes(5)
                .difficulty(Exercise.DifficultyLevel.BEGINNER)
                .instructions("Find a comfortable position. Close your eyes. Breathe in slowly through your nose for 4 counts, hold for 4 counts, and exhale through your mouth for 6 counts.")
                .steps(new String[]{
                    "Sit or lie down in a comfortable position",
                    "Close your eyes and relax your shoulders",
                    "Breathe in slowly through your nose for 4 seconds",
                    "Hold your breath for 4 seconds",
                    "Exhale slowly through your mouth for 6 seconds",
                    "Repeat for 5 minutes"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Mindful Meditation")
                .description("Practice being present in the moment")
                .type(Exercise.ExerciseType.MEDITATION)
                .durationMinutes(10)
                .difficulty(Exercise.DifficultyLevel.BEGINNER)
                .instructions("Sit comfortably with your back straight. Focus on your breath and observe your thoughts without judgment.")
                .steps(new String[]{
                    "Find a quiet space and sit comfortably",
                    "Set a timer for 10 minutes",
                    "Close your eyes and focus on your breathing",
                    "Notice thoughts as they arise without judgment",
                    "Gently return focus to your breath when distracted",
                    "End with a few deep breaths and open your eyes slowly"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Body Scan Relaxation")
                .description("Progressive muscle relaxation technique")
                .type(Exercise.ExerciseType.MEDITATION)
                .durationMinutes(15)
                .difficulty(Exercise.DifficultyLevel.INTERMEDIATE)
                .instructions("Lie down comfortably. Systematically focus on different parts of your body, releasing tension.")
                .steps(new String[]{
                    "Lie down in a comfortable position",
                    "Close your eyes and take three deep breaths",
                    "Starting with your toes, tense and relax each muscle group",
                    "Move slowly up through your body",
                    "Notice the difference between tension and relaxation",
                    "End by taking a few deep breaths"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Cognitive Reframing")
                .description("Challenge and reframe negative thoughts")
                .type(Exercise.ExerciseType.CBT)
                .durationMinutes(15)
                .difficulty(Exercise.DifficultyLevel.INTERMEDIATE)
                .instructions("Identify a negative thought, examine the evidence, and create a balanced perspective.")
                .steps(new String[]{
                    "Identify a negative or distressing thought",
                    "Write down the thought and how it makes you feel",
                    "Challenge the thought - is it based on facts?",
                    "Look for alternative explanations",
                    "Create a more balanced, realistic thought",
                    "Notice how your feelings change"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Gratitude Journaling")
                .description("Practice gratitude to improve mental well-being")
                .type(Exercise.ExerciseType.JOURNALING)
                .durationMinutes(10)
                .difficulty(Exercise.DifficultyLevel.BEGINNER)
                .instructions("Write down three things you're grateful for today and why they matter to you.")
                .steps(new String[]{
                    "Get a journal or open a notes app",
                    "Think about your day",
                    "Write down 3 things you're grateful for",
                    "For each item, write why it's meaningful",
                    "Reflect on how these things impact your life",
                    "Make this a daily practice"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Gentle Yoga Stretch")
                .description("Simple yoga poses to release physical and mental tension")
                .type(Exercise.ExerciseType.PHYSICAL)
                .durationMinutes(15)
                .difficulty(Exercise.DifficultyLevel.BEGINNER)
                .instructions("Perform gentle stretches and yoga poses to connect mind and body.")
                .steps(new String[]{
                    "Find a quiet space with a yoga mat",
                    "Start with child's pose for 2 minutes",
                    "Move into cat-cow stretches",
                    "Practice downward dog",
                    "End with corpse pose for relaxation",
                    "Focus on your breath throughout"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Progressive Muscle Relaxation")
                .description("Systematically tense and relax muscle groups")
                .type(Exercise.ExerciseType.PHYSICAL)
                .durationMinutes(20)
                .difficulty(Exercise.DifficultyLevel.BEGINNER)
                .instructions("Tense each muscle group for 5 seconds, then release and notice the relaxation.")
                .steps(new String[]{
                    "Sit or lie down comfortably",
                    "Start with your feet - tense for 5 seconds, release",
                    "Move to calves, thighs, abdomen, etc.",
                    "Continue up through your entire body",
                    "Notice the feeling of relaxation in each area",
                    "End with a full body scan"
                })
                .active(true)
                .build(),
                
            Exercise.builder()
                .title("Loving-Kindness Meditation")
                .description("Cultivate compassion for yourself and others")
                .type(Exercise.ExerciseType.MEDITATION)
                .durationMinutes(12)
                .difficulty(Exercise.DifficultyLevel.INTERMEDIATE)
                .instructions("Send positive wishes to yourself and others through guided meditation.")
                .steps(new String[]{
                    "Sit comfortably and close your eyes",
                    "Start by directing kind wishes to yourself",
                    "Repeat phrases like 'May I be happy, may I be healthy'",
                    "Extend these wishes to loved ones",
                    "Then to neutral people, and even difficult people",
                    "End by extending kindness to all beings"
                })
                .active(true)
                .build()
        };
        
        exerciseRepository.saveAll(java.util.Arrays.asList(exercises));
    }
}
