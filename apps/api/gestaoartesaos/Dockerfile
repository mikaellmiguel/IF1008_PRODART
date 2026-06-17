# ==========================================
# Etapa 1: Build da aplicação Spring Boot
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia apenas o pom.xml e baixa as dependências (otimiza o cache de camadas)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código-fonte e compila o pacote JAR pulando testes unitários
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Etapa 2: Execução da aplicação em imagem leve
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o JAR gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Inicia a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
