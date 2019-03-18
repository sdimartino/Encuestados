/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas, idpregunta) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },

  borrarPregunta: function(id){
    this.modelo.borrarPregunta(id);
  },

  borrarTodaPregunta: function(){
    this.modelo.borrarTodaPregunta();
  },

  consultarPreguntas: function(){
    this.modelo.consultar();
  }
};
