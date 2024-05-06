package com.cloudcrafters.messagingservice.services;

import com.amazonaws.services.s3.model.S3Object;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectResult;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class S3Service {

    private AmazonS3 s3client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(AmazonS3 s3client) {
        this.s3client = s3client;
    }

    public String uploadFile(String keyName, MultipartFile file) throws IOException {
        PutObjectResult putObjectResult = s3client.putObject(bucketName, keyName, file.getInputStream(), null);
        log.info("Uploaded file: {}", putObjectResult.getMetadata());

        String fileUrl = "https://" + bucketName + ".s3.amazonaws.com/" + keyName;
        return fileUrl;
    }

    public InputStreamResource viewFile(String keyName) {
        S3Object s3Object = s3client.getObject(bucketName, keyName);
        return new InputStreamResource(s3Object.getObjectContent());
    }

    public InputStreamResource downloadFile(String keyName) {
        return viewFile(keyName);
    }
}
