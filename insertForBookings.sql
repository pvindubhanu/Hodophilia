INSERT INTO geopoint(id,lat,lng) VALUES(1, -39.173812, 86.522063);

INSERT INTO locations(id,geo_point_id,name) VALUES(1,1,'Indianapolis');

INSERT INTO images(id,path) VALUES(1,'images/res1.jpg');

INSERT INTO hotels(id,address,email,name,phone,stars,geo_point_id,image_id,location_id) VALUES(7,'644 Hermitage Ln','nychome@gmail.com','NYC Home 2','812-225-4243',5,1,1,1);

INSERT INTO rooms(id,description,is_available,num_of_adult,num_of_children,price,room_type,id_hotel) VALUES(8,'Good room in NYC',true,4,2,700,1,7);

INSERT INTO geopoint(id, lat, lng) VALUES(2, -39.173811, 86.522063);
INSERT INTO geopoint(id, lat, lng) VALUES(3, -39.173813, 86.522063);
INSERT INTO geopoint(id, lat, lng) VALUES(4, -39.173811, 86.522062);
INSERT INTO geopoint(id, lat, lng) VALUES(5, -39.173815, 86.522062);
INSERT INTO geopoint(id, lat, lng) VALUES(6, -39.173812, 86.522053);
INSERT INTO geopoint(id, lat, lng) VALUES(7, -39.173823, 86.522056);

INSERT INTO hotels(id,address,email,name,phone,stars,geo_point_id,image_id,location_id) VALUES
	(8,'645 Hermitage Ln','nychome@gmail.com','NYC Home 2','812-225-4243',4,2,1,1),
	(9,'646 Hermitage Ln','nychome@gmail.com','NYC Home 2','812-225-4243',5,3,1,1),
	(10,'747 Special Dr','steve@Special.com','Special Night Rental','812-555-6593',1,4,1,1);

INSERT INTO RESTAURANTS(id, address, email, name, phone, ratings, geo_point_id, image_id, location_id) VALUES
	(1001, '404 Byecivilization Rd', 'am@where.info', 'Goner''s Delight', '810-555-5555', 4.5, 5, 1, 1),
	(1002, '42 W Tardis Ln', 'nobody@me.org', 'My New Restaurant', '810-555-2050', 4.9, 6, 1, 1),
	(1003, '365 S Garfield St', 'lasagna@gmail.com', 'Hungry', '810-555-2456', 3.2, 7, 1, 1);

insert into restaurants(id, address, email, name, phone, ratings, geo_point_id, image_id, location_id) values (