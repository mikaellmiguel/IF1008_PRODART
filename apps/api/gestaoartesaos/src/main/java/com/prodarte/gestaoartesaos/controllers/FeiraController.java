package com.prodarte.gestaoartesaos.controllers;

import com.prodarte.gestaoartesaos.dtos.AppError;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodarte.gestaoartesaos.repositories.*;

import com.prodarte.gestaoartesaos.dtos.*;
import com.prodarte.gestaoartesaos.enums.StatusCuradoria;
import com.prodarte.gestaoartesaos.models.Alocacao;
import com.prodarte.gestaoartesaos.models.Feira;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/feira")
public class FeiraController {
    
    private final FeiraRepository feiraRepository;
    private final ArtesaoRepository artesaoRepository;
    private final AlocacaoRepository alocacaoRepository;

    public FeiraController(FeiraRepository feiraRepository, ArtesaoRepository artesaoRepository, AlocacaoRepository alocacaoRepository) {
        this.feiraRepository = feiraRepository;
        this.artesaoRepository = artesaoRepository;
        this.alocacaoRepository = alocacaoRepository;
    }

    @PostMapping("")
    @Transactional
    public ResponseEntity<Object> criarFeira(@RequestBody FeiraRequest request) {
        
        Feira feira = new Feira();
        feira.setNome(request.nome());
        feira.setData(request.data());
        feira.setLocal(request.local());
        feira.setLimiteVagas(request.limiteVagas());
        
        // Regra de negócio: Ao criar, as vagas restantes são iguais ao limite
        feira.setVagasRestantes(request.limiteVagas());

        Feira feiraSalva = feiraRepository.save(feira);

        return ResponseEntity.status(HttpStatus.CREATED).body(feiraSalva);
    }

    @GetMapping("")
    @Transactional
    public ResponseEntity<Object> listarFeiras() {
        return ResponseEntity.ok(feiraRepository.findAll());
    }

    @PatchMapping("/{id}")
    @Transactional
    public ResponseEntity<Object> atualizarFeira(
            @PathVariable UUID id, 
            @RequestBody FeiraRequest request) {

        var feiraOpt = feiraRepository.findById(id);

        if (feiraOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AppError("Feira não encontrada."));

        var feira = feiraOpt.get();

        // Tratamento especial para o limite de vagas
        if (request.limiteVagas() != null && !request.limiteVagas().equals(feira.getLimiteVagas())) {
            // Calcula a diferença para ajustar as vagas restantes de forma proporcional
            int diferenca = request.limiteVagas() - feira.getLimiteVagas();
            int novasVagasRestantes = feira.getVagasRestantes() + diferenca;
            
            if (novasVagasRestantes < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AppError("O novo limite é menor que a quantidade de artesãos já alocados."));
            }
            
            feira.setLimiteVagas(request.limiteVagas());
            feira.setVagasRestantes(novasVagasRestantes);
        }

        if (request.nome() != null) feira.setNome(request.nome());
        if (request.data() != null) feira.setData(request.data());
        if (request.local() != null) feira.setLocal(request.local());

        return ResponseEntity.ok(feiraRepository.save(feira));
    }


    @PostMapping("/{feiraId}/alocar/{artesaoId}")
    @Transactional
    public ResponseEntity<Object> alocarArtesao(@PathVariable UUID feiraId, @PathVariable Long artesaoId) {
        
        var feiraOpt = feiraRepository.findById(feiraId);

        if (feiraOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AppError("Feira não encontrada."));
        if(feiraOpt.get().getVagasRestantes() <= 0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AppError("Não há vagas restantes para essa feira."));

        var artesaoOpt = artesaoRepository.findById(artesaoId);
        if (artesaoOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AppError("Artesão não encontrado."));
        if (artesaoOpt.get().getStatusCuradoria() != StatusCuradoria.APROVADO) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AppError("Artesão não aprovado na curadoria."));

        boolean jaAlocado = alocacaoRepository.existsByFeiraAndArtesao(feiraOpt.get(), artesaoOpt.get());
        if (jaAlocado) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AppError("Artesão já alocado para essa feira."));

        var alocacao = new Alocacao();
        alocacao.setFeira(feiraOpt.get());
        alocacao.setArtesao(artesaoOpt.get());
        alocacaoRepository.save(alocacao);

        var feira = feiraOpt.get();
        feira.setVagasRestantes(feira.getVagasRestantes() - 1);
        feiraRepository.save(feira);

        return ResponseEntity.ok().build();
    }
}
