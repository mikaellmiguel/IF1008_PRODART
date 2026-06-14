package com.prodarte.gestaoartesaos.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.prodarte.gestaoartesaos.dtos.ArtesaoFiltroDto;
import com.prodarte.gestaoartesaos.enums.Segmento;
import com.prodarte.gestaoartesaos.enums.StatusCuradoria;
import com.prodarte.gestaoartesaos.models.Artesao;
import jakarta.persistence.criteria.Predicate;

public class ArtesaoSpecification {
    
   public static Specification<Artesao> comFiltros(ArtesaoFiltroDto filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filtro.nome() != null && !filtro.nome().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + filtro.nome().toLowerCase() + "%"));
            }

            if (filtro.nome() != null && !filtro.nome().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nomeMarca")), "%" + filtro.nome().toLowerCase() + "%"));
            }

            if (filtro.email() != null && !filtro.email().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + filtro.email().toLowerCase() + "%"));
            }

            if (filtro.telefone() != null && !filtro.telefone().isBlank()) {
                predicates.add(cb.like(root.get("telefone"), "%" + filtro.telefone() + "%"));
            }

            if (filtro.bairro() != null && !filtro.bairro().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("bairro")), "%" + filtro.bairro().toLowerCase() + "%"));
            }

            if (filtro.estado() != null && !filtro.estado().isBlank()) {
                // Mapeia para a propriedade "uf" da entidade
                predicates.add(cb.equal(cb.lower(root.get("uf")), filtro.estado().toLowerCase()));
            }

            if (filtro.categoria() != null && !filtro.categoria().isBlank()) {
                // Mapeia para a propriedade "categoriaProduto"
                predicates.add(cb.like(cb.lower(root.get("categoriaProduto")), "%" + filtro.categoria().toLowerCase() + "%"));
            }

            if (filtro.possuiMei() != null) {
                predicates.add(cb.equal(root.get("possuiMEI"), filtro.possuiMei()));
            }

            // Tratamento de Enums
            if (filtro.segmento() != null && !filtro.segmento().isBlank()) {
                predicates.add(cb.equal(root.get("segmento"), Segmento.valueOf(filtro.segmento().toUpperCase())));
            }

            if (filtro.statusCuradoria() != null && !filtro.statusCuradoria().isBlank()) {
                predicates.add(cb.equal(root.get("statusCuradoria"), StatusCuradoria.valueOf(filtro.statusCuradoria().toUpperCase())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
   }
}
