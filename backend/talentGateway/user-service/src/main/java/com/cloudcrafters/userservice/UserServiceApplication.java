package com.cloudcrafters.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SpringBootApplication
@SecurityScheme(
        name = "Keycloak"
        , openIdConnectUrl = "http://127.0.0.1:8080/realms/TalentGateway/.well-known/openid-configuration"
        , scheme = "bearer"
        , type = SecuritySchemeType.OPENIDCONNECT
        , in = SecuritySchemeIn.HEADER
)
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
