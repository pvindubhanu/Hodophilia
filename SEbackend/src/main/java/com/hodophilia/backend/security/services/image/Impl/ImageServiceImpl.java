package com.hodophilia.backend.security.services.image.Impl;

import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Image;
import com.hodophilia.backend.repository.ImageRepository;
import com.hodophilia.backend.security.services.image.ImageService;

@Service
public class ImageServiceImpl implements ImageService {
	
	@Autowired
	private ImageRepository imageRepository;

	@Override
	public Image findImageById(Long id) throws ResourceNotFoundException {
		
		return imageRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("Image not found", id)));
	}

	@Override
	public Image findImageByPath(String path) {
		return imageRepository.findByPath(path)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("Image not found in path", path)));
	}

	@Override
	public String getImage(String path) throws IOException{
		
		
		ClassPathResource imgFile = new ClassPathResource(path);
		
		byte[] bytes = StreamUtils.copyToByteArray(imgFile.getInputStream());
		
		String encodedString = Base64.getEncoder().encodeToString(bytes);
		
		return encodedString;
	}

}
