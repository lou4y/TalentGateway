package com.cloudcrafters.taskservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleResponse {
    private Long id;
    private String moduleName;
    private String moduleDescription;

}
