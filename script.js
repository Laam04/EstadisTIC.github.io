function calcularTabla() {
    var inputValues = document.getElementById('inputValues').value;
    var valores = inputValues.split(',').map(function(item) {
        return parseInt(item.trim());
    });

    var roundAmplitud = document.getElementById('roundAmplitud').value === 'true';

    var tablaBody = document.getElementById('tablaBody');
    tablaBody.innerHTML = '';

    var frecuenciaAbsoluta = {};
    var frecuenciaAbsolutaAcumulada = 0;
    valores.forEach(function(valor) {
        if (frecuenciaAbsoluta[valor]) {
            frecuenciaAbsoluta[valor]++;
        } else {
            frecuenciaAbsoluta[valor] = 1;
        }
    });

    var totalValores = valores.length;
    var frecuenciaRelativaAcumulada = 0;

    Object.keys(frecuenciaAbsoluta).forEach(function(valor) {
        var frecAbs = frecuenciaAbsoluta[valor];
        var frecRel = (frecAbs / totalValores) * 100; // Calcula la frecuencia relativa en porcentaje
        frecuenciaRelativaAcumulada += frecRel;
        frecuenciaAbsolutaAcumulada += frecAbs;
        
        var fila = `<tr>
                        <td>${valor}</td>
                        <td>${frecAbs}</td>
                        <td>${frecRel.toFixed(2)}%</td>
                        <td>${frecuenciaAbsolutaAcumulada}</td>
                        <td>${frecuenciaRelativaAcumulada.toFixed(2)}%</td>
                    </tr>`;
        tablaBody.innerHTML += fila;
    });

    // Calcular datos para la Distribución de Frecuencias de datos agrupados
    var numeroClases = Math.ceil(Math.log2(valores.length)); // Número de clases: 2 elevado a K >= número de datos
    var valorMaximo = Math.max(...valores);
    var valorMinimo = Math.min(...valores);
    var rango = valorMaximo - valorMinimo;
    var amplitud = rango / numeroClases;
    if (roundAmplitud) {
        amplitud = Math.ceil(amplitud); // Redondear hacia arriba
    }

    var tablaBodyAgrupada = document.getElementById('tablaBodyAgrupada');
    tablaBodyAgrupada.innerHTML = '';

    var frecuenciaAbsolutaAgrupada = [];
    var frecuenciaRelativaAgrupada = [];
    var frecuenciaAbsolutaAcumuladaAgrupada = 0;
    var frecuenciaRelativaAcumuladaAgrupada = 0;

    for (var i = 0; i < numeroClases; i++) {
        var limiteInferior = valorMinimo + (i * amplitud);
        var limiteSuperior = limiteInferior + amplitud;
        var clase = `${limiteInferior} - ${limiteSuperior}`;

        // Calcular marca de clase
        var marca = (limiteInferior + limiteSuperior) / 2;

        // Calcular frecuencia absoluta agrupada
        var frecAbs = 0;
        for (var valor in frecuenciaAbsoluta) {
            if (valor >= limiteInferior && valor < limiteSuperior) {
                frecAbs += frecuenciaAbsoluta[valor];
                delete frecuenciaAbsoluta[valor]; // Eliminar el valor para evitar contar dos veces
            }
        }
        frecuenciaAbsolutaAgrupada.push(frecAbs);

        // Calcular frecuencia relativa agrupada
        var frecRel = frecAbs / totalValores * 100;
        frecuenciaRelativaAgrupada.push(frecRel);

        frecuenciaAbsolutaAcumuladaAgrupada += frecAbs;
        frecuenciaRelativaAcumuladaAgrupada += frecRel;

        var fila = `<tr>
                        <td>${clase}</td>
                        <td>${marca.toFixed(2)}</td>
                        <td>${frecAbs}</td>
                        <td>${frecRel.toFixed(2)}%</td>
                        <td>${frecuenciaAbsolutaAcumuladaAgrupada}</td>
                        <td>${frecuenciaRelativaAcumulada.toFixed(2)}%</td>
                    </tr>`;
        tablaBodyAgrupada.innerHTML += fila;
    }

    // Mostrar datos de Distribución de Frecuencias de datos agrupados
    document.getElementById('numClases').innerText = numeroClases;
    document.getElementById('rango').innerText = rango;
    document.getElementById('amplitud').innerText = amplitud;

    // Registrar datos en el historial
    var historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push(inputValues);
    localStorage.setItem('historial', JSON.stringify(historial));
}

// Función para mostrar el historial solo cuando se hace clic en el enlace
document.addEventListener('DOMContentLoaded', function() {
    var historialLink = document.querySelector('.historial-link');
    historialLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar que el enlace redirija
        window.location.href = 'historial.html'; // Redirigir manualmente al historial
    });
});
