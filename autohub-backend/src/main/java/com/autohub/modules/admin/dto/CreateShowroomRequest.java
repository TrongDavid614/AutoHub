package com.autohub.modules.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShowroomRequest {

    @NotBlank(message = "Tên showroom không được để trống")
    @Size(max = 150, message = "Tên showroom không vượt quá 150 ký tự")
    private String name;

    @NotNull(message = "Vui lòng chọn tỉnh/thành phố")
    private Long provinceId;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    @Size(max = 255, message = "Địa chỉ không vượt quá 255 ký tự")
    private String address;

    @NotBlank(message = "Số điện thoại hotline không được để trống")
    @Pattern(regexp = "^(0[235789][0-9]{8,9}|1900[0-9]{4,6}|1800[0-9]{4,6})$",
            message = "Số điện thoại hoặc hotline không đúng định dạng Việt Nam")
    private String hotline;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;

    @Builder.Default
    private Boolean active = true;
}
