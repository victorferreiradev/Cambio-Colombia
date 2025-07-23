// ================================================
// Função principal para consulta de câmbio
// ================================================

document.getElementById("consultar").addEventListener("click", async () => {
  try {
    // Obtém os valores selecionados nos campos de moeda e datas
    const moeda = document.getElementById("moeda").value;
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;
    const hoje = new Date().toISOString().split('T')[0];

    // Define se o período inclui a data de hoje
    const periodoIncluiHoje = (dataInicio <= hoje && dataFim >= hoje);
/*
    // Bloqueia datas futuras
    if (dataInicio > hoje || dataFim > hoje) {
      alert("Não é possível selecionar datas futuras. Por favor, escolha datas até hoje.");
      return;
    }
*/

    // Define o caminho do arquivo Excel baseado na moeda selecionada
    const caminho = `/data/tasa_${moeda}.xlsx`;
    // Fetch (requisição) do arquivo Excel com tratamento de erros
    const resposta = await fetch(caminho);

    // Verifica se o arquivo foi encontrado (status 200-299)
    if (!resposta.ok) {
      throw new Error(`Arquivo de taxa de câmbio não encontrado: ${resposta.status} ${resposta.statusText}`);
    }

    // Verifica o tipo de conteúdo do arquivo
    const contentType = resposta.headers.get('content-type');
    if (!contentType.includes('spreadsheet')) {
      throw new Error(`Tipo de arquivo inválido. Esperado Excel, recebido: ${contentType}`);
    }
    console.log("Arquivo Excel válido! Processando...");

    // Verifica se as datas foram preenchidas, senão exibe alerta e interrompe
    if (!dataInicio || !dataFim) {
      alert("Por favor, selecione o intervalo de datas completo!");
      return;
    }

    // Converte a resposta para um Blob (objeto binário)
    const blob = await resposta.blob();

    // Converte o Blob para um ArrayBuffer (requisito para o XLSX)
    const buffer = await blob.arrayBuffer();

    // Lê o conteúdo do Excel com a biblioteca XLSX
    const workbook = XLSX.read(buffer, { type: "array" });

    // Seleciona a primeira planilha do arquivo
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Converte a planilha em um array de arrays (linhas e colunas)
    const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Array para armazenar os resultados encontrados no período selecionado
    const resultado = [];

    // Percorre os dados, ignorando as duas primeiras linhas (títulos)
    dados.slice(2).forEach(([data, valor]) => {
      // Ignora linhas com dados ausentes
      if (!data || !valor) return;

      // Divide a data do Excel no formato "yyyy/mm/dd"
      const [ano, mes, dia] = data.split('/');

      // Reorganiza para o formato ISO (yyyy-mm-dd) para facilitar comparação
      const dataFormatada = `${ano}-${mes}-${dia}`;

      // Verifica se a data está dentro do intervalo selecionado
      if (dataFormatada >= dataInicio && dataFormatada <= dataFim) {
        // Formata a data para padrão brasileiro (dd/mm/yyyy)
        const dataBr = `${dia}/${mes}/${ano}`;

        // Formata o valor para exibir com 5 casas decimais e separador BR
        const valorFormatado = parseFloat(valor).toLocaleString("pt-BR", {
          minimumFractionDigits: 5,
          maximumFractionDigits: 5
        });

        // Adiciona o resultado formatado ao array
        resultado.push(`${dataBr} - ${valorFormatado}`);
      }
    });

    // ================================================
    // aviso para USD:
    // ================================================

    const avisoElement = document.getElementById("aviso");

    // Oculta o aviso inicialmente
    avisoElement.classList.add("oculto");
    avisoElement.innerText = "";

    
    // Adiciona aviso para USD com data atual
    if (moeda === 'USD' || moeda === 'usd' && periodoIncluiHoje) {
      avisoElement.innerText = "⚠️ Atención: La cotización del dólar de hoy aún está abierta y puede estar sujeta a cambios.";
      avisoElement.classList.remove("oculto");
    }

    // Exibe os resultados ou mensagem de "nenhum dado encontrado"
    document.getElementById("resultado-cambio").textContent =
      resultado.length > 0
        ? resultado.join("\n")
        : "Nenhum dado encontrado para o período selecionado.";

  } catch (error) {
    // Tratamento de erros detalhado
    console.error("Erro durante a consulta:", error);

    // Exibe mensagem de erro amigável para o usuário
    document.getElementById("resultado-cambio").textContent =
      `Erro: ${error.message}\n\nPor favor, verifique:\n1. Se os arquivos de dados estão no servidor\n2. O intervalo de datas selecionado\n3. Sua conexão com a internet`;

    // Alerta adicional para erros graves
    if (!error.message.includes("datas")) {
      alert(`Ops! Algo deu errado: ${error.message}`);
    }
  }
});


// ================================================
// Função para copiar resultados para área de transferência
// ================================================
document.getElementById("copiar").addEventListener("click", async () => {
  try {
    // Obtém o texto do resultado e remove espaços extras
    const texto = document.getElementById("resultado-cambio").textContent.trim();

    // Verifica se há conteúdo para copiar
    if (!texto || texto.includes("Erro:") || texto.includes("Nenhum dado")) {
      alert("Nenhum resultado válido para copiar. Realize uma consulta primeiro.");
      return;
    }

    // Tenta copiar para a área de transferência
    await navigator.clipboard.writeText(texto);

    // Feedback visual temporário
    const botao = document.getElementById("copiar");
    const originalHTML = botao.innerHTML;
    botao.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fill="green" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg> Copiado!';

    // Restaura o botão após 2 segundos
    setTimeout(() => {
      botao.innerHTML = originalHTML;
    }, 2000);
  } catch (err) {
    console.error("Falha ao copiar:", err);
    alert("Não foi possível copiar. Você pode selecionar e copiar manualmente (Ctrl+C).");
  }
});

//Restrição de datas futuras
document.getElementById("data-inicio").max = new Date().toISOString().split('T')[0];
document.getElementById("data-fim").max = new Date().toISOString().split('T')[0];
