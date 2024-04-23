package com.cloudcrafters.taskservice;


import com.pusher.rest.Pusher;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@EnableFeignClients
// @EnableConfigurationProperties(GlobalConfig.class)
public class TaskServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskServiceApplication.class, args);
        System.out.println("Task Service is up and running");
    }

    @Configuration
    public class PusherConfiguration {
        @Bean
        public Pusher pusher() {
            Pusher pusher = new Pusher("1781423", "3867787e7fdcc8389321", "09d58b00f4dca81710e8");
            pusher.setCluster("ap4");
            pusher.setEncrypted(true);
            return pusher;
        }
    }
}
