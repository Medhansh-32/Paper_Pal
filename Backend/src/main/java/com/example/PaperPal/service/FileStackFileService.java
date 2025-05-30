package com.example.PaperPal.service;

import com.example.PaperPal.entity.ExamFile;
import com.example.PaperPal.interfaces.ExamFileService;
import com.example.PaperPal.repository.ExamFileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.util.Map;


@Service
@Slf4j
public class FileStackFileService implements ExamFileService {

    @Value("${filepath}")
    private String filePath;
    private ExamFileRepository examFileRepository;
    private String servletUri;
    private RestTemplate restTemplate;
    private String url;

    FileStackFileService(ExamFileRepository examFileRepository,
                    @Value("${servletUri}") String servletUri,
                    RestTemplate restTemplate, @Value("${filestack.api.url}") String url,
                    @Value("${filestack.api.key}") String apiKey) {

        this.examFileRepository = examFileRepository;
        this.servletUri = servletUri;
        this.restTemplate = restTemplate;
        this.url = url + apiKey;
    }

    @Override
    public ExamFile uploadExamFile(byte[] fileBytes, String fileType, String title, String userName) throws IOException {

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            ResponseEntity<Map<String, String>> map = restTemplate.exchange(url + "&filename=" + URLEncoder.encode(title, "UTF-8"),
                    HttpMethod.POST,
                    new HttpEntity<>(fileBytes, headers),
                    new ParameterizedTypeReference<>() {
                    });

            if (map != null) {
                if (!map.getBody().isEmpty()) {
                    Map<String, String> resposne = map.getBody();
                    if (resposne.containsKey("url")) {

                        ExamFile oldExam = examFileRepository.save(ExamFile.builder().
                                uploadedBy(userName).
                                uploadedDate(LocalDate.now()).
                                fileTitle(title).
                                contentType(fileType).
                                downloadLink(resposne.get("url"))
                                .build());
                        return examFileRepository.save(oldExam);
                    } else {
                        throw new Exception("url not present");
                    }
                }
            } else {
                throw new Exception("Resonse is Empty");
            }


        } catch (Exception e) {
            log.info(e.getMessage());
            log.info("Exception in uploading file to FileStack");
        }
        return null;
    }

}
