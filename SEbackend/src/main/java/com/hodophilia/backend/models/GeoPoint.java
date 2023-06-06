package com.hodophilia.backend.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "geopoint"
		+ "")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GeoPoint{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	@JsonIgnore
	private Long id;
	
    Double lng;

    Double lat;
}