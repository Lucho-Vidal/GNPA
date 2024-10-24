import { obtenerTiposCirculares, filtrarPorTurno, filtroTrenes, filtroItinerario, buscarCambioTurno } from "@/utils/turnos";

describe('obtenerTiposCirculares', () => {
    const turnosMock: ITurno[] = [
        { _id: 1, itinerario: 'A', circular: 'C1', toma: 'M' },
        { _id: 2, itinerario: 'B', circular: 'C2', toma: 'N' },
        { _id: 3, itinerario: 'C', circular: 'C1', toma: 'M' },
        { _id: 4, itinerario: 'D', circular: undefined, toma: 'O' }, // sin circular
        { _id: 5, itinerario: 'E', circular: null, toma: 'P' } // circular nula
    ];

    test('Devuelve los tipos circulares únicos', () => {
        const result = obtenerTiposCirculares(turnosMock);
        expect(result).toEqual(['C1', 'C2']);
    });

    test('Devuelve un array vacío si no hay tipos circulares', () => {
        const result = obtenerTiposCirculares([
            { _id: 1, itinerario: 'A', toma: 'M' }, // sin circular
        ]);
        expect(result).toEqual([]);
    });

    test('Devuelve un array vacío si todos los tipos circulares son nulos', () => {
        const result = obtenerTiposCirculares([
            { _id: 1, itinerario: 'A', circular: null, toma: 'M' },
            { _id: 2, itinerario: 'B', circular: null, toma: 'N' }
        ]);
        expect(result).toEqual([]);
    });
});


describe('filtrarPorTurno', () => {
    const listaTurnosMock: ITurno[] = [
        { _id: 1, itinerario: 'A', turno: 'Mañana', circular: 'C1' },
        { _id: 2, itinerario: 'A', turno: 'Tarde', circular: 'C2' },
        { _id: 3, itinerario: 'B', turno: 'Mañana', circular: 'C1' },
        { _id: 4, itinerario: 'A', turno: 'Noche', circular: 'C2' },
        { _id: 5, itinerario: 'A', turno: 'Mañana', circular: 'C3' },
    ];

    test('Filtra los turnos correctamente según los criterios', () => {
        const result = filtrarPorTurno('A', listaTurnosMock, ['C1', 'C2'], 'Mañana');
        expect(result).toEqual([
            { _id: 1, itinerario: 'A', turno: 'Mañana', circular: 'C1' },
            { _id: 5, itinerario: 'A', turno: 'Mañana', circular: 'C3' },
        ]);
    });

    test('No devuelve turnos si no hay coincidencias', () => {
        const result = filtrarPorTurno('B', listaTurnosMock, ['C2'], 'Noche');
        expect(result).toEqual([]);
    });

    test('Devuelve un array vacío si circularSeleccionada está vacía', () => {
        const result = filtrarPorTurno('A', listaTurnosMock, [], 'Mañana');
        expect(result).toEqual([]);
    });

    test('Devuelve un array vacío si no hay turnos con el itinerario especificado', () => {
        const result = filtrarPorTurno('C', listaTurnosMock, ['C1'], 'Mañana');
        expect(result).toEqual([]);
    });
});


describe('filtroTrenes', () => {
    const listaTurnosMock: ITurno[] = [
        { 
            _id: 1, 
            itinerario: 'A', 
            circular: 'C1', 
            vueltas: [{ tren: 'Tren1' }, { tren: 'Tren2' }] 
        },
        { 
            _id: 2, 
            itinerario: 'A', 
            circular: 'C2', 
            vueltas: [{ tren: 'Tren3' }] 
        },
        { 
            _id: 3, 
            itinerario: 'B', 
            circular: 'C1', 
            vueltas: [{ tren: 'Tren1' }, { tren: 'Tren4' }] 
        },
        { 
            _id: 4, 
            itinerario: 'A', 
            circular: 'C1', 
            vueltas: [{ tren: 'Tren1' }] 
        },
    ];

    test('Filtra los turnos que viajan en el tren especificado', () => {
        const result = filtroTrenes('A', listaTurnosMock, ['C1'], 'Tren1');
        expect(result).toEqual([
            { 
                _id: 1, 
                itinerario: 'A', 
                circular: 'C1', 
                vueltas: [{ tren: 'Tren1' }, { tren: 'Tren2' }] 
            },
            { 
                _id: 4, 
                itinerario: 'A', 
                circular: 'C1', 
                vueltas: [{ tren: 'Tren1' }] 
            },
        ]);
    });

    test('No devuelve turnos si no hay coincidencias', () => {
        const result = filtroTrenes('B', listaTurnosMock, ['C1'], 'Tren2');
        expect(result).toEqual([]);
    });

    test('Devuelve un array vacío si circularSeleccionada está vacía', () => {
        const result = filtroTrenes('A', listaTurnosMock, [], 'Tren1');
        expect(result).toEqual([]);
    });

    test('Devuelve un array vacío si no hay turnos con el itinerario especificado', () => {
        const result = filtroTrenes('C', listaTurnosMock, ['C1'], 'Tren1');
        expect(result).toEqual([]);
    });
});


