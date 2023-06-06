package com.hodophilia.backend.security.services.image;

import java.io.IOException;

import com.hodophilia.backend.models.Image;

public interface ImageService {
	Image findImageById(Long Id);
	
	Image findImageByPath(String path);
	
	public String getImage(String path) throws IOException;
}
