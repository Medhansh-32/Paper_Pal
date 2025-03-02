package com.example.PaperPal.service;

import com.example.PaperPal.entity.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
public class Pdfanalyzer {

    private RestTemplate restTemplate;


    private final String url;


    private final String api_key;


    private final String prompt;

    private UserResponseService userResponseService;

    private MailService mailService;



    public Pdfanalyzer(
                       @Value("${url}") String url,
                       @Value("${apiKey}") String api_key,
                       @Value("${prompt}") String prompt,
                       UserResponseService userResponseService,
                       MailService mailService,
                       RestTemplate restTemplate
                       ) {
        this.userResponseService = userResponseService;
        this.mailService = mailService;
        this.url = url + api_key;
        this.api_key = api_key;
        this.prompt = prompt;
        this.restTemplate = restTemplate;
    }


    @Async
    public void analyzePdf(UserResponse userResponse, String fileType,String userName,String title,byte[] fileBytes,String fileName) throws IOException {


        String fileBytesArray = Base64.getEncoder().encodeToString(fileBytes);


        String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "inline_data": {
                            "mime_type": "application/pdf",
                            "data": "%s"
                          }
                        },
                        {
                          "text": "%s"
                        }
                      ]
                    }
                  ]
                }
                                
                """.formatted(fileBytesArray,prompt);

        Boolean fileUploadable = false;


        ResponseEntity<HashMap<String, Object>> response = restTemplate.exchange(url,HttpMethod.POST,new HttpEntity<>(requestBody),new ParameterizedTypeReference<>() {});


        if (response.getStatusCode().is2xxSuccessful()) {
            List<Object> candidates = (List<Object>) response.getBody().get("candidates");
            if (candidates != null) {
                HashMap<String, Object> contents = (HashMap<String, Object>) candidates.get(0);
                if (contents != null) {
                    HashMap<String, Object> parts = (HashMap<String, Object>) contents.get("content");
                    if (parts != null) {
                        List<Object> text = (List<Object>) parts.get("parts");
                        HashMap<String, Object> isUploadable = (HashMap<String, Object>) text.get(0);
                        if (isUploadable != null) {
                            String result = (String) isUploadable.get("text");
                            result = result.trim();
                            log.info("result "+result);
                            fileUploadable=Boolean.parseBoolean(result);
                            log.info("fileuploadable : "+fileUploadable);
                        }
                    }
                }
                try {
                    if (fileUploadable) {
                        log.info("if-else "+fileUploadable.toString());
                        if (userResponseService.getExamLinkByUserResponse(userResponse) == null) {
                            userResponseService.saveUserResponse(userResponse, fileBytes, title,userName,fileType,fileName);
                        } else {
                            userResponseService.addFileToUser(userResponse, fileBytes, title,userName,fileType,fileName);
                        }
                        log.info("file uploaded");
                        mailService.mailAboutUpload("Your file has been successfully uploaded to PaperPal. Thank you for helping others by sharing valuable study material!",userName, true);
                    }else{
                    mailService.mailAboutUpload("Your file could not be uploaded as it contains inappropriate content. Please ensure your material aligns with our guidelines.", userName,false);
                }
                }catch (Exception e) {
                    System.out.println(e);
                }
            } else {
                log.info("PDF Analyzer failed");

            }

        }
    }
}
