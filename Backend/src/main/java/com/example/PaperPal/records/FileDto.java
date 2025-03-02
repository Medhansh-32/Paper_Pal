package com.example.PaperPal.records;

import java.time.LocalDate;


public record FileDto(
        String id,
        String title,
        String course,
        String branch,
        int semester,
        String fileType,
        String uploadedBy,
        LocalDate uploadDate,
        String downloadUrl) {
}
