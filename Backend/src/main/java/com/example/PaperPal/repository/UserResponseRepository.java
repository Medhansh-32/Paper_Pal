package com.example.PaperPal.repository;


import com.example.PaperPal.entity.UserResponse;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserResponseRepository extends MongoRepository<UserResponse, ObjectId> {

    UserResponse findByCourseAndBranchAndSemester(String course, String branch, int semester);
   List<UserResponse> deleteByCourseAndBranchAndSemester(String course, String branch,int semester);

}
