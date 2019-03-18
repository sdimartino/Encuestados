/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.todasPreguntasBorradas = new Evento(this);
  this.cargaLocalStorage = new Evento(this);
  // this.consultar();
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    var max=0;
    if (this.preguntas.length > 0){
      max = this.preguntas[this.preguntas.length - 1].id;
    }
    return max;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas, idpregunta) {
    var modo = idpregunta? 'edicion':'alta';
    if (modo == 'alta'){
      var id = this.obtenerUltimoId();
      id++;
      var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
      this.preguntas.push(nuevaPregunta);
      this.guardar(nuevaPregunta);
    }
    else{
      var preguntaModificada = {'textoPregunta': nombre, 'id': idpregunta, 'cantidadPorRespuesta': respuestas};
      this.preguntas = this.preguntas.filter(x => x.id == idpregunta);
      this.preguntas.push(preguntaModificada);
      this.actualizar(preguntaModificada);
    }
    
    this.preguntaAgregada.notificar();
  },

  //se guardan las preguntas
  guardar: function(pregunta){
        myStorage.setItem(pregunta.id, JSON.stringify(pregunta));
  },

  actualizar: function(pregunta){
    myStorage.removeItem(id);
    myStorage.setItem(pregunta.id, JSON.stringify(pregunta));
  },

  //consulta desde el almacenamiento
  consultar: function(){
    if (myStorage.length > 0 ){
      this.preguntas = [];
      for (var i=0 ; i < myStorage.length; i++ ){
        this.preguntas.push( JSON.parse(myStorage.getItem(myStorage.key(i))));
      }
      this.cargaLocalStorage.notificar(); 
    }
  },
  //borrar almacenamiento
  borrar: function(id){
     if (!id && myStorage.length > 0){
        for(var i=0; i <= myStorage.length ; i++){
          myStorage.removeItem(myStorage.key(i));
        }
     }
     else{
        myStorage.removeItem(id);
     }
  },

  borrarPregunta: function(id){
    var preguntasfiltradas = this.preguntas.filter(function(obj){
      return obj.id != id;
    });
    this.preguntas = preguntasfiltradas;
    this.borrar(id);
    this.preguntaBorrada.notificar();
  },

  borrarTodaPregunta: function(){
    this.preguntas =[];
    this.borrarPregunta();
    this.todasPreguntasBorradas.notificar();
  }

};
