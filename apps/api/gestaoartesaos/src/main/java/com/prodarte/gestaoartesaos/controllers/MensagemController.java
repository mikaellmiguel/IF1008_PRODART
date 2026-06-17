package com.prodarte.gestaoartesaos.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import com.prodarte.gestaoartesaos.dtos.EnviarMensagemRequest;
import com.prodarte.gestaoartesaos.dtos.EnviarMensagemMassaRequest;
import com.prodarte.gestaoartesaos.dtos.MensagemResumidaDto;
import com.prodarte.gestaoartesaos.enums.TipoMensagem;
import com.prodarte.gestaoartesaos.models.Mensagem;
import com.prodarte.gestaoartesaos.repositories.ArtesaoRepository;
import com.prodarte.gestaoartesaos.repositories.MensagemRepository;
import com.prodarte.gestaoartesaos.repositories.UsuarioRepository;
import com.prodarte.gestaoartesaos.services.WhatsappService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {
    
    private final WhatsappService whatsappService;
    private final MensagemRepository mensagemRepository;
    private final ArtesaoRepository artesaoRepository;
    private final UsuarioRepository usuarioRepository;

    public MensagemController(
            WhatsappService whatsappService,
            MensagemRepository mensagemRepository,
            ArtesaoRepository artesaoRepository,
            UsuarioRepository usuarioRepository) {
        this.whatsappService = whatsappService;
        this.mensagemRepository = mensagemRepository;
        this.artesaoRepository = artesaoRepository;
        this.usuarioRepository = usuarioRepository;
    }
    
    @GetMapping("/tipos")
    public ResponseEntity<Object> getTiposMensagem() {
        return ResponseEntity.ok(TipoMensagem.values());
    }

    @GetMapping
    public ResponseEntity<List<MensagemResumidaDto>> listarMensagens() {
        var mensagens = mensagemRepository.findAll();
        var dtos = mensagens.stream()
            .sorted((m1, m2) -> {
                if (m1.getEnviadaEm() == null && m2.getEnviadaEm() == null) return 0;
                if (m1.getEnviadaEm() == null) return 1;
                if (m2.getEnviadaEm() == null) return -1;
                return m2.getEnviadaEm().compareTo(m1.getEnviadaEm());
            })
            .map(m -> new MensagemResumidaDto(
                m.getId(),
                m.getConteudo(),
                m.getAssunto(),
                m.getTipo().name(),
                m.getEnviadaEm(),
                m.getArtesao().getId(),
                m.getGestor() != null ? m.getGestor().getId() : 0L,
                m.getArtesao().getNome(),
                m.getGestor() != null ? m.getGestor().getNome() : "Sistema"
            ))
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("teste")
    public ResponseEntity<Object> enviarMensagemTeste(@Valid @RequestBody EnviarMensagemRequest request) {
        var resultado = whatsappService.enviarMensagem(request.numero(), request.mensagem());
        return ResponseEntity.status(resultado.enviado() ? 200 : 502).body(resultado);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Object> enviarMensagemMassa(
            @Valid @RequestBody EnviarMensagemMassaRequest request,
            Authentication authentication
    ) {
        var gestor = usuarioRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Gestor logado não encontrado no sistema."));

        for (Long artesaoId : request.artesaoIds()) {
            var artesaoOptional = artesaoRepository.findById(artesaoId);
            if (artesaoOptional.isEmpty()) {
                continue;
            }
            var artesao = artesaoOptional.get();

            // Formata a mensagem com assunto em negrito (*Assunto*) + quebra de linha + conteúdo
            String mensagemFormatada = String.format("*%s*\n\n%s", request.assunto(), request.conteudo());

            // Envia mensagem via WhatsappService
            whatsappService.enviarMensagem(artesao.getTelefone(), mensagemFormatada);

            // Salva registro da mensagem no banco de dados
            var mensagem = new Mensagem();
            mensagem.setAssunto(request.assunto());
            mensagem.setGestor(gestor);
            mensagem.setTipo(request.tipo());
            mensagem.setArtesao(artesao);
            mensagem.setConteudo(request.conteudo());
            mensagemRepository.save(mensagem);
        }

        return ResponseEntity.ok().build();
    }
}
