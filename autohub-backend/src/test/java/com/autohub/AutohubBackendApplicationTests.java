package com.autohub;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AutohubBackendApplicationTests {

    @Test
    void generateHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("Test@1234");
        System.out.println("BCRYPT_TEST_HASH=" + hash);
        boolean matches = encoder.matches("Test@1234", hash);
        System.out.println("BCRYPT_MATCHES=" + matches);
    }
}
