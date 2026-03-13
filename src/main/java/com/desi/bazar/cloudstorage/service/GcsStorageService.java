package com.desi.bazar.cloudstorage.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class GcsStorageService {
    private final Storage storage;

    @Value("${gcp-storage.bucket-name}")
    private String bucketName;

    public GcsStorageService(Storage storage) {
        this.storage = storage;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String objectName = file.getOriginalFilename();  // you can add UUID here

        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        storage.create(blobInfo, file.getBytes());

        // Return gs:// path or public URL (if bucket/obj is public)
        return String.format("gs://%s/%s", bucketName, objectName);
    }
}
