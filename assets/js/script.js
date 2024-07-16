let data;
async function obtenerMoneda() {
  try {
    const res = await fetch("https://mindicador.cl/api/");
    data = await res.json();
    return data;
  } catch (e) {
    const error = document.getElementById("error");
    error.textContent = `Hubo un error: ${e.message}`;
  }
}
obtenerMoneda();

const convertirValor = function () {
  const peso = Number(document.getElementById("peso").value);
  const resultado = document.getElementById("resultado");
  const moneda = document.getElementById("moneda").value;

  if (peso && moneda != "sin seleccion") {
    const valorConvertido = peso / data[moneda].valor;
    resultado.textContent = `El valor convertido es:  ${valorConvertido.toFixed(
      2
    )}`;
  } else {
    return alert("Debe ingresar un valor");
  }

  renderGrafico(moneda);
};

const moneda = document.getElementById("moneda");

let lineChart;

async function crearGrafico(moneda) {
  const res = await fetch(`https://mindicador.cl/api/${moneda}`);
  const valores = await res.json();
  const ultimosDias = valores.serie.slice(21, 30).reverse();

  const labels = ultimosDias.map((dia) => {
    return dia.fecha.split("T")[0];
  });
  const data = ultimosDias.map((dia) => {
    return dia.valor;
  });
  const datasets = [
    {
      label: `Últimos 10 días de ${moneda}`,
      borderColor: "rgb(48, 210, 242)",
      data,
    },
  ];
  return { labels, datasets };
}

async function renderGrafico(moneda) {
  const data = await crearGrafico(moneda);
  const config = { type: "line", data };

  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "white";
  if (lineChart) {
    lineChart.destroy();
  }
  lineChart = new Chart(myChart, config);
}
renderGrafico(moneda);
