package com.hodophilia.backend.models;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@EqualsAndHashCode @ToString
@Table(name = "locations"
		+ "")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Location extends AbstractEntity{
	
	private String name;
	
	@OneToOne
	private GeoPoint geoPoint;

	private Double ratings;
}
