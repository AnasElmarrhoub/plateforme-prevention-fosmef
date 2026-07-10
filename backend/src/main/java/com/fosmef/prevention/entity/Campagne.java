package com.fosmef.prevention.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "campagnes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campagne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @NotNull
    @Min(1)
    @Column(name = "places_totales", nullable = false)
    private Integer placesTotales;

    @NotNull
    @Min(0)
    @Column(name = "places_reservees", nullable = false)
    private Integer placesReservees;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCampagne statut;

    @Version
    private Long version;
}
