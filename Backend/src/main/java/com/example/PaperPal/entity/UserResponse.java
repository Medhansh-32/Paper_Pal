package com.example.PaperPal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection ="userResponse")
@Data
@NoArgsConstructor  // Add this annotation for a no-argument constructor
@AllArgsConstructor
@Builder
public class UserResponse {
    @Id
    private ObjectId id;
    @Indexed
    private String course;
    @Indexed
    private String branch;
    @Indexed
    private int semester;
    @DBRef
    private List<ExamFile> examFile=new ArrayList<>();
}
