package com.example.PaperPal.service;

import com.example.PaperPal.entity.ExamFile;
import com.example.PaperPal.interfaces.ExamFileService;
import com.example.PaperPal.repository.ExamFileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class ImageKitUploadService implements ExamFileService {

    private RestTemplate restTemplate;
    private ExamFileRepository examFileRepository;
    private String url;
    private String authHeader;

    ImageKitUploadService(RestTemplate restTemplate, ExamFileRepository examFileRepository, @Value("${imageKit_url}") String url, @Value("${imageKit_privateKey}") String authHeader){
        this.restTemplate = restTemplate;
        this.examFileRepository = examFileRepository;
        this.url = url;
        this.authHeader = "Basic "+ Base64.getEncoder().encodeToString((authHeader + ":").getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public ExamFile uploadExamFile(byte[] fileBytes, String fileType, String title, String userName) {
        log.info("service started");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader); // already has "Basic base64(private_key:)"
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);


            ByteArrayResource fileResource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return title + ".pdf";
                }
            };


            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);
            body.add("fileName", title);
            body.add("useUniqueFileName", "true");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<>() {}
            );


            Map<String, Object> res = Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new IllegalStateException("Response body is null"));

            String uploadedUrl = (String) res.get("url");
            log.info("Upload successful. File URL: {}", uploadedUrl);


            ExamFile savedExam = examFileRepository.save(ExamFile.builder()
                    .uploadedBy(userName)
                    .uploadedDate(LocalDate.now())
                    .fileTitle(title)
                    .contentType(fileType)
                    .downloadLink(uploadedUrl)
                    .build());

            return savedExam;

        } catch (Exception e) {
            log.error("Exception in uploading file to ImageKit", e);
            return null;
        }
    }


}
