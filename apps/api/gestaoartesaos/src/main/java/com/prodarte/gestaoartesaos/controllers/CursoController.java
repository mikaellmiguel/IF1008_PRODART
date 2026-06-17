package com.prodarte.gestaoartesaos.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.prodarte.gestaoartesaos.models.Curso;
import com.prodarte.gestaoartesaos.models.Artesao;
import com.prodarte.gestaoartesaos.repositories.CursoRepository;
import com.prodarte.gestaoartesaos.repositories.ArtesaoRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/curso")
public class CursoController {

    private final CursoRepository cursoRepository;
    private final ArtesaoRepository artesaoRepository;

    public CursoController(CursoRepository cursoRepository, ArtesaoRepository artesaoRepository) {
        this.cursoRepository = cursoRepository;
        this.artesaoRepository = artesaoRepository;
    }

    public record CriarCursoRequest(String nome, LocalDateTime dataConclusao, Long artesaoId) {}

    @PostMapping("")
    @Transactional
    public ResponseEntity<Object> criarCurso(@RequestBody CriarCursoRequest request) {
        var artesaoOpt = artesaoRepository.findById(request.artesaoId());
        if (artesaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var artesao = artesaoOpt.get();

        var curso = new Curso();
        curso.setNome(request.nome());
        curso.setDataConclusao(request.dataConclusao());
        curso.setArtesao(artesao);

        var salvo = cursoRepository.save(curso);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Object> deletarCurso(@PathVariable Long id) {
        if (!cursoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cursoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
