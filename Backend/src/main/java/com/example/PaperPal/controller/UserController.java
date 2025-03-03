package com.example.PaperPal.controller;

import com.example.PaperPal.entity.UserDto;
import com.example.PaperPal.entity.Users;
import com.example.PaperPal.jwt.JWTService;
import com.example.PaperPal.repository.DoubtsRepository;
import com.example.PaperPal.repository.UserRepository;
import com.example.PaperPal.service.OtpService;
import com.example.PaperPal.service.UserDetailServiceImpl;
import com.example.PaperPal.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final OtpService otpService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final ConcurrentHashMap<String, UserDto> storeCode = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Boolean> otpVerifed = new ConcurrentHashMap<>();
    private AuthenticationManager authenticationManager;
    private final DoubtsRepository doubtsRepository;
    private final JavaMailSender javaMailSender;
    private final UserDetailServiceImpl userDetailServiceImpl;
    private JWTService jwtService;


    public UserController(UserService userService, OtpService otpService, UserRepository userRepository, DoubtsRepository doubtsRepository, AuthenticationManager authenticationManager, JavaMailSender javaMailSender, UserDetailServiceImpl userDetailServiceImpl, JWTService jwtService) {
        this.userService = userService;
        this.otpService = otpService;
        this.userRepository = userRepository;
        this.authenticationManager=authenticationManager;
        this.doubtsRepository = doubtsRepository;
        this.javaMailSender = javaMailSender;
        this.userDetailServiceImpl = userDetailServiceImpl;
        this.jwtService = jwtService;
    }

    @PostMapping("/redirectHome")
    public ResponseEntity<String> register(@RequestBody UserDto user) throws MessagingException {
        log.info("req received");
        try {
            String uniqueCode = bCryptPasswordEncoder.encode(user.getEmail());
            String request = ServletUriComponentsBuilder.fromCurrentRequest().path("?code=" + uniqueCode).build().toString().replace("/user/redirectHome", "/user/activate");
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setTo(user.getEmail());
            mimeMessageHelper.setText(
                    "<!DOCTYPE html>\n" +
                            "<html lang=\"en\">\n" +
                            "<head>\n" +
                            "    <meta charset=\"UTF-8\">\n" +
                            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                            "    <title>Registration Confirmation</title>\n" +
                            "    <style>\n" +
                            "        body {\n" +
                            "            font-family: Arial, sans-serif;\n" +
                            "            background-color: #f4f4f4;\n" +
                            "            color: #333;\n" +
                            "            margin: 0;\n" +
                            "            padding: 0;\n" +
                            "        }\n" +
                            "        .container {\n" +
                            "            max-width: 600px;\n" +
                            "            margin: 20px auto;\n" +
                            "            padding: 20px;\n" +
                            "            background-color: #ffffff;\n" +
                            "            border-radius: 8px;\n" +
                            "            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n" +
                            "        }\n" +
                            "        .header {\n" +
                            "            text-align: center;\n" +
                            "            padding: 10px 0;\n" +
                            "        }\n" +
                            "        .header h1 {\n" +
                            "            color: #007bff;\n" +
                            "        }\n" +
                            "        .content {\n" +
                            "            font-size: 16px;\n" +
                            "            line-height: 1.6;\n" +
                            "            color: #333;\n" +
                            "        }\n" +
                            "        .content p {\n" +
                            "            margin: 0 0 10px;\n" +
                            "        }\n" +
                            "        .button-container {\n" +
                            "            text-align: center;\n" +
                            "            margin: 20px 0;\n" +
                            "        }\n" +
                            "        .button {\n" +
                            "            display: inline-block;\n" +
                            "            padding: 12px 24px;\n" +
                            "            color: #007bff;\n" +
                            "            background-color: #f4f4f4;\n" +
                            "            text-decoration: none;\n" +
                            "            border-radius: 5px;\n" +
                            "            font-weight: bold;\n" +
                            "        }\n" +
                            "        .footer {\n" +
                            "            font-size: 12px;\n" +
                            "            color: #666;\n" +
                            "            text-align: center;\n" +
                            "            margin-top: 20px;\n" +
                            "        }\n" +
                            "    </style>\n" +
                            "</head>\n" +
                            "<body>\n" +
                            "\n" +
                            "<div class=\"container\">\n" +
                            "    <div class=\"header\">\n" +
                            "        <h1>Welcome to PaperPal!</h1>\n" +
                            "    </div>\n" +
                            "    <div class=\"content\">\n" +
                            "        <p>Hello " + user.getFirstName() + " " + user.getLastName() + ",</p>\n" +
                            "        <p>Thank you for registering with us. Please confirm your email address by clicking the button below:</p>\n" +
                            "        <div class=\"button-container\">\n" +
                            "            <a href=\"" + request + "\" class=\"button\">Confirm Your Email</a>\n" +
                            "        </div>\n" +
                            "        <p>If you didn't create an account with us, please ignore this email.</p>\n" +
                            "        <p>Thank you!<br>PaperPal Team</p>\n" +
                            "    </div>\n" +
                            "    <div class=\"footer\">\n" +
                            "        <p>&copy; 2025 PaperPal. All rights reserved.</p>\n" +
                            "    </div>\n" +
                            "</div>\n" +
                            "\n" +
                            "</body>\n" +
                            "</html>\n",
                    true
            );

            mimeMessageHelper.setSubject("Registration Confirmation");
            userService.sendMail(mimeMessage);
            log.info("New Thread Started and response sent.....");
            storeCode.put(uniqueCode, user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, String> userData, HttpServletResponse response, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userData.get("email"), userData.get("password")));

        if (authentication.isAuthenticated()) {
            String name = userRepository.findByEmail(userData.get("email")).getUserName();
            String jwt = jwtService.generateToken(name);

            if (request.getCookies() != null) {
                log.info(Arrays.toString(request.getCookies()));
            } else {
                log.info("No cookies in request");
            }
            response.addHeader("Set-Cookie",
                    "jwt=" + jwt + "; Path=/; HttpOnly; Secure; Max-Age=1800; SameSite=None; Partitioned");

            return new ResponseEntity<>(name, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    @GetMapping("/logout")
    public ResponseEntity  logout(HttpServletResponse response,HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    cookie.setMaxAge(0);
                    cookie.setValue(null);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                    break;
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/changePassword")
    public ResponseEntity changePassword(@RequestParam("email") String email, HttpServletResponse response) {
        try {
            otpService.sendOtp(email);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {

            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @PostMapping("/otp")
    public ResponseEntity validateOtp(@RequestParam("email") String email,
                                      @RequestParam("otp") String otp,
                                      HttpServletResponse response,
                                      HttpServletRequest request) throws IOException {
        if (otpService.validateOtp(email, otp)) {
            log.info("Checking otp...");

            otpVerifed.put(email, true);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            otpVerifed.put(email, false);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/setNewPassword")
    public ResponseEntity setNewPassword(@RequestBody UserDto userDto, HttpSession session) {

        log.info(userDto.toString());
        if (otpVerifed.get(userDto.getEmail())) {
            try {
                Users user = userRepository.findByEmail(userDto.getEmail());
                user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
                userRepository.save(user);
                log.info("password updated successfully");
                otpVerifed.remove(userDto.getEmail());
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
        log.info("password not updated...");
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/activate")
    public ResponseEntity checkActivation(@RequestParam String code, HttpServletResponse response) throws IOException {
        UserDto userDto = storeCode.get(code);
        System.out.println(userDto);
        Boolean isRegistered = false;
        log.info("activation req got..");
        if (userDto != null) {
            isRegistered = userService.registerUser(
                    Users.builder()
                            .userName(userDto.getFirstName() + " " + userDto.getLastName())
                            .password(userDto.getPassword())
                            .email(userDto.getEmail())
                            .build()
            );
            storeCode.remove(code);
        }
        if (isRegistered) {
            // If registration is successful
            log.info("User Registered");
            URI redirectUri = URI.create("http://localhost:8080");
            return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
        } else {
            // If email/username is already taken, return error
            log.info("User not registered");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Email or Username already registered.....");
        }
    }
}

