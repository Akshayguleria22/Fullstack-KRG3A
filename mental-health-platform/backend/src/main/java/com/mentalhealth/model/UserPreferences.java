package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    @Builder.Default
    private Boolean notificationsEnabled = true;
    
    @Builder.Default
    private Boolean emailNotifications = true;
    
    @Builder.Default
    private String theme = "light";
    
    @Builder.Default
    private String language = "en";
    
    private String timezone;
    
    @Builder.Default
    private Boolean shareDataForResearch = false;
}
