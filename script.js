// ================================================
// Função principal para consulta de câmbio
// ================================================

// Data limite em que os dados estão consolidados
// IMPORTANTE: deve representar a ÚLTIMA DATA COMPLETA disponível
const DATA_ULTIMA_ATUALIZACAO = "2026-01-19";

// Exibe dinamicamente a última data de extração no HTML
document.addEventListener("DOMContentLoaded", () => {
  const elementoData = document.getElementById("ultima-data");

  if (elementoData) {
    const dataFormatada = new Date(DATA_ULTIMA_ATUALIZACAO)
      .toLocaleDateString("es-CO");

    elementoData.innerText = dataFormatada;
  }
});


document.getElementById("consultar").addEventListener("click", async () => {
  try {
    // Obtém os valores selecionados nos campos de moeda e datas
    const moeda = document.getElementById("moeda").value;
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;
    const hoje = new Date().toISOString().split("T")[0];

    // Verifica se as datas foram preenchidas
    if (!dataInicio || !dataFim) {
      alert("Por favor, seleccione el intervalo completo de fechas."); return;
    }

    // ================================================
    // Busca do arquivo Excel conforme moeda selecionada
    // ================================================

    const caminho = `/data/tasa_${moeda}.xlsx`;
    const resposta = await fetch(caminho);

    // Verifica se o arquivo foi encontrado
    if (!resposta.ok) {
      throw new Error(
        `Archivo de tipo de cambio no encontrado: ${resposta.status} ${resposta.statusText}`
      );
    };
    // Verifica se o conteúdo retornado é um arquivo Excel
    const contentType = resposta.headers.get("content-type");
    if (!contentType.includes("spreadsheet")) {
      throw new Error(
        `Tipo de archivo inválido. Se esperaba Excel, se recibió: ${contentType}`
      );
    }

    console.log("Arquivo Excel válido! Processando...");

    // ================================================
    // Leitura e processamento do arquivo Excel
    // ================================================

    const blob = await resposta.blob();
    const buffer = await blob.arrayBuffer();

    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const resultado = [];

    // Percorre os dados ignorando cabeçalhos
    dados.slice(2).forEach(([data, valor]) => {
      if (!data || !valor) return;

      // Converte data do Excel (yyyy/mm/dd) para ISO (yyyy-mm-dd)
      const [ano, mes, dia] = data.split("/");
      const dataFormatada = `${ano}-${mes}-${dia}`;

      // Verifica se está dentro do intervalo selecionado
      if (dataFormatada >= dataInicio && dataFormatada <= dataFim) {
        const dataBr = `${dia}/${mes}/${ano}`;

        const valorFormatado = parseFloat(valor).toLocaleString("pt-BR", {
          minimumFractionDigits: 5,
          maximumFractionDigits: 5
        });

        resultado.push(`${dataBr} - ${valorFormatado}`);
      }
    });

    // ================================================
    // Validações de período e avisos ao usuário
    // ================================================

    const avisoElement = document.getElementById("aviso");

    // Limpa avisos anteriores
    avisoElement.classList.add("oculto");
    avisoElement.innerText = "";

    // Verifica se o período inclui a ÚLTIMA DATA DISPONÍVEL da base
    const periodoIncluiUltimaData =
      dataInicio <= DATA_ULTIMA_ATUALIZACAO &&
      dataFim >= DATA_ULTIMA_ATUALIZACAO;

    // Verifica se o período ultrapassa a última atualização disponível
    const verificacao = verificarDesatualizacao(dataInicio, dataFim);

    if (verificacao.desatualizado) {
      avisoElement.innerText = verificacao.mensagem;
      avisoElement.classList.remove("oculto");
    }

    // Aviso específico para USD quando o período inclui o dia atual
    if ((moeda === "USD" || moeda === "usd") && periodoIncluiUltimaData) {
      avisoElement.innerText +=
        (avisoElement.innerText ? "\n\n" : "") +
        "⚠️ Observación: la cotización del dólar correspondiente a la última fecha disponible aún puede estar sujeta a ajustes.";
      avisoElement.classList.remove("oculto");
    }

    // ================================================
    // Exibição do resultado final
    // ================================================

    document.getElementById("resultado-cambio").textContent =
      resultado.length > 0
        ? resultado.join("\n")
        : "No se encontraron datos para el período seleccionado.";
  } catch (error) {
    console.error("Erro durante a consulta:", error);

    document.getElementById("resultado-cambio").textContent =
      `Error: ${error.message}\n\nPor favor, verifique:\n` +
      `1. Si los archivos de datos están disponibles en el servidor\n` +
      `2. El intervalo de fechas seleccionado\n` +
      `3. Su conexión a internet`;
    if (!error.message.includes("datas")) {
      alert(`¡Ups! Algo salió mal: ${error.message}`);
    }
  }
});

// ================================================
// Função de validação da atualização dos dados
// ================================================
function verificarDesatualizacao(dataInicio, dataFim) {
  const ultimaAtualizacao = new Date(DATA_ULTIMA_ATUALIZACAO);
  const fimSelecionado = new Date(dataFim);

  // Verifica se o período solicitado ultrapassa a base consolidada
  if (fimSelecionado > ultimaAtualizacao) {
    return {
      desatualizado: true,
      mensagem:
        `⚠️ Atención: los datos están consolidados únicamente hasta ${ultimaAtualizacao.toLocaleDateString("pt-BR")}.\n\n` +
        `Las fechas posteriores aún no cuentan con valores definitivos y pueden sufrir ajustes futuros.`
    };
  }

  return { desatualizado: false };
}

// ================================================
// Função para copiar resultados para a área de transferência
// ================================================
document.getElementById("copiar").addEventListener("click", async () => {
  try {
    const texto = document.getElementById("resultado-cambio").textContent.trim();

    if (!texto || texto.includes("Error:") || texto.includes("No se encontraron")) {
      alert("No hay resultados válidos para copiar. Realice una consulta primero.");
      return;
    }


    await navigator.clipboard.writeText(texto);

    const botao = document.getElementById("copiar");
    const originalHTML = botao.innerHTML;

    botao.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none">' +
      '<path fill="green" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' +
      "</svg> ¡Copiado!";


    setTimeout(() => {
      botao.innerHTML = originalHTML;
    }, 2000);

  } catch (err) {
    console.error("Falha ao copiar:", err);
    alert(
      "No fue posible copiar el contenido. Puede seleccionar y copiar manualmente (Ctrl+C)."
    );
  }
});

// ================================================
// Restrição de seleção de datas futuras
// ================================================
document.getElementById("data-inicio").max = new Date().toISOString().split("T")[0];
document.getElementById("data-fim").max = new Date().toISOString().split("T")[0];
