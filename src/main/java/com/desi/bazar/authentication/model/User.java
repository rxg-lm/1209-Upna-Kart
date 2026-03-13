package com.desi.bazar.authentication.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@Entity(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "username", nullable = false,length = 40)
    @NotEmpty
    private String username;
    @Column(name = "mobile", unique = true,nullable = false)
    @NotNull(message = "Mobile number is required")
    @Min(value = 1000000000, message = "Mobile must be 10 digits")
    @Max(value = 9999999999L, message = "Mobile must be 10 digits")
    private Long mobile;
    @Column(name = "email", unique = true,nullable = false)
    @NotEmpty
    private String email;
    @Column(name = "password", unique = true,nullable = false)
    @NotEmpty
    private String password;
}
