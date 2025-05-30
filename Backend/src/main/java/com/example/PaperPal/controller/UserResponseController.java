package com.example.PaperPal.controller;

import com.example.PaperPal.entity.UserResponse;
import com.example.PaperPal.service.Pdfanalyzer;
import com.example.PaperPal.service.UserResponseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import com.example.PaperPal.records.FileDto;

@RestController
@RequestMapping("/userresponse")
public class UserResponseController {

    private static final Logger log = LoggerFactory.getLogger(UserResponseController.class);
    private final UserResponseService userResponseService;

    private Pdfanalyzer pdfanalyzer;

    public UserResponseController(UserResponseService userResponseService, Pdfanalyzer pdfanalyzer) {
        this.userResponseService = userResponseService;
        this.pdfanalyzer = pdfanalyzer;
    }

    @PostMapping
    public ResponseEntity sendData(
            @RequestParam("course") String course,
            @RequestParam("branch") String branch,
            @RequestParam("semester") String semester,
            @RequestParam("fileType") String fileType,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description
    ) throws IOException {
        UserResponse userResponse = new UserResponse();
        userResponse.setCourse(course);
        userResponse.setBranch(branch);
        userResponse.setSemester(Integer.parseInt(semester));
        String name= SecurityContextHolder.getContext().getAuthentication().getName();
        String fileName=file.getOriginalFilename();
        pdfanalyzer.analyzePdf(userResponse,fileType,name,title,file.getBytes(),fileName);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getlinks")
    public ResponseEntity<List<FileDto>> getExamFileLink(
            @RequestParam("course") String course,
            @RequestParam("branch") String branch,
            @RequestParam("semester")int semester
    ) {
        UserResponse userResponse = new UserResponse();
        userResponse.setCourse(course);
        userResponse.setBranch(branch);
        userResponse.setSemester(semester);
        try {
            log.info("req rescievd");
            var obj=userResponseService.getExamLinkByUserResponse(userResponse);
            log.info("res send");
            return new ResponseEntity<>(obj,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }

}
