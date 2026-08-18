package com.taskflow.auth.service;

import com.taskflow.auth.dto.LoginRequestDTO;
import com.taskflow.auth.dto.RegisterRequestDTO;

public interface AuthService {

    String register(RegisterRequestDTO request);

    String login(LoginRequestDTO request);
}