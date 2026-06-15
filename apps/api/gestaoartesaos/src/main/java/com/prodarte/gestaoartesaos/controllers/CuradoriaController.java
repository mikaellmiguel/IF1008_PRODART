package com.prodarte.gestaoartesaos.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.prodarte.gestaoartesaos.dtos.RejeicaoCuradoriaRequest;
import com.prodarte.gestaoartesaos.enums.*;
import com.prodarte.gestaoartesaos.models.Curadoria;
import com.prodarte.gestaoartesaos.models.Mensagem;
import com.prodarte.gestaoartesaos.repositories.*;
import com.prodarte.gestaoartesaos.services.WhatsappService;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/curadoria")
public class CuradoriaController {


    private final ArtesaoRepository artesaoRepository;
    private final CuradoriaRepository curadoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MensagemRepository mensagemRepository;
    private final WhatsappService whatsappService;

    public CuradoriaController(ArtesaoRepository artesaoRepository, CuradoriaRepository curadoriaRepository, UsuarioRepository usuarioRepository, MensagemRepository mensagemRepository, WhatsappService whatsappService) {
        this.artesaoRepository = artesaoRepository;
        this.curadoriaRepository = curadoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.mensagemRepository = mensagemRepository;
        this.whatsappService = whatsappService;
    }
    
    @PostMapping("/aprovar/{id}")
    @Transactional
    public ResponseEntity<Object> aprovarArtesao(@PathVariable long id, Authentication authentication) {

        
        var gestor = usuarioRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Gestor logado não encontrado no sistema."));
        var artesao = artesaoRepository.findById(id);
        
        if (artesao.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var dadosArtesao = artesao.get();
        dadosArtesao.setStatusCuradoria(StatusCuradoria.APROVADO);
        artesaoRepository.save(dadosArtesao);

        var curadoria = new Curadoria();
        curadoria.setArtesao(dadosArtesao);
        curadoria.setGestor(gestor);
        curadoria.setStatus(StatusCuradoria.APROVADO);
        curadoriaRepository.save(curadoria);

        String conteudoMsg = String.format(
            "Olá %s! 🎉 Parabéns, seu cadastro no programa PRODARTE foi APROVADO! Em breve entraremos em contato com as próximas etapas.", 
            dadosArtesao.getNome()
        );

        whatsappService.enviarMensagem(dadosArtesao.getTelefone(), conteudoMsg);

        var mensagem = new Mensagem();
        mensagem.setAssunto("Cadastro Aprovado - Artesão: " + dadosArtesao.getNome());
        mensagem.setGestor(gestor);
        mensagem.setTipo(TipoMensagem.APROVACAO);
        mensagem.setArtesao(dadosArtesao);
        mensagem.setConteudo(conteudoMsg);
        mensagemRepository.save(mensagem);

        return ResponseEntity.ok().build();
    }


    @PostMapping("/rejeitar/{id}")
    @Transactional
    public ResponseEntity<Object> rejeitarArtesao(@PathVariable long id, @Valid @RequestBody RejeicaoCuradoriaRequest request, Authentication authentication) {
        var gestor = usuarioRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Gestor logado não encontrado no sistema."));
        var artesao = artesaoRepository.findById(id);
        
        if (artesao.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var dadosArtesao = artesao.get();
        dadosArtesao.setStatusCuradoria(StatusCuradoria.REPROVADO);
        artesaoRepository.save(dadosArtesao);

        var curadoria = new Curadoria();
        curadoria.setArtesao(dadosArtesao);
        curadoria.setGestor(gestor);
        curadoria.setStatus(StatusCuradoria.REPROVADO);
        curadoria.setJustificativa(request.justificativa());
        curadoriaRepository.save(curadoria);

        String conteudoMsg = String.format(
            "Olá %s. Infelizmente, seu cadastro não pôde ser aprovado neste momento.\n\nMotivo: %s\n\nVocê pode ajustar esses pontos e tentar um novo cadastro no futuro.", 
            dadosArtesao.getNome(), request.justificativa()
        );

        whatsappService.enviarMensagem(dadosArtesao.getTelefone(), conteudoMsg);

        var mensagem = new Mensagem();
        mensagem.setAssunto("Cadastro Rejeitado - Artesão: " + dadosArtesao.getNome());
        mensagem.setGestor(gestor);
        mensagem.setTipo(TipoMensagem.REJEICAO);
        mensagem.setArtesao(dadosArtesao);
        mensagem.setConteudo(conteudoMsg);
        mensagemRepository.save(mensagem);

        return ResponseEntity.ok().build();
    }
}
