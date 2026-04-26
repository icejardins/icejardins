(function () {
  var reader = document.querySelector("[data-sermon-reader]");
  var article = document.querySelector("[data-sermon-text]");
  if (!reader || !article) return;

  var play = reader.querySelector("[data-reader-play]");
  var pause = reader.querySelector("[data-reader-pause]");
  var stop = reader.querySelector("[data-reader-stop]");
  var status = reader.querySelector("[data-reader-status]");
  var synth = window.speechSynthesis;
  var chunks = [];
  var index = 0;
  var current = null;
  var supported = !!(synth && window.SpeechSynthesisUtterance);

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  function splitText(text) {
    var sentences = (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []);
    return sentences
      .reduce(function (acc, sentence) {
        var last = acc[acc.length - 1] || "";
        if ((last + " " + sentence).length < 850) {
          acc[acc.length - 1] = (last + " " + sentence).trim();
        } else {
          acc.push(sentence.trim());
        }
        return acc;
      }, [""])
      .filter(Boolean);
  }

  function pickVoice() {
    var voices = synth.getVoices ? synth.getVoices() : [];
    return voices.find(function (voice) {
      return /^pt-BR/i.test(voice.lang || "");
    }) || voices.find(function (voice) {
      return /^pt/i.test(voice.lang || "");
    }) || voices[0] || null;
  }

  function setButtons(state) {
    var isReading = state === "reading";
    var isPaused = state === "paused";
    if (play) {
      play.disabled = isReading;
      play.textContent = isPaused ? "Continuar leitura" : "Ouvir leitura";
    }
    if (pause) pause.disabled = !isReading;
    if (stop) stop.disabled = !(isReading || isPaused);
  }

  function finish() {
    index = 0;
    current = null;
    setButtons("idle");
    setStatus("Leitura concluída. Você também pode ler o sermão completo abaixo.");
  }

  function speakNext() {
    if (index >= chunks.length) {
      finish();
      return;
    }

    current = new SpeechSynthesisUtterance(chunks[index]);
    current.lang = "pt-BR";
    current.rate = 0.96;
    current.pitch = 1;
    current.voice = pickVoice();
    current.onend = function () {
      index += 1;
      speakNext();
    };
    current.onerror = function () {
      setButtons("idle");
      setStatus("Não consegui iniciar a voz neste navegador. O texto completo está disponível abaixo.");
    };
    synth.speak(current);
    setButtons("reading");
    setStatus("Lendo o sermão em voz alta. A voz pode variar conforme o dispositivo.");
  }

  function start() {
    if (!supported) return;

    if (synth.paused) {
      synth.resume();
      setButtons("reading");
      setStatus("Leitura retomada.");
      return;
    }

    synth.cancel();
    index = 0;
    chunks = splitText(article.innerText || article.textContent || "");
    if (!chunks.length) {
      setStatus("Não encontrei texto suficiente para leitura.");
      return;
    }
    speakNext();
  }

  if (!supported) {
    reader.classList.add("is-unsupported");
    setStatus("Leitura em voz alta indisponível neste navegador. O texto completo está abaixo.");
    if (play) play.disabled = true;
    if (pause) pause.disabled = true;
    if (stop) stop.disabled = true;
    return;
  }

  setButtons("idle");
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = pickVoice;
  }

  play && play.addEventListener("click", start);
  pause && pause.addEventListener("click", function () {
    synth.pause();
    setButtons("paused");
    setStatus("Leitura pausada.");
  });
  stop && stop.addEventListener("click", function () {
    synth.cancel();
    index = 0;
    current = null;
    setButtons("idle");
    setStatus("Leitura parada. O texto completo está logo abaixo.");
  });

  window.addEventListener("beforeunload", function () {
    synth.cancel();
  });
})();
