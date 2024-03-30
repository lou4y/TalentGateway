package com.cloudcrafters.taskservice.Clients;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name="USER-SERVICE")
public interface UserRestClient {

}