describe('filtroItinerario', () => {
    const listaItinerarioMock: Itinerario[] = [
        { id: 1, tren: 1, itinerario: 'A', estaciones: ['Est1', 'Est2'], horarios: ['10:00', '10:30'] },
        { id: 2, tren: 2, itinerario: 'A', estaciones: ['Est1', 'Est2'], horarios: ['11:00', '11:30'] },
        { id: 3, tren: 1, itinerario: 'B', estaciones: ['Est3', 'Est4'], horarios: ['12:00', '12:30'] },
        { id: 4, tren: 2, itinerario: 'B', estaciones: ['Est3', 'Est4'], horarios: ['13:00', '13:30'] },
    ];

    test('Filtra correctamente el itinerario del tren especificado', () => {
        const result = filtroItinerario('A', listaItinerarioMock, 1);
        expect(result).toEqual({ 
            id: 1, 
            tren: 1, 
            itinerario: 'A', 
            estaciones: ['Est1', 'Est2'], 
            horarios: ['10:00', '10:30'] 
        });
    });

    test('Devuelve un objeto vacío si no se encuentra coincidencias', () => {
        const result = filtroItinerario('C', listaItinerarioMock, 1);
        expect(result).toEqual({
            id: null,
            tren: 0,
            itinerario: "",
            estaciones: [],
            horarios: [],
        });
    });

    test('Devuelve un objeto vacío si el tren no coincide', () => {
        const result = filtroItinerario('A', listaItinerarioMock, 3);
        expect(result).toEqual({
            id: null,
            tren: 0,
            itinerario: "",
            estaciones: [],
            horarios: [],
        });
    });

    test('Invierte estaciones y horarios si el tren es par', () => {
        const result = filtroItinerario('A', listaItinerarioMock, 2);
        expect(result).toEqual({ 
            id: 2, 
            tren: 2, 
            itinerario: 'A', 
            estaciones: ['Est2', 'Est1'], 
            horarios: ['11:30', '11:00'] 
        });
    });
});


describe('buscarCambioTurno', () => {
    const cambiosTurnosMock: CambioTurno[] = [
        {
            fechaCambio: '2024-10-01',
            personal: [
                { legajo: 1, apellido: 'Gonzalez', nombres: 'Juan' },
                { legajo: 2, apellido: 'Lopez', nombres: 'Ana' },
            ],
        },
        {
            fechaCambio: '2024-10-02',
            personal: [
                { legajo: 3, apellido: 'Martinez', nombres: 'Luis' },
                { legajo: 4, apellido: 'Perez', nombres: 'Maria' },
            ],
        },
    ];

    test('Devuelve el reemplazo correcto para el legajo dado', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-10-01', 1);
        expect(result).toEqual({ legajo: 2, apellido: 'Lopez', nombres: 'Ana' });
    });

    test('Devuelve el reemplazo correcto para el legajo dado (caso inverso)', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-10-01', 2);
        expect(result).toEqual({ legajo: 1, apellido: 'Gonzalez', nombres: 'Juan' });
    });

    test('Devuelve undefined si no se encuentra el legajo', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-10-01', 99);
        expect(result).toBeUndefined();
    });

    test('Devuelve undefined si no se encuentra la fecha', () => {
        const result = buscarCambioTurno(cambiosTurnosMock, '2024-10-03', 1);
        expect(result).toBeUndefined();
    });
});
