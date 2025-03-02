package com.example.PaperPal.jwt;

import com.example.PaperPal.entity.Users;
import com.example.PaperPal.repository.UserRepository;
import com.example.PaperPal.service.UserDetailServiceImpl;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private JWTService jwtService;


    public JWTFilter(JWTService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = null;
        String token = null;
        String userName = null;

        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (c.getName().equals("jwt")) {
                    authHeader = c.getValue();
                    break;
                }
            }
        }
        log.info(authHeader);
        if (authHeader != null) {
            token = authHeader;
            try {
                userName = jwtService.extractUserName(token);
            }catch (Exception e){
                log.error("Wrong Signature");
            }

        }
        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            Users user = userRepository.findByUserName(userName);

            UserDetails userDetails = User.builder().username(user.getUserName())
                    .password(user.getPassword())
                    .build();

                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, null);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/user/") ||
                path.equals("/health") ||
                path.startsWith("/swagger-ui/") ||
                path.startsWith("/v3/");
    }
}
