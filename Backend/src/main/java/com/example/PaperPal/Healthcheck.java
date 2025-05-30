package com.example.PaperPal;


import com.example.PaperPal.entity.UserResponse;
import com.example.PaperPal.service.Pdfanalyzer;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class Healthcheck {

    private final Pdfanalyzer pdfanalyzer;

    public Healthcheck(Pdfanalyzer pdfanalyzer) {
        this.pdfanalyzer = pdfanalyzer;
    }

    @GetMapping("/health")
    public String healthCheck() {
     return "Status : Healthy";
    }

    @PostMapping("/aiTest")
    public void aiTest(@RequestParam("file") MultipartFile file) throws IOException {
       UserResponse u= new UserResponse(new ObjectId("67c49e2efa07b6177b29f7b0"),"Bachelor of Technology","Computer Science Engineering",1,null);
        pdfanalyzer.analyzePdf(u,"pyq","Medhansh Sharma","title",file.getBytes(),file.getOriginalFilename());
    }
}
