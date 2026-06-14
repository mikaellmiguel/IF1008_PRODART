package com.prodarte.gestaoartesaos.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prodarte.gestaoartesaos.dtos.AppError;
import com.prodarte.gestaoartesaos.repositories.FeiraRepository;
import com.prodarte.gestaoartesaos.services.RodizioService;

/**
 * Controller para o motor de rodízio justo.
 * Expõe o ranking de artesãos ordenados por score de justiça proporcional.
 */
@RestController
@RequestMapping("/rodizio")
public class RodizioController {

    private final RodizioService rodizioService;
    private final FeiraRepository feiraRepository;

    public RodizioController(RodizioService rodizioService, FeiraRepository feiraRepository) {
        this.rodizioService = rodizioService;
        this.feiraRepository = feiraRepository;
    }

    /**
     * Retorna o ranking de rodízio para uma feira específica.
     * GET /rodizio/ranking?feiraId={uuid}
     */
    @GetMapping("/ranking")
    public ResponseEntity<Object> getRanking(@RequestParam UUID feiraId) {
        var feiraOpt = feiraRepository.findById(feiraId);

        if (feiraOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AppError("Feira não encontrada."));
        }

        var ranking = rodizioService.gerarRanking(feiraId);
        return ResponseEntity.ok(ranking);
    }
}
