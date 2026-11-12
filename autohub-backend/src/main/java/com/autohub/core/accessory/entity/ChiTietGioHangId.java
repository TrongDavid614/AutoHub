package com.autohub.core.accessory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ChiTietGioHangId implements Serializable {

    @Column(name = "gio_hang_id")
    private Long gioHangId;

    @Column(name = "phu_kien_id")
    private Long phuKienId;
}
