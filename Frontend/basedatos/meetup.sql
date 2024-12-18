CREATE DATABASE meetup;

USE meetup;

CREATE TABLE IF NOT EXISTS cities (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO cities (name) VALUE 
	("Málaga"),
    ("Granada"),
    ("Sevilla"),
    ("Cádiz");

    
CREATE TABLE IF NOT EXISTS themes (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO themes (name) value
	("Deportes"),
    ("Tecnología"),
    ("Ocio"),
    ("Arte y cultura");
    
CREATE TABLE IF NOT EXISTS events (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    foto_avatar VARCHAR(350) NOT NULL,
    place VARCHAR(500) NOT NULL,
    date DATETIME NOT NULL,
    cityId INT UNSIGNED NOT NULL,
    themeId INT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    FOREIGN KEY (cityId) REFERENCES cities(id),
    FOREIGN KEY (themeId) REFERENCES themes(id)
);

INSERT INTO events (title, description, foto_avatar, place, date, cityId, themeId) VALUE (
	"Programa con MoureDev",
	"Encuentro con uno de los mayores referentes actuales de la programación en la comunidad hispanohablante. Contará un poco su experiencia en el mundo de la programación y presentará su nuevo proyecto para aprender distintos de lenguajes de programación, ejercicios de lógica, etc",
	"/uploads/events/avatar1.png",
    "FYCMA, Av. de José Ortega y Gasset, 201, Cruz de Humilladero, 29006 Málaga",
	"2025-02-10 16:30:00",
	1,
	2
);

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    rol ENUM("admin", "user") DEFAULT "user",
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password, name, last_name, avatar) VALUE (
	"PepiNodeMar",
    "elpepi@demar.com",
    "12345",
    "Marco",
    "Berenjeno",
    "/uploads/users/avatar1.png"
);


