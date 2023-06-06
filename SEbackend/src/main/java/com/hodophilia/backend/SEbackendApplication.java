package com.hodophilia.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.hodophilia.backend.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class SEbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SEbackendApplication.class, args);
	}

}