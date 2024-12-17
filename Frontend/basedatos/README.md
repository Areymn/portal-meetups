BASE DE DATOS

--> USUARIO <--
- id PK
- username
- email
- password
- avatar
- rol (admin, user)
- createdAt
- editeAt

--> CIUDAD <--
He pensado meter 'solo' Málaga, Sevilla, Cádiz y Granada
- id PK
- name

--> TEMÁTICAS <--
- id PK
- title
Las temásticas podrían ser (para empezar) TECNOLOGÍA, ARTE Y CULTURA, OCIO Y DEPORTE

--> EVENTOS <--
- id PK
- title
- description
- avatar
- limite-participantes*** (NI PUTA IDEA DE CÓMO HACER ESTO)
- place (dónde se va a realizar el encuentro)
- date (fecha de dicho evento)
- id_tematica?? FK
- id_ciudad?? FK
- createdAt
- editAt

--> INSCRIPCIONES <--
- id
- id_usuario FK
- id_evento FK
- createdAt
- editAt


