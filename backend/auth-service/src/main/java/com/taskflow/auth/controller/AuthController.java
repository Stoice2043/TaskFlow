package com.taskflow.auth.controller;

import com.taskflow.auth.dto.LoginRequestDTO;
import com.taskflow.auth.dto.RegisterRequestDTO;
import com.taskflow.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        String message = authService.register(request);

        if (message.equals("Email already registered")) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(message);
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(message);
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @Valid @RequestBody LoginRequestDTO request) {

        String token = authService.login(request);

        return ResponseEntity.ok(token);
    }
}