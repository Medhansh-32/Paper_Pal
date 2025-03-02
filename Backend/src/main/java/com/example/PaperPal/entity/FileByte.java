package com.example.PaperPal.entity;


import lombok.Builder;
import lombok.Data;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "fileByte")
@Data
@Builder
public class FileByte {

    @Id
    private ObjectId id;
    private byte[] fileByte;
}
