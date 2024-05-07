package com.cloudcrafters.projectservice.serviceImplementation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

@Component
public class DatabaseBackupScheduler {

    // Database and backup details
    private final String dbName = "talentgateway"; // Database name
    private final String dbUsername = "root"; // Database username
    private final String dbPassword = ""; // Database password
    private final String backupLocation = "C:/Users/fadhe/OneDrive/Bureau"; // Backup directory

    // Full path to mysqldump
    private final String mysqldumpPath = "D:/programemes/xampp/mysql/bin/mysqldump"; // Adjust to your MySQL version and path

    // Schedule the task to run every minute
    //@Scheduled(cron = "0 */1 * * * ?")
    //@Scheduled(cron = "0 0 0 * * ?")
    public void backupDatabase() {
        // Format the current date and time for a unique filename
        String dateStr = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
        String backupFilePath = backupLocation + "/backup_" + dateStr + ".sql";

        // Construct the command using ProcessBuilder
        ProcessBuilder processBuilder = new ProcessBuilder(
                Arrays.asList(
                        mysqldumpPath,
                        "-u", dbUsername,
                        "--password=" + dbPassword,
                        "--databases", dbName
                )
        );

        // Redirect the output to the backup file
        processBuilder.redirectOutput(new File(backupFilePath));
        processBuilder.redirectError(ProcessBuilder.Redirect.INHERIT); // Useful for debugging

        try {
            // Start the process and wait for it to complete
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("Database backup completed successfully at " + backupFilePath);
            } else {
                System.err.println("Database backup failed with exit code: " + exitCode);
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Error during database backup: " + e.getMessage());
        }
    }
}
