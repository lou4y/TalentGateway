FROM openjdk:17-oracle
VOLUME /tmp

## Définition des variables d'environnement
#ENV SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/TaskTalentGateway?createDatabaseIfNotExist=true
#ENV SPRING_DATASOURCE_USERNAME=root
#ENV SPRING_DATASOURCE_PASSWORD=
#ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
#ENV SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
#ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://host.docker.internal:8761/eureka

COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
