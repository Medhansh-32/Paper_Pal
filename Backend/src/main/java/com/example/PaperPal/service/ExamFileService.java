package com.example.PaperPal.service;

import com.example.PaperPal.entity.ExamFile;
import com.example.PaperPal.entity.FileByte;
import com.example.PaperPal.repository.ExamFileRepository;
import com.example.PaperPal.repository.FileByteRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDate;


@Service
@Slf4j
public class ExamFileService {

    @Value("${filepath}")
    private String filePath;
    private ExamFileRepository examFileRepository;
    private String servletUri;
    private FileByteRepository fileByteRepository;


    ExamFileService(ExamFileRepository examFileRepository, @Value("${servletUri}") String servletUri, FileByteRepository fileByteRepository) {
        this.examFileRepository=examFileRepository;
        this.servletUri=servletUri;
        this.fileByteRepository = fileByteRepository;
    }


    public ExamFile uploadExamFile(byte[] fileBytes,String fileType,String title,String userName) throws IOException {

      FileByte fileByte= fileByteRepository.save(FileByte.builder().
              fileByte(fileBytes)
              .build());

     ExamFile oldExam=examFileRepository.save(ExamFile.builder().
                uploadedBy(userName).
                uploadedDate(LocalDate.now()).
                fileTitle(title).
                contentType(fileType).build());

        oldExam.setDownloadLink(createDownloadLink(fileByte));
        return examFileRepository.save(oldExam);

    }

    public ResponseEntity<byte[]> downloadExamFile(ObjectId id) throws IOException {
        FileByte fileByte = fileByteRepository.findById(id).orElse(null);
        if(fileByte!=null) {
            return new ResponseEntity<>(fileByte.getFileByte(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public String createDownloadLink(FileByte examFile) {

        String secureRequest= servletUri.concat("file/").concat(examFile.getId().toString());
        log.info(secureRequest);
        return secureRequest;
    }
    public ResponseEntity<?> deleteExamFile(ObjectId id) {
       ExamFile examFile= examFileRepository.deleteExamFileByExamId(id);
       if(examFile!=null) {
           return new ResponseEntity<>(HttpStatus.OK);
       }
    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
