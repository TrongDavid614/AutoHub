package com.autohub.modules.auth;

import com.autohub.modules.auth.dto.LoginRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authenticateAndExtractToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        assertTrue(root.get("success").asBoolean());
        return root.get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("Admin authenticates and accesses admin dashboard")
    void verifyAdminRoleAccess() throws Exception {
        String adminToken = authenticateAndExtractToken("admin.test@autohub.vn", "Test@1234");
        assertNotNull(adminToken);

        mockMvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Staff authenticates and is forbidden from admin dashboard")
    void verifyStaffForbiddenFromAdmin() throws Exception {
        String staffToken = authenticateAndExtractToken("staff.test@autohub.vn", "Test@1234");
        assertNotNull(staffToken);

        mockMvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer authenticates and is forbidden from admin dashboard")
    void verifyCustomerForbiddenFromAdmin() throws Exception {
        String customerToken = authenticateAndExtractToken("customer.test@autohub.vn", "Test@1234");
        assertNotNull(customerToken);

        mockMvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Unauthenticated request to admin endpoint yields 401")
    void verifyUnauthenticatedYields401() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Invalid password yields 401")
    void verifyInvalidPasswordYields401() throws Exception {
        LoginRequest req = new LoginRequest("admin.test@autohub.vn", "IncorrectPass");
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Locked user yields 403")
    void verifyLockedUserYields403() throws Exception {
        LoginRequest req = new LoginRequest("locked.test@autohub.vn", "Test@1234");
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Retrieve current profile via /auth/me with valid token")
    void verifyAuthMeEndpoint() throws Exception {
        String adminToken = authenticateAndExtractToken("admin.test@autohub.vn", "Test@1234");

        MvcResult result = mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        assertTrue(root.get("success").asBoolean());
        assertEquals("admin.test@autohub.vn", root.get("data").get("email").asText());
        assertEquals("ROLE_ADMIN", root.get("data").get("role").asText());
    }
}
