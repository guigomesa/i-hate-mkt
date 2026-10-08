# I Hate MKT

Extensão para Chrome que, ao abrir uma página com parâmetros de rastreio, troca os valores antes de o analytics ler a URL. O time de marketing passa a ver visitas vindas de `redtube.com`, `xvideos.com` e `tibia.com`, com campanhas de nomes duvidosos.

## O que ela faz

- Troca por valores aleatórios os parâmetros `utm_*` (`source`, `medium`, `campaign`, `content`, `term`, `id`, `source_platform`, `creative_format`, `marketing_tactic`) e os equivalentes do Matomo (`mtm_*`, `pk_*`).
- Remove os IDs de clique (`gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `ttclid`, `li_fat_id`, `twclid`, `_gl`, `hsa_*`, entre outros). Sem isso, o Google Analytics atribuiria a visita ao anúncio e ignoraria as UTMs trocadas.
- Só mexe em parâmetros que já estão na URL. Não acrescenta nada.

A troca acontece no navegador, via `history.replaceState`, antes de qualquer script da página rodar. O servidor do site ainda recebe a URL original.

## Instalação

1. Baixe o `.zip` da [última release](https://github.com/guigomesa/i-hate-mkt/releases/latest) e descompacte.
2. Abra `chrome://extensions` e ligue o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e escolha a pasta descompactada.

Para atualizar, baixe a release nova, substitua a pasta e clique em recarregar no card da extensão.

## Teste

```sh
node --test
```

## Publicar uma versão

Crie uma release no GitHub com uma tag no formato `v1.2.3`. O workflow roda os testes, grava a versão no `manifest.json` e anexa `i-hate-mkt-v1.2.3.zip` à release.
