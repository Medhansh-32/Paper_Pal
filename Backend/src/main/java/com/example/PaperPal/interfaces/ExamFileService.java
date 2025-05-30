package com.example.PaperPal.interfaces;

import com.example.PaperPal.entity.ExamFile;

import java.io.IOException;

public interface ExamFileService {

    public ExamFile uploadExamFile(byte[] fileBytes, String fileType, String title, String userName) throws IOException ;
}
