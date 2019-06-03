// Creado por: Juan David Correa Cano

const fs = require('fs');
const express = require('express')
const app = express()

const parametrosIngreso = {
  id: {
    demand: true,
    alias: 'i'
  },

  nombre: {
    demand: true,
    alias: 'n'
  },

  cedula: {
    demand: true,
    alias: 'x'
  }
}

const argv =  require('yargs')
              .command('inscribir', 'inscribir usuario a curso', parametrosIngreso)
              .argv

const cursos = [
  {
    id: 1,
    nombre: 'Matemáticas',
    duracion: '80',
    valor: 230000
  }, 
  {
    id: 2,
    nombre: 'Inglés',
    duracion: '80',
    valor: 200000
  }, 
  {
    id: 3,
    nombre: 'Programación',
    duracion: '120',
    valor: 300000
  }
];

if (argv._[0]=='inscribir') {
  inscribirAlCurso();
} else {
  listarCursos(cursos);
}


function listarCursos(listaCursos) {
  let timerDelay = 0;
  console.log('Bienvenidos a los cursos ofertados por educación continua, este es el listado de cursos disponibles: ');

  for(let i = 0; i < listaCursos.length; i++) {
    timerDelay += 2000;
    setTimeout(() => {
      let descripcion = descripcionCurso(listaCursos[i]);
      console.log(descripcion);
    }, timerDelay);
  };
}

function inscribirAlCurso() {
  let existeId = cursos.find(function(cursoFound) {
    return argv.i == cursoFound.id;
  });

  if (!existeId) {
    console.log('Ha ingresado un ID que no corresponde a ningún curso.');
    listarCursos(cursos);
  } else {
    guardarUsuarioCurso(descripcionUsuario(argv), descripcionCurso(existeId));
  }
}

function descripcionUsuario(detalleUsuario) {
  return  '--------------------------------------------------' + '\n' +
          'Estudiante: ' + detalleUsuario.nombre + ' \n' +
          'Número de cédula: ' + detalleUsuario.cedula + '\n' +
          '--------------------------------------------------';
}

function descripcionCurso(detalleCurso) {
  return  '--------------------------------------------------' + '\n' +
          'Id: ' + detalleCurso.id + '\n' +
          'Nombre: ' + detalleCurso.nombre + '\n' +
          'Duración: ' + detalleCurso.duracion + ' horas \n' +
          'Valor: ' + detalleCurso.valor + ' pesos\n' +
          '--------------------------------------------------';
}

function guardarUsuarioCurso(usuarioGuardar, cursoGuardar) {
  console.log(usuarioGuardar);
  console.log(cursoGuardar);

  let informacionGuardar =  '->>> Se ha registrado exitosamente al curso: ' + '\n' +
                            usuarioGuardar + '\n' +
                            '-> Curso: ' + '\n' +
                            cursoGuardar + '\n';

  if (!fs.existsSync('./usuariosInscritos.txt')) {
    fs.writeFile('usuariosInscritos.txt', informacionGuardar, (err) => {
      if (err) throw (err);
          console.log('Se ha creado el archivo');
    });
  } else {
    fs.appendFile('usuariosInscritos.txt', informacionGuardar, (err) => {
      if (err) throw (err);
          console.log('Se ha agregado al archivo de registros.');
    });
  }

  mostrarEnWeb(informacionGuardar);
}

function mostrarEnWeb(textoMostrar) {
  app.get('/', function (req, res) {

    let textformat = function() {
      let textArray = textoMostrar.split("\n");
      console.log(textArray);
      let webText = '';
      textArray.forEach(element => {
        console.log(element);
        webText += '</br> ' + element;
      });
      return webText;
    }
    console.log(textformat());

    res.send(textformat());
  })
  
  app.listen(3000);
}