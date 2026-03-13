package com.desi.bazar.cloudstorage.controller;

import com.desi.bazar.cloudstorage.service.GcsStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
public class FileUploadController {

    private final GcsStorageService gcsStorageService;

    public FileUploadController(GcsStorageService gcsStorageService) {
        this.gcsStorageService = gcsStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Received file: " + file);
            String path = gcsStorageService.uploadFile(file);
            return ResponseEntity.ok("Uploaded to: " + path);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Upload failed: " + e.getMessage());
        }
    }
}

