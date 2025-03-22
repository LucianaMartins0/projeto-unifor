// Inicializa o Parse com suas credenciais
Parse.initialize("yXDH0u6E4f0GeDLnyozflrSD2exzkXzKIYsl74sH", "qFugOIJ12RV2L66EvIbh1FjrK29wExisQ7GCfm06"); 
Parse.serverURL = "https://parseapi.back4app.com/";

// Função para adicionar um carro
async function adicionarCarro() {
    const Carro = Parse.Object.extend("Carros");
    const novoCarro = new Carro();

    novoCarro.set("marca", document.getElementById("marca").value);
    novoCarro.set("modelo", document.getElementById("modelo").value);
    novoCarro.set("ano", parseInt(document.getElementById("ano").value));
    novoCarro.set("cor", document.getElementById("cor").value);
    novoCarro.set("valor", parseFloat(document.getElementById("valor").value));

    try {
        await novoCarro.save();
        alert("Carro salvo com sucesso!");
        listarCarros();
    } catch (error) {
        console.error("Erro ao salvar o carro:", error);
    }
}

// Função para listar os carros cadastrados
async function listarCarros() {
    const query = new Parse.Query("Carros");

    try {
        const carros = await query.find();
        let lista = document.getElementById("listaCarros");
        lista.innerHTML = ""; // Limpa a lista

        carros.forEach((carro) => {
            lista.innerHTML += `
                <li>
                    ${carro.get("marca")} - ${carro.get("modelo")} - ${carro.get("ano")} - 
                    ${carro.get("cor")} - R$ ${carro.get("valor").toFixed(2)}
                    <button onclick="editarCarro('${carro.id}')">Editar</button>
                    <button onclick="excluirCarro('${carro.id}')">Excluir</button>
                </li>`;
        });
    } catch (error) {
        console.error("Erro ao buscar carros:", error);
    }
}

// Função para excluir um carro
async function excluirCarro(objectId) {
    const Carro = Parse.Object.extend("Carros"); // Nome da classe no Back4App
    const query = new Parse.Query(Carro);

    try {
        const carro = await query.get(objectId);
        await carro.destroy(); // Exclui do banco de dados
        alert("Carro excluído com sucesso!");
        carregarCarros(); // Atualiza a lista
    } catch (error) {
        console.error("Erro ao excluir carro:", error);
    }
}

// Função para editar um carro
async function editarCarro(objectId) {
    const Carro = Parse.Object.extend("Carros");
    const query = new Parse.Query(Carro);

    try {
        const carro = await query.get(objectId);

        // Capturar os novos valores
        const novaMarca = prompt("Digite a nova marca do carro:", carro.get("marca"));
        if (!novaMarca) return;

        const novoModelo = prompt("Digite o novo modelo do carro:", carro.get("modelo"));
        if (!novoModelo) return;

        const novoAno = prompt("Digite o novo ano do carro:", carro.get("ano"));
        if (!novoAno || isNaN(novoAno)) return;

        const novaCor = prompt("Digite a nova cor do carro:", carro.get("cor"));
        if (!novaCor) return;

        const novoValor = prompt("Digite o novo valor do carro:", carro.get("valor"));
        if (!novoValor || isNaN(novoValor)) return;

        // Atualizar os dados do carro
        carro.set("marca", novaMarca);
        carro.set("modelo", novoModelo);
        carro.set("ano", parseInt(novoAno));
        carro.set("cor", novaCor);
        carro.set("valor", parseFloat(novoValor));

        await carro.save(); // Salva no banco de dados
        alert("Carro atualizado com sucesso!");
        listarCarros(); // Atualiza a lista na tela
    } catch (error) {
        console.error("Erro ao editar carro:", error);
    }
}


// Função para carregar carros e exibir na lista
async function carregarCarros() {
    const lista = document.getElementById("listaCarros");
    lista.innerHTML = ""; // Limpa a lista antes de carregar

    const Carro = Parse.Object.extend("Carros");
    const query = new Parse.Query(Carro);

    try {
        const resultados = await query.find();
        resultados.forEach((carro) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${carro.get("marca")} - ${carro.get("modelo")} - ${carro.get("ano")}
                <button onclick="editarCarro('${carro.id}')">Editar</button>
                <button onclick="excluirCarro('${carro.id}')">Excluir</button>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar carros:", error);
    }
}

// Chama a função ao carregar a página
listarCarros();
