package com.example.PaperPal.service;

import com.example.PaperPal.entity.OtpDetails;
import com.example.PaperPal.entity.Users;
import com.example.PaperPal.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {
    private final UserRepository userRepository;
    private JavaMailSender mailSender;
    private Map<String,OtpDetails> otpCache = new ConcurrentHashMap<>();
    private UserService userService;

    @Autowired
    public OtpService(JavaMailSender mailSender, UserRepository userRepository, UserService userService) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public OtpDetails sendOtp(String email) throws MessagingException {
        String otp = "";
        for (int i = 0; i < 6; i++) {
            int digit = (int) (Math.random() * 10);
            otp = otp + digit;
        }

        Users user=userRepository.findByEmail(email);
        Date now = new Date();


        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);


        calendar.add(Calendar.MINUTE, 2);


        Date expiryTime = calendar.getTime();

       OtpDetails otpDetails= OtpDetails.builder()
                .otpId(user.getUserName()+user.getEmail())
                .otp(otp)
                .sendTime(now)
                .expiryTime(expiryTime).build() ;


        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String emailContent = "<html><body>" +
                "Dear User,<br><br>" +
                "We received a request to reset your password.<br><br>" +
                "Your OTP is: <b>" + otp + "</b><br><br>" +
                "This OTP is valid for 2 minutes.<br><br>" +
                "Thank you,<br>" +
                "The PaperPal Team" +
                "</body></html>";

        helper.setTo(email);
        helper.setSubject("Request for changing the password.");
        helper.setText(emailContent, true); // true indicates HTML

        userService.sendMail(message);
        log.info(otpDetails.getOtp());
        otpCache.put(otpDetails.getOtpId(),otpDetails);
        return otpDetails;
    }


    public boolean validateOtp(String email,String otp) {

        Users user=userRepository.findByEmail(email);
        String otpId=user.getUserName()+user.getEmail();

        OtpDetails otpDetails=otpCache.get(otpId);
        log.info(otpDetails.getOtp());
        if(otpDetails.getExpiryTime().after(new Date())
                && otpDetails.getOtp().equals(otp)){
            otpCache.remove(otpId);
            return true;

            }else{
                return false;
            }
        }

}
