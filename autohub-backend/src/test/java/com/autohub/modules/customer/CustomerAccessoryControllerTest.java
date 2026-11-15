package com.autohub.modules.customer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerAccessoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Verify GET /customer/accessories/10 returns fully-populated DTO with safe non-null lists")
    void verifyAccessory10Detail() throws Exception {
        MvcResult result = mockMvc.perform(get("/customer/accessories/10"))
                .andExpect(status().isOk())
                .andReturn();

        String jsonContent = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        JsonNode root = objectMapper.readTree(jsonContent);
        assertTrue(root.get("success").asBoolean());

        JsonNode data = root.get("data");
        assertNotNull(data);
        assertEquals(10L, data.get("id").asLong());
        assertTrue(data.get("name").asText().contains("gối tựa đầu") || data.get("name").asText().contains("Ergonomic"));

        // Verify images is non-null array with items
        JsonNode images = data.get("images");
        assertNotNull(images);
        assertTrue(images.isArray());
        assertTrue(images.size() > 0, "images array must not be empty");

        // Verify compatibilities is non-null array with items
        JsonNode compatibilities = data.get("compatibilities");
        assertNotNull(compatibilities);
        assertTrue(compatibilities.isArray());
        assertTrue(compatibilities.size() > 0, "compatibilities array must not be empty");

        // Verify specifications is non-null object with keys
        JsonNode specs = data.get("specifications");
        assertNotNull(specs);
        assertTrue(specs.isObject());
        assertTrue(specs.size() > 0, "specifications must not be empty");

        // Verify reviews is non-null array
        JsonNode reviews = data.get("reviews");
        assertNotNull(reviews);
        assertTrue(reviews.isArray());
        assertTrue(reviews.size() > 0, "reviews array must not be empty");
    }

    @Test
    @DisplayName("Verify GET /accessories/10 alias mapping works identically")
    void verifyAccessory10AliasRoute() throws Exception {
        mockMvc.perform(get("/accessories/10"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Verify non-existent accessory returns 404")
    void verifyNonExistentAccessoryReturns404() throws Exception {
        mockMvc.perform(get("/customer/accessories/999999"))
                .andExpect(status().isNotFound());
    }
}
