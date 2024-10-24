import { ITurno } from '@/interfaces/ITurno';
import { buscarPersonalACargo, filtroPersonal, dia_laboral, obtenerNombreConReemplazo, buscarCambioTurno, obtenerDotaciones  } from '../utils/personal';
import { Vueltas } from '../interfaces/ITurno';
import { IPersonal} from '@/interfaces/IPersonal';
import { defaultCambioTurno, defaultNovedad, defaultPersonal, defaultTurnos } from '@/utils/interfacesDefault';
import { Novedad,  } from '@/interfaces/INovedades';
import { CambioTurno,  } from '@/interfaces/ICambioTurno';

describe('buscarPersonalACargo', () => {
    test('asigna correctamente el personal basado en novedades y cambios de turno', () => {
        const fecha = new Date('2024-10-17');
        const inputDate = '2024-10-17';
        const turnosAImprimir: ITurno[] = [
            {
                _id: "someId",
                itinerario: "someItinerario",
                circular: "someCircular",
                toma: "08:00",
                deja: "08:00",
                turno: "turno1",
                personal: "",
                dotacion: "someDotacion",
                especialidad: "someEspecialidad",
                ordenes: false,
                viewDetail:false,
                vueltas:  [{} as Vueltas],
            },
            {
                _id: "someId2",
                itinerario: "someItinerario2",
                circular: "someCircular2",
                toma: "08:00",
                deja: "08:00",
                turno: "turno2",
                personal: "",
                dotacion: "someDotacion2",
                especialidad: "someEspecialidad2",
                ordenes: false,
                viewDetail:false,
                vueltas:  [{} as Vueltas],
            }
        ];
        const personales: IPersonal[] = [defaultPersonal(),defaultPersonal()]
        personales[0].legajo = 123 
        personales[0].apellido = "Perez" 
        personales[0].nombres = 'Juan Ramon'
        personales[1].legajo = 124 
        personales[1].apellido = "Gómez" 
        personales[1].nombres = 'María Antonia' 
        
        const novedades: Novedad[] = [defaultNovedad(),defaultNovedad()]
        novedades[0].legajo = 123
        novedades[0].fechaBaja = '2024-10-16'
        novedades[0].fechaAlta = '2024-10-18'
        novedades[1].legajo = 12345
        novedades[1].fechaBaja = '2024-10-10'
        novedades[1].fechaAlta = '2024-10-20'
        
        const cambiosTurnos: CambioTurno[] = [defaultCambioTurno()];
        cambiosTurnos[0].personal[0].legajo = 123
        cambiosTurnos[0].personal[0].apellido = 'Pérez'
        cambiosTurnos[0].personal[0].nombres = 'Carlos'
        cambiosTurnos[0].personal[1].legajo = 12345
        cambiosTurnos[0].personal[1].apellido = 'Pérez'
        cambiosTurnos[0].personal[1].nombres = 'Carlos'
        
        buscarPersonalACargo(fecha, inputDate, turnosAImprimir, personales, novedades, cambiosTurnos);

        expect(turnosAImprimir[0].personal).toBe('Carlos Pérez');
    });

    test('asigna el nombre del personal si no hay cambios de turno', () => {
        const fecha = new Date('2024-10-17');
        const inputDate = '2024-10-17';
        const turnosAImprimir = [defaultTurnos()];
        turnosAImprimir[0].turno = 'turno1'
        const personales = [defaultPersonal()];
        personales[0].legajo = 123
        personales[0].apellido = 'Pérez'
        personales[0].nombres = 'Juan Antonio'
        const novedades = [defaultNovedad()];
        const cambiosTurnos = [defaultCambioTurno()];

        buscarPersonalACargo(fecha, inputDate, turnosAImprimir, personales, novedades, cambiosTurnos);

        expect(turnosAImprimir[0].personal).toBe('Juan Pérez');
    });
});

