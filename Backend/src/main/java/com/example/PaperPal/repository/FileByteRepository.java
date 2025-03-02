package com.example.PaperPal.repository;

import com.example.PaperPal.entity.FileByte;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileByteRepository extends MongoRepository<FileByte, ObjectId> {

}
