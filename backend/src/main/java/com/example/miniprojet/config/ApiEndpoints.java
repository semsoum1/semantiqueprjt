package com.example.miniprojet.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;

@Configuration
public class ApiEndpoints {
    public static final String API_BASE_URL = "/api";

    public static final String AUTH_BASE_URL = API_BASE_URL + "/auth";

    public static final String LIVRES_BASE_URL = API_BASE_URL + "/livres";
}