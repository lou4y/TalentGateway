package com.cloudcrafters.userservice.security;

import org.keycloak.adapters.authorization.integration.jakarta.ServletPolicyEnforcerFilter;
import org.keycloak.adapters.authorization.spi.ConfigurationResolver;
import org.keycloak.adapters.authorization.spi.HttpRequest;
import org.keycloak.representations.adapters.config.PolicyEnforcerConfig;
import org.keycloak.util.JsonSerialization;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http)
			throws Exception {
		http.csrf(AbstractHttpConfigurer::disable);
		http.addFilterAfter(createPolicyEnforcerFilter(),
				BearerTokenAuthenticationFilter.class);
		http.sessionManagement(
				t -> t.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		);
		return http.build();
	}

	private ServletPolicyEnforcerFilter createPolicyEnforcerFilter() {
		return new ServletPolicyEnforcerFilter(new ConfigurationResolver() {
			@Override
			public PolicyEnforcerConfig resolve(HttpRequest request) {
				try {
					return JsonSerialization.
							readValue(getClass().getResourceAsStream("/policy-enforcer.json"),
									PolicyEnforcerConfig.class);
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		});
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		// Allow all origins, methods, and headers. You can customize this according to your requirements.
		config.addAllowedOrigin("*");
		config.addAllowedMethod("*");
		config.addAllowedHeader("*");
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}

}
