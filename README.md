# 💱 Consulta de Câmbio COP para USD/EUR

Este projeto foi desenvolvido com o objetivo de **melhorar a experiência de consulta de câmbio** entre o Peso Colombiano (COP) e as moedas **Dólar Americano (USD)** e **Euro (EUR)**. Ele traz **otimizações visuais**, **desempenho aprimorado**, e **facilidade de uso para todos os membros da equipe**, com uma interface moderna e clara.

---

## 📌 Funcionalidades

✅ Seleção de moeda (USD ou EUR)
✅ Escolha de intervalo de datas (com bloqueio para datas futuras)
✅ Leitura automática de dados a partir de arquivos `.xlsx`
✅ Apresentação de resultados formatados por data e valor
✅ Aviso automático sobre cotações ainda não finalizadas (para o dólar no dia atual)
✅ Botão de cópia rápida para transferência de dados
✅ Layout responsivo e otimizado para desktop e mobile

---

## 🖼️ Interface

A interface possui um design clean, com:

* Formulário centralizado com seleção de moeda e datas
* Área de resultado bem destacada
* Aviso dinâmico com cores e ícones
* Ícone de cópia com feedback visual
* Rodapé com fonte oficial

---

## ⚙️ Tecnologias Utilizadas

* **HTML5** para estruturação da página
* **CSS3** para estilização moderna e responsiva
* **JavaScript (Vanilla)** para lógica e manipulação de DOM
* **[SheetJS (xlsx.js)](https://github.com/SheetJS/sheetjs)** para leitura de planilhas Excel
* **Arquivos `.xlsx`** com dados históricos de câmbio do Banco da República da Colômbia

---

## 📁 Estrutura de Diretórios

```
/
├── index.html          # Página principal
├── style.css           # Estilo da interface
├── script.js           # Lógica JS principal
├── /data
│   ├── tasa_usd.xlsx   # Dados de câmbio USD
│   └── tasa_eur.xlsx   # Dados de câmbio EUR
├── /libs
│   └── xlsx.full.min.js # Biblioteca SheetJS (se não for via CDN)
└── vercel.json         # Configuração para hospedagem no Vercel
```

---

## 📋 Como Usar

1. Abra o projeto no navegador (`index.html`)
2. Selecione a moeda desejada (USD ou EUR)
3. Escolha o intervalo de datas
4. Clique em **Consultar**
5. Visualize os resultados na área inferior
6. Opcionalmente, clique em **Copiar** para transferir os dados ao clipboard

---

## 🚫 Restrições

* Datas futuras estão automaticamente desabilitadas.
* Caso a cotação do dia ainda não tenha sido publicada (USD), um aviso será exibido.
* Os dados são apenas para **consulta interna** com base em fontes públicas.

---

## 📌 Observações Técnicas

* Os arquivos de dados são esperados no formato `.xlsx` com a estrutura:
  Linha 1–2: Cabeçalhos
  A partir da linha 3: dados no formato `yyyy/mm/dd` | `valor`

* O aviso para o dólar no dia atual é ativado com base na lógica de comparação de datas.

---

## 🔒 Fonte Oficial

Todos os dados apresentados são baseados na fonte oficial:
**Banco de la República de Colombia**
🔗 [https://www.banrep.gov.co](https://www.banrep.gov.co)

---

## 📦 Deploy

Este projeto está pronto para deploy em plataformas como **Vercel**, usando o arquivo `vercel.json` já configurado para:

* Servir corretamente arquivos `.xlsx` com o header de content-type apropriado
* Redirecionar todas as rotas para `index.html`

---

## 👨‍💻 Desenvolvedor

Este projeto foi idealizado para **facilitar o uso interno da equipe** e otimizar a verificação de câmbio de forma rápida e confiável.

---

