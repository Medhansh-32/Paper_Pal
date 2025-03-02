package com.example.PaperPal.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.time.LocalDate;



@Document(collection = "examFile")
@Data
@Builder
public class ExamFile {

    @Id
    private ObjectId examId;
    private String fileTitle;
    private String downloadLink;
    private String contentType;
    private String uploadedBy;
    private LocalDate uploadedDate;
}
