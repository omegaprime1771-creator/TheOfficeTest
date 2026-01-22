const app = Vue.createApp({
  data() {
    return {
      titulo: "Test: ¿Qué tan fan eres de The Office?",
      nombre: "",
      vioSerie: null,

      personajes: ["Michael", "Jim", "Pam", "Dwight", "Angela", "Kevin", "Oscar", "Creed"],
      temporadas: [1, 2, 3, 4, 5, 6, 7, 8, 9],

      nuevaEncuesta: {
        personajeFav: "",
        temporadaFav: "",
        frecuencia: 0,
        vibra1: "",
        vibra2: ""
      },

      // ✅ Preguntas más difíciles + más variedad
      preguntas: [
        {
          id: "q1",
          texto: "¿En qué ciudad está la sucursal principal de la serie?",
          opciones: ["Boston, Massachusetts", "Scranton, Pennsylvania", "Miami, Florida", "New York, New York"],
          correcta: "Scranton, Pennsylvania"
        },
        {
          id: "q2",
          texto: "¿Cómo se llama la empresa donde trabajan?",
          opciones: ["Sabre", "Vance Refrigeration", "Dunder Mifflin", "Wernham Hogg"],
          correcta: "Dunder Mifflin"
        },
        {
          id: "q3",
          texto: "¿Qué vende principalmente la empresa?",
          opciones: ["Software", "Papel", "Comida", "Autos"],
          correcta: "Papel"
        },
        {
          id: "q4",
          texto: "¿Quién es el gerente regional al inicio de la serie?",
          opciones: ["Dwight Schrute", "Michael Scott", "Toby Flenderson", "Jim Halpert"],
          correcta: "Michael Scott"
        },
        {
          id: "q5",
          texto: "¿A quién le hace bromas Jim más seguido?",
          opciones: ["Ryan", "Stanley", "Dwight", "Andy"],
          correcta: "Dwight"
        },

        // Más difíciles (episodios / detalles)
        {
          id: "q6",
          texto: "¿Con qué se quema el pie Michael en 'The Injury'?",
          opciones: ["Una cafetera", "Un tostador", "Una George Foreman Grill", "Una plancha"],
          correcta: "Una George Foreman Grill"
        },
        {
          id: "q7",
          texto: "¿Cómo se llama la película de acción que hizo Michael y la proyecta en la oficina?",
          opciones: ["Agent Scarn", "Midnight Protocol", "Threat Level Midnight", "Goldenface Returns"],
          correcta: "Threat Level Midnight"
        },
        {
          id: "q8",
          texto: "En esa película, ¿cómo se llama el villano principal de Jim?",
          opciones: ["The Scranton Strangler", "Goldenface", "Night Falcon", "The Lizard King"],
          correcta: "Goldenface"
        },
        {
          id: "q9",
          texto: "¿Cómo se llama el grupo a capella de Andy en Cornell?",
          opciones: ["Scrantonicity", "The Treblemakers", "Here Comes Treble", "The Nard Dogs"],
          correcta: "Here Comes Treble"
        },
        {
          id: "q10",
          texto: "¿Cómo se llama la primera hija de Jim y Pam?",
          opciones: ["Penny", "Cecelia (Cece)", "Sylvia", "Celeste"],
          correcta: "Cecelia (Cece)"
        },
        {
          id: "q11",
          texto: "¿En qué restaurante se celebran los Dundies?",
          opciones: ["Applebee's", "Chili's", "Olive Garden", "IHOP"],
          correcta: "Chili's"
        },
        {
          id: "q12",
          texto: "¿Cómo se llama el personaje que inventa Michael para hablar de la prisión?",
          opciones: ["Prison Mike", "Jail Scott", "Convict Michael", "Felon Boss"],
          correcta: "Prison Mike"
        }
      ],

      // Respuestas (se llenan con v-model)
      respuestas: {},

      vibraReunion: [
        { texto: "Hago chistes para romper tensión", valor: "Michael" },
        { texto: "Voy directo al punto", valor: "Pam" },
        { texto: "Me burlo tantito con una broma", valor: "Jim" },
        { texto: "Quiero reglas y orden", valor: "Dwight" }
      ],
      vibraCaos: [
        { texto: "Improviso y lo vuelvo show", valor: "Michael" },
        { texto: "Calmo a todos y organizo", valor: "Pam" },
        { texto: "Me lo tomo relax y observo", valor: "Jim" },
        { texto: "Activo modo seguridad y control", valor: "Dwight" }
      ],

      mostrarResultado: false,
      resultado: { puntos: 0, nivel: "", personaje: "" },

      respuestasRecibidas: [],

      mostrarError: false,
      errorMsg: ""
    };
  },

  mounted() {
    // ✅ Revuelve opciones al cargar
    this.mezclarOpciones();
  },

  methods: {
    // Fisher-Yates (simple)
    mezclarArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    mezclarOpciones() {
      this.preguntas.forEach(p => {
        p.opciones = this.mezclarArray([...p.opciones]);
        // asegurar que exista la key para v-model
        if (this.respuestas[p.id] === undefined) this.respuestas[p.id] = "";
      });
    },

    validar() {
      this.mostrarError = false;
      this.errorMsg = "";

      if (!this.nombre.trim()) {
        this.mostrarError = true;
        this.errorMsg = "Pon tu nombre para personalizar tu resultado.";
        return false;
      }

      if (this.vioSerie !== true) {
        this.mostrarError = true;
        this.errorMsg = "Selecciona que sí has visto The Office para hacer el test.";
        return false;
      }

      if (!this.nuevaEncuesta.personajeFav || !this.nuevaEncuesta.temporadaFav) {
        this.mostrarError = true;
        this.errorMsg = "Completa personaje favorito y temporada favorita.";
        return false;
      }

      for (const p of this.preguntas) {
        if (!this.respuestas[p.id]) {
          this.mostrarError = true;
          this.errorMsg = "Te falta contestar una o más preguntas de trivia.";
          return false;
        }
      }

      if (!this.nuevaEncuesta.vibra1 || !this.nuevaEncuesta.vibra2) {
        this.mostrarError = true;
        this.errorMsg = "Completa las 2 preguntas de vibra.";
        return false;
      }

      return true;
    },

    calcularPuntosTrivia() {
      let puntos = 0;
      for (const p of this.preguntas) {
        if (this.respuestas[p.id] === p.correcta) puntos++;
      }
      return puntos;
    },

    calcularNivel(puntos) {
      const total = this.preguntas.length;
      const ratio = puntos / total;

      if (ratio <= 0.25) return "Novato";
      if (ratio <= 0.60) return "Fan casual";
      if (ratio <= 0.85) return "Fan serio";
      return "Hardcore (true fan)";
    },

    calcularPersonaje() {
      const conteo = { Michael: 0, Jim: 0, Pam: 0, Dwight: 0 };

      conteo[this.nuevaEncuesta.vibra1] = (conteo[this.nuevaEncuesta.vibra1] || 0) + 1;
      conteo[this.nuevaEncuesta.vibra2] = (conteo[this.nuevaEncuesta.vibra2] || 0) + 1;

      if (conteo[this.nuevaEncuesta.personajeFav] !== undefined) {
        conteo[this.nuevaEncuesta.personajeFav] += 1;
      }

      let ganador = "Jim";
      let max = -1;

      for (const key in conteo) {
        if (conteo[key] > max) {
          max = conteo[key];
          ganador = key;
        }
      }
      return ganador;
    },

    guardarRespuesta() {
      if (!this.validar()) return;

      const puntos = this.calcularPuntosTrivia();
      const nivel = this.calcularNivel(puntos);
      const personaje = this.calcularPersonaje();

      this.resultado = { puntos, nivel, personaje };
      this.mostrarResultado = true;

      this.respuestasRecibidas.push({
        nombre: this.nombre.trim(),
        puntos,
        nivel,
        personaje
      });

      alert(`Listo ${this.nombre.trim()} 😎. Resultado generado.`);
    },

    reiniciarTest() {
      this.mostrarResultado = false;
      this.mostrarError = false;
      this.errorMsg = "";

      this.nombre = "";
      this.vioSerie = null;

      this.nuevaEncuesta.personajeFav = "";
      this.nuevaEncuesta.temporadaFav = "";
      this.nuevaEncuesta.frecuencia = 0;
      this.nuevaEncuesta.vibra1 = "";
      this.nuevaEncuesta.vibra2 = "";

      for (const p of this.preguntas) {
        this.respuestas[p.id] = "";
      }

      this.resultado = { puntos: 0, nivel: "", personaje: "" };

      // ✅ Revuelve otra vez al reiniciar
      this.mezclarOpciones();
    }
  }
});

app.mount("#componente");