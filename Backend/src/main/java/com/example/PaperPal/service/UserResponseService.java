package com.example.PaperPal.service;

import com.example.PaperPal.entity.ExamFile;
import com.example.PaperPal.entity.UserResponse;
import com.example.PaperPal.interfaces.ExamFileService;
import com.example.PaperPal.records.FileDto;
import com.example.PaperPal.repository.UserResponseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Slf4j
@Service
public class UserResponseService {

    private final UserResponseRepository userResponseRepository;
    private final ExamFileService examFileService;

    @Autowired
    public UserResponseService(UserResponseRepository userResponseRepository,  @Qualifier("imageKitUploadService") ExamFileService examFileService) {
        this.userResponseRepository = userResponseRepository;
        this.examFileService = examFileService;
    }

    public UserResponse saveUserResponse(UserResponse userResponse,
                                         byte[] fileBytes,
                                         String title,
                                         String userName,
                                         String fileType,
                                         String fileName) throws IOException {

        ExamFile examFile=examFileService.uploadExamFile(fileBytes,fileType,title,userName);
        examFile.setUploadedDate(LocalDate.now());
        examFile.setFileTitle(title);
        examFile.setUploadedBy(userName);
        userResponse.getExamFile().add(examFile);

        return   userResponseRepository.save(userResponse);
    }

    public List<FileDto> getExamLinkByUserResponse(UserResponse userResponse){
        UserResponse userResponses = userResponseRepository.findByCourseAndBranchAndSemester(
                userResponse.getCourse(),
                userResponse.getBranch(),
                userResponse.getSemester());
    if(userResponses!=null){
        List<FileDto> fileData=new ArrayList<>();
        List<ExamFile> fileDataList=userResponses.getExamFile();
        for(int i=0;i<userResponses.getExamFile().size();i++){
            fileData.add(
                    new FileDto(fileDataList.get(i).getExamId().toString(),fileDataList.get(i).getFileTitle(),
                            userResponses.getCourse(),
                            userResponses.getBranch(),
                            userResponses.getSemester(),
                            fileDataList.get(i).getContentType(),
                            fileDataList.get(i).getUploadedBy(),
                            fileDataList.get(i).getUploadedDate(),
                            userResponses.getExamFile().get(i).getDownloadLink())
            );
        }
        return fileData;
    }else{
        return null;
    }
//            title: 'Operating Systems Notes',
//            course: 'Bachelor of Technology',
//            branch: 'Computer Science Engineering',
//            semester: '4',
//            fileType: 'notes',
//            uploadedBy: 'Prof. Smith',
//            uploadDate: '2025-01-20',
//            downloadUrl: '#'

    }
    public UserResponse addFileToUser(UserResponse userResponse, byte[] fileBytes,String title,String userName,String fileType,String fileName) throws IOException {
        UserResponse userResponse1 = userResponseRepository.findByCourseAndBranchAndSemester(userResponse.getCourse(),
                userResponse.getBranch(),
                userResponse.getSemester());
        if(userResponse1!=null){
            ExamFile examFile=examFileService.uploadExamFile(fileBytes,fileType,title,userName);

            userResponse1.getExamFile().add(examFile);
            return userResponseRepository.save(userResponse1);
        }
            return null;
    }

}
