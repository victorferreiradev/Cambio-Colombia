// Adiciona uma função de evento para o botão "Consultar"
document.getElementById("consultar").addEventListener("click", async () => {

    // Obtém os valores selecionados nos campos de moeda e datas
    const moeda = document.getElementById("moeda").value;
    //console.log(moeda);
    const dataInicio = document.getElementById("data-inicio").value;
    //console.log(dataInicio);
    const dataFim = document.getElementById("data-fim").value;
    //console.log(dataFim);

    // Verifica se as datas foram preenchidas, senão exibe alerta e interrompe
    if (!dataInicio || !dataFim) {
        alert("Selecione o intervalo de datas!");
        return;
    }

    // Define o caminho do arquivo Excel baseado na moeda selecionada
    const caminho = `../public/data/tasa_${moeda}.xlsx`;

    // fetch (requisição) do arquivo Excel
    const resposta = await fetch(caminho);
    //console.log(resposta);

    // Converte a resposta para um Blob (objeto binário)
    const blob = await resposta.blob();
    //console.log(blob);

    // Converte o Blob para um ArrayBuffer (requisito para o XLSX)
    const buffer = await blob.arrayBuffer();
    //console.log(buffer);

    // Lê o conteúdo do Excel com a biblioteca XLSX
    const workbook = XLSX.read(buffer, { type: "array" });
    //console.log(workbook);

    // Seleciona a primeira planilha do arquivo
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    //console.log(sheet);

    // Converte a planilha em um array de arrays (linhas e colunas)
    const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //console.log(dados);

    // Array para armazenar os resultados encontrados no período selecionado
    const resultado = [];
    //console.log(resultado);

    // Percorre os dados, ignorando as duas primeiras linhas (títulos)
    dados.slice(2).forEach(([data, valor]) => {
        if (!data || !valor) return; // Ignora se algum valor estiver ausente

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
            //console.log(`${dataBr} - ${valorFormatado}`);
        }
    });

    // Exibe os resultados ou mensagem de "nenhum dado encontrado"
    document.getElementById("resultado-cambio").textContent =
        resultado.length > 0 ? resultado.join("\n") : "Nenhum dado encontrado para o período.";
        console.log(resultado);
});


document.getElementById("copiar").addEventListener("click", () => {
  const texto = document.getElementById("resultado-cambio").textContent.trim();
  
  if (!texto) {
    alert("Nenhum conteúdo para copiar.");
    return;
  }

  navigator.clipboard.writeText(texto).then(() => {
    alert("Resultado copiado para a área de transferência!");
  }).catch(err => {
    alert("Erro ao copiar: " + err);
  });
});
