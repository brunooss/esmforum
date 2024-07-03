const bd = require("../bd/bd_utils.js");
const modelo = require("../modelo.js");

beforeEach(() => {
  bd.reconfig("./bd/esmforum-teste.db");
  // limpa dados de todas as tabelas
  bd.exec("delete from perguntas", []);
  bd.exec("delete from respostas", []);
});

test("Testando banco de dados vazio", () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test("Testando cadastro de três perguntas", () => {
  modelo.cadastrar_pergunta("1 + 1 = ?");
  modelo.cadastrar_pergunta("2 + 2 = ?");
  modelo.cadastrar_pergunta("3 + 3 = ?");
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe("1 + 1 = ?");
  expect(perguntas[1].texto).toBe("2 + 2 = ?");
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test("Testando cadastro de vinte e cinco respostas", () => {
  const id_pergunta = modelo.cadastrar_pergunta(
    "Qual é a melhor disciplina do curso de Ciência da Computação?"
  );

  const disciplinas = [
    "Estruturas de Dados",
    "Cálculo I",
    "Matemática Discreta",
    "Engenharia de Software",
    "Programação e Desenvolvimento de Software",
    "Sistemas Operacionais",
    "Fundamentos de Teoria da Computação",
    "Linguagens de Programação",
  ];

  for (let i = 0; i < 25; i++) {
    modelo.cadastrar_resposta(
      id_pergunta,
      `${disciplinas[i % disciplinas.length]}${
        i % disciplinas.length === 3
          ? "!!! 😀😀😀"
          : ", mas posso estar errado..."
      }`
    );
  }
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(25);
  expect(respostas[3].texto).toBe("Engenharia de Software!!! 😀😀😀");
  expect(respostas[1].texto).toBe("Cálculo I, mas posso estar errado...");
  expect(modelo.get_num_respostas(id_pergunta)).toBe(25);
});

test("Testando obtenção de uma pergunta", () => {
  const id_pergunta = modelo.cadastrar_pergunta(
    "Qual é a melhor disciplina do curso de Ciência da Computação?"
  );

  const pergunta_obtida = modelo.get_pergunta(id_pergunta);
  expect(pergunta_obtida.texto).toBe(
    "Qual é a melhor disciplina do curso de Ciência da Computação?"
  );
});