// Datos de prueba
const personales: IPersonal[] = [defaultPersonal(),defaultPersonal(),defaultPersonal(),defaultPersonal()];
personales[0].legajo = 1
personales[0].apellido = 'García'
personales[0].nombres = 'Juan'
personales[0].turno = '401.1'
personales[0].franco = 1
personales[0].especialidad = ''
personales[0].dotacion = ''

personales[1].legajo = 2
personales[1].apellido = 'Pérez'
personales[1].nombres = 'Carlos'
personales[1].turno = 'diag'
personales[1].franco = 2
personales[1].especialidad = ''
personales[1].dotacion = ''

personales[2].legajo = 3
personales[2].apellido = 'López'
personales[2].nombres = 'Ana'
personales[2].turno = 'diag'
personales[2].franco = 3
personales[2].especialidad = ''
personales[2].dotacion = ''

personales[3].legajo = 4
personales[3].apellido = 'Rodríguez'
personales[3].nombres = 'Luisa'
personales[3].turno = 'diag'
personales[3].franco = 2
personales[3].especialidad = ''
personales[3].dotacion = ''

describe('filtroPersonal', () => {
    it('debería retornar personal de turno prog', () => {
        const resultado = filtroPersonal('prog', new Date(), personales);
        expect(resultado).toEqual({
            turno: '401.1',
            legajo: 1,
            nombres: 'García Juan'
        });
    });

    it('debería manejar turnos con punto y día laboral', () => {
        const resultado = filtroPersonal('diag.2', new Date(), personales);
        expect(resultado).toEqual({
            turno: 'diag.2',
            legajo: 2,
            nombres: 'Pérez Carlos'
        });
    });

    it('debería retornar un ayudante si está presente', () => {
        const resultado = filtroPersonal('diag', new Date(), personales)
        expect(resultado).toEqual({
            turno: 'diag',
            legajo: 2,
            nombres: 'Pérez Carlos - Ayudante: Rodríguez Luisa'
        });
    });

    it('debería manejar casos de error cuando el día laboral no es un número', () => {
        const resultado = filtroPersonal('diag.X', new Date(), personales);
        expect(resultado).toEqual({
            turno: 'diag.X',
            legajo: 0,
            nombres: ''
        });
    });

    it('debería retornar un objeto vacío si no hay personal', () => {
        const resultado = filtroPersonal('noExiste', new Date(), personales);
        expect(resultado).toEqual({
            turno: 'noexiste',
            legajo: 0,
            nombres: ''
        });
    });
});

describe('dia_laboral', () => {
    test('Devuelve el día correcto del franco del turno', () => {
        expect(dia_laboral(1, 0)).toBe(6); // Domingo, diagrama[1] = Lunes
        expect(dia_laboral(0, 3)).toBe(3); // Miércoles, diagrama[0] = Domingo
        expect(dia_laboral(6, 6)).toBe(0); // Sábado, diagrama[6] = Viernes
    });

    test('Devuelve un error si los valores no están en el rango permitido', () => {
        expect(() => dia_laboral(-1, 2)).toThrow('Los valores de \'diaLaboral\' y \'hoy\' deben estar en el rango de 0 a 6.');
        expect(() => dia_laboral(2, 7)).toThrow('Los valores de \'diaLaboral\' y \'hoy\' deben estar en el rango de 0 a 6.');
    });
});



