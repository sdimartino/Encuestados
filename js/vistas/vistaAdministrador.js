/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;
//  var modoEdicion = false;
  var preguntaAEditar= null;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaBorrada.suscribir(function(){
    contexto.reconstruirLista();
  });

  this.modelo.todasPreguntasBorradas.suscribir(function(){
    contexto.reconstruirLista();
  });

  this.modelo.cargaLocalStorage.suscribir(function(){
    contexto.reconstruirLista();
  })
};

VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
       
    //nuevoItem = $("<li class='list-group-item' id='" + pregunta.id +"'>"+  pregunta.textoPregunta +"</li>");
    if (pregunta){
      nuevoItem = $(`<li class='list-group-item' id='${pregunta.id}'> ${pregunta.textoPregunta} </li>`);
    
      var interiorItem  = $('.d-flex');
      var titulo = interiorItem.find('h5');
      titulo.text(pregunta.textoPregunta);
      interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
        return " " + resp.textoRespuesta;
      }));
      nuevoItem.html($('.d-flex').html());
    }
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];
      var idPreguntaAEditar = contexto.preguntaAEditar.length > 0? contexto.preguntaAEditar[0].id: null;

      $('[name="option[]"]').each(function(x) {
        //completar
        if ( $(this).val() != ""){
          var rta = {
            textoRespuesta : $(this).val(),
            cantidad: 0
          }
          respuestas.push(rta);    
        }
      })
      contexto.limpiarRespuestas();
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas, idPreguntaAEditar);
    });
    //asociar el resto de los botones a eventos

    e.botonBorrarPregunta.click(function() {
       var id = parseInt($('.list-group-item.active').attr('id'));
       contexto.controlador.borrarPregunta(id);  
    });
    
    e.borrarTodo.click(function(){
      var ids = parseInt($('.list-group-item').attr('id'));
      contexto.controlador.borrarTodaPregunta();
    });

    e.botonEditarPregunta.click(function(){
      var idpregunta =  parseInt($('.list-group-item.active').attr('id'));
      contexto.preguntaAEditar = modelo.preguntas.filter(function(preg){
        return preg.id == idpregunta;
      });
      var respuestasElegidas = contexto.preguntaAEditar[0].cantidadPorRespuesta;
      e.pregunta.val(contexto.preguntaAEditar[0].textoPregunta) ;
      
      contexto.limpiarRespuestas();
      respuestasElegidas.forEach(rta => {
        agregarCampoRespuesta(rta.textoRespuesta);
      });
      // modoEdicion = true;
    });

  },

  limpiarRespuestas: function(){
    var elementosRtas = $('.botonBorrarRespuesta:visible');
    for(var i=0; i < elementosRtas.length; i++){
      borrarCampoRespuesta(elementosRtas[i]);
    }
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
