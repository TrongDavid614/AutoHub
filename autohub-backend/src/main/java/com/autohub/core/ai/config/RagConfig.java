package com.autohub.core.ai.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.AbstractEmbeddingModel;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;

import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Configuration
public class RagConfig {

    @Value("classpath:autohub_policies.md")
    private Resource policiesResource;

    @Value("${spring.ai.openai.api-key:${GEMINI_API_KEY:}}")
    private String geminiApiKey;

    @Primary
    @Bean
    public EmbeddingModel embeddingModel(ObjectMapper objectMapper) {
        log.info("[Spring AI RAG] Khoi tao GeminiEmbeddingModel chuyen dung");
        return new GeminiEmbeddingModel(geminiApiKey, objectMapper);
    }

    private static File resolveVectorStoreFile() {
        File f1 = new File("autohub_vector_store.json");
        if (f1.exists()) return f1;
        File f2 = new File("autohub-backend", "autohub_vector_store.json");
        if (f2.exists()) return f2;
        return new File("autohub-backend").isDirectory() ? f2 : f1;
    }

    @Bean
    public VectorStore vectorStore(EmbeddingModel embeddingModel) {
        log.info("[Spring AI RAG] Khoi tao SimpleVectorStore tren RAM");
        SimpleVectorStore vectorStore = SimpleVectorStore.builder(embeddingModel).build();

        File vectorFile = resolveVectorStoreFile();
        if (vectorFile.exists()) {
            log.info("[Spring AI RAG] Nap Vector Store co san tu file: {}", vectorFile.getAbsolutePath());
            try {
                vectorStore.load(vectorFile);
            } catch (Exception e) {
                log.warn("[Spring AI RAG] Khong the doc file vector json cu: {}", e.getMessage());
            }
        }
        return vectorStore;
    }

    @Bean
    public ApplicationRunner initVectorStore(VectorStore vectorStore) {
        return args -> {
            File vectorFile = resolveVectorStoreFile();
            if (!vectorFile.exists()) {
                log.info(
                        "[Spring AI RAG] Bat dau quy trinh ETL: Doc Markdown -> Cat Chunks -> Tinh Vector Embeddings...");
                try {
                    TextReader textReader = new TextReader(policiesResource);
                    List<Document> documents = textReader.get();

                    TokenTextSplitter splitter = new TokenTextSplitter();
                    List<Document> chunks = splitter.apply(documents);

                    vectorStore.add(chunks);
                    log.info("[Spring AI RAG] Da nap thanh cong {} doan van ban vao VectorStore!", chunks.size());

                    if (vectorStore instanceof SimpleVectorStore simpleStore) {
                        simpleStore.save(vectorFile);
                        log.info("[Spring AI RAG] Da luu vinh vien VectorStore ra file JSON: {}",
                                vectorFile.getAbsolutePath());
                    }
                } catch (Exception e) {
                    log.warn("[Spring AI RAG] Khong the nap tai lieu chinh sach: {}", e.getMessage());
                }
            } else {
                log.info("[Spring AI RAG] Cache vector JSON da ton tai. Bo qua buoc tinh toan lai embeddings.");
            }
        };
    }

    public static class GeminiEmbeddingModel extends AbstractEmbeddingModel {

        private final HttpClient httpClient;
        private final ObjectMapper objectMapper;
        private final String apiKey;

        public GeminiEmbeddingModel(String apiKey, ObjectMapper objectMapper) {
            this.apiKey = apiKey;
            this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
            this.httpClient = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();
        }

        @Override
        public float[] embed(Document document) {
            return embed(document.getText());
        }

        @Override
        public float[] embed(String text) {
            List<float[]> list = embedBatch(List.of(text));
            return list.isEmpty() ? new float[0] : list.get(0);
        }

        @Override
        public EmbeddingResponse call(EmbeddingRequest request) {
            List<String> texts = request.getInstructions();
            List<float[]> embeddings = embedBatch(texts);
            List<Embedding> results = new ArrayList<>();
            for (int i = 0; i < embeddings.size(); i++) {
                results.add(new Embedding(embeddings.get(i), i));
            }
            return new EmbeddingResponse(results);
        }

        private List<float[]> embedBatch(List<String> texts) {
            try {
                Map<String, Object> bodyMap = Map.of(
                        "input", texts,
                        "model", "gemini-embedding-001");
                String jsonBody = objectMapper.writeValueAsString(bodyMap);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/openai/embeddings"))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(30))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() != 200) {
                    log.error("[GeminiEmbeddingModel] Loi HTTP {} tu Google API: {}", response.statusCode(),
                            response.body());
                    return List.of();
                }

                JsonNode root = objectMapper.readTree(response.body());
                JsonNode dataNode = root.get("data");
                List<float[]> resultList = new ArrayList<>();

                if (dataNode != null && dataNode.isArray()) {
                    for (JsonNode item : dataNode) {
                        JsonNode embeddingNode = item.get("embedding");
                        if (embeddingNode != null && embeddingNode.isArray()) {
                            float[] vector = new float[embeddingNode.size()];
                            for (int i = 0; i < embeddingNode.size(); i++) {
                                vector[i] = (float) embeddingNode.get(i).asDouble();
                            }
                            resultList.add(vector);
                        }
                    }
                }
                return resultList;
            } catch (Exception e) {
                log.error("[GeminiEmbeddingModel] Exception khi goi Google Embedding: {}", e.getMessage(), e);
                return List.of();
            }
        }
    }
}