# Stage 1: Build JAR with Gradle
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Install bash and tzdata for Gradle wrapper & timezone support
RUN apk add --no-cache bash tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Copy gradle wrapper and build configs first for dependency caching
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Fix potential Windows CRLF line endings
RUN sed -i 's/\r$//' ./gradlew && chmod +x ./gradlew

# Pre-fetch gradle dependencies
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and build executable jar
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Minimal Production JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install tzdata and configure Vietnam timezone (Asia/Ho_Chi_Minh)
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Run as non-root user for security and prepare uploads directory
RUN addgroup -S autohub && adduser -S autohub -G autohub
RUN mkdir -p /app/uploads/avatars && chown -R autohub:autohub /app
USER autohub

# Copy jar from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Duser.timezone=Asia/Ho_Chi_Minh", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