describe('obtenerNombreConReemplazo', () => {
    const novedadMock: Novedad = {
        remplazo: [
            { inicioRelevo: '2024-01-01', finRelevo: '2024-01-31', legajo: 123, apellido: 'Perez', nombres: 'Juan' },
        ],
    };
    const cambiosTurnosMock: CambioTurno[] = [
        { legajo: 123, apellido: 'Garcia', nombres: 'Carlos', fecha: '2024-01-15' },
    ];

    test('Devuelve el nombre del personal cambiado de turno', () => {
        const result = obtenerNombreConReemplazo(novedadMock, '2024-01-15', cambiosTurnosMock);
        expect(result).toBe('Garcia Carlos');
    });

    test('Devuelve el nombre del reemplazo si no hay cambio de turno', () => {
        const result = obtenerNombreConReemplazo(novedadMock, '2024-01-05', []);
        expect(result).toBe('Perez Juan');
    });

    test('Devuelve "Sin Cubrir" si no hay reemplazo válido', () => {
        const result = obtenerNombreConReemplazo(novedadMock, '2024-02-01', []);
        expect(result).toBe('Sin Cubrir');
    });

    test('Devuelve "Sin Cubrir" si el legajo del reemplazo es null', () => {
        const novedadNullLegajo: Novedad = {
            remplazo: [
                { inicioRelevo: '2024-01-01', finRelevo: '2024-01-31', legajo: null, apellido: 'Perez', nombres: 'Juan' },
            ],
        };
        const result = obtenerNombreConReemplazo(novedadNullLegajo, '2024-01-05', []);
        expect(result).toBe('');
    });

    test('Devuelve "Sin Cubrir" si no hay reemplazos', () => {
        const novedadSinReemplazo: Novedad = { remplazo: [] };
        const result = obtenerNombreConReemplazo(novedadSinReemplazo, '2024-01-05', []);
        expect(result).toBe('Sin Cubrir');
    });
});


describe('buscarCambioTurno', () => {
    const cambiosTurnosMock: CambioTurno[] = [
        { fechaCambio: '2024-01-15', personal: [{ legajo: 123, apellido: 'Garcia', nombres: 'Carlos' }, { legajo: 124, apellido: 'Lopez', nombres: 'Ana' }] },
        { fechaCambio: '2024-01-16', personal: [{ legajo: 125, apellido: 'Perez', nombres: 'Juan' }, { legajo: 123, apellido: 'Garcia', nombres: 'Carlos' }] },
    ];

    test('Devuelve el personal cambiado de turno por legajo', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-01-15', 123);
        expect(result).toEqual({ legajo: 124, apellido: 'Lopez', nombres: 'Ana' });
    });

    test('Devuelve el personal cambiado de turno por legajo desde el segundo personal', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-01-16', 123);
        expect(result).toEqual({ legajo: 125, apellido: 'Perez', nombres: 'Juan' });
    });

    test('Devuelve undefined si no hay cambio de turno para la fecha dada', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-01-17', 123);
        expect(result).toBeUndefined();
    });

    test('Devuelve undefined si el legajo no está en los cambios de turno', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-01-15', 999);
        expect(result).toBeUndefined();
    });
});


describe('obtenerDotaciones', () => {
    const personalMock: IPersonal[] = [
        { legajo: 1, apellido: 'Garcia', nombres: 'Carlos', dotacion: 'A1' },
        { legajo: 2, apellido: 'Lopez', nombres: 'Ana', dotacion: 'A2' },
        { legajo: 3, apellido: 'Perez', nombres: 'Juan', dotacion: 'A1' },
        { legajo: 4, apellido: 'Martinez', nombres: 'Laura' }, // sin dotación
        { legajo: 5, apellido: 'Fernandez', nombres: 'Pedro', dotacion: null } // dotación nula
    ];

    test('Devuelve las dotaciones únicas', () => {
        const result = obtenerDotaciones(personalMock);
        expect(result).toEqual(['A1', 'A2']);
    });

    test('Devuelve un array vacío si no hay dotaciones', () => {
        const result = obtenerDotaciones([
            { legajo: 1, apellido: 'Garcia', nombres: 'Carlos' }, // sin dotación
        ]);
        expect(result).toEqual([]);
    });

    test('Devuelve un array vacío si todas las dotaciones son nulas', () => {
        const result = obtenerDotaciones([
            { legajo: 1, apellido: 'Garcia', nombres: 'Carlos', dotacion: null },
            { legajo: 2, apellido: 'Lopez', nombres: 'Ana', dotacion: null }
        ]);
        expect(result).toEqual([]);
    });
});




