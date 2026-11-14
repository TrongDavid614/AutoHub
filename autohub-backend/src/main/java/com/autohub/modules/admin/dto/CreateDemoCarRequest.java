package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDemoCarRequest {

    @NotNull(message = "Vui lòng chọn phiên bản xe")
    private Long carVersionId;

    @NotBlank(message = "Biển số xe không được để trống")
    @Pattern(regexp = "^[0-9]{2}[A-Z]-[0-9]{3,5}(\\.[0-9]{2})?$",
            message = "Biển số xe không đúng định dạng (Ví dụ: 30A-999.88, 51K-12345)")
    private String licensePlate;

    private Integer currentOdo;

    private LocalDate lastMaintenanceDate;

    private LocalDate nextMaintenanceDate;

    private String status;
}
