package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.config.GlobalConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
//dire à ce controlleur si la configuration a changé tu dois recharger tous les injections
//ne marche pas avec record elle marche seulement avec class et les types immutables
@RefreshScope
public class ConfigTestController {
    //injecter des variables
    @Value("${global.params.p1}")
    private int p1;
    @Value("${global.params.p2}")
    private int p2;
    @Value("${project.params.x}")
    private int x;
    @Value("${project.params.y}")
    private int y;
    //2 eme méthode: créer une classe qui regroupe tous ces variables (globalConfig
    @Autowired
    private GlobalConfig globalConfig;
    @GetMapping("/testConfig")
    public Map<String, Integer> configTest(){
        return  Map.of("p1",p1,"p2",p2,"x",x,"y",y);
    }
    @GetMapping("/globalConfig")
    public GlobalConfig globalConfig(){
        return globalConfig;
    }
}
