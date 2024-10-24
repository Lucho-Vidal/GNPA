import {
    esFechaMayor,
    esFechaMayorIgual,
    esFechaIgual,
    compararHoras,
    newDate,
    diferenciaHoras,
    calcularTotalHoras,
    sumarHoras,
    diaAnterior,
    dosDiasAnterior,
    diaPosterior,
    obtenerNumeroDia,
    obtenerDiaSemana,
    itinerarioType,
    formatearFecha,
} from "../utils/fechas";

describe("esFechaMayor", () => {
    test("debe retornar true cuando la primera fecha es mayor", () => {
        expect(esFechaMayor("2023-10-16", "2023-09-10")).toBe(true);
    });

    test("debe retornar false cuando la primera fecha es menor", () => {
        expect(esFechaMayor("2023-09-10", "2023-10-16")).toBe(false);
    });

    test("debe retornar false si alguna de las fechas es inválida", () => {
        expect(esFechaMayor("", "2023-10-16")).toBe(false);
        expect(esFechaMayor("2023-10-16", "")).toBe(false);
    });

    test("debe retornar false si las dos fechas son iguales", () => {
        expect(esFechaMayor("2023-10-16", "2023-10-16")).toBe(false);
    });
});

describe("esFechaMayorIgual", () => {
    test("debe retornar true cuando la primera fecha es mayor", () => {
        expect(esFechaMayorIgual("2023-10-16", "2023-09-10")).toBe(true);
    });

    test("debe retornar false cuando la primera fecha es menor", () => {
        expect(esFechaMayorIgual("2023-09-10", "2023-10-16")).toBe(false);
    });

    test("debe retornar false si alguna de las fechas es inválida", () => {
        expect(esFechaMayorIgual("", "2023-10-16")).toBe(false);
        expect(esFechaMayorIgual("2023-10-16", "")).toBe(false);
    });

    test("debe retornar true si las dos fechas son iguales", () => {
        expect(esFechaMayorIgual("2023-10-16", "2023-10-16")).toBe(true);
    });
});

describe("esFechaIgual", () => {
    test("debe retornar true si las fechas son iguales", () => {
        expect(esFechaIgual("2023-10-16", "2023-10-16")).toBe(true);
    });

    test("debe retornar false si las fechas son diferentes", () => {
        expect(esFechaIgual("2023-10-16", "2023-09-10")).toBe(false);
    });

    test("debe retornar false si alguna de las fechas es inválida", () => {
        expect(esFechaIgual("fecha-invalida", "2023-10-16")).toBe(false);
        expect(esFechaIgual("2023-10-16", "fecha-invalida")).toBe(false);
    });

    test("debe retornar false si falta alguna fecha", () => {
        expect(esFechaIgual("", "2023-10-16")).toBe(false);
        expect(esFechaIgual("2023-10-16", "")).toBe(false);
    });
});

describe("compararHoras", () => {
    test("debe retornar un número positivo si hora1 es mayor que hora2", () => {
        expect(compararHoras("14:30", "13:15")).toBeGreaterThan(0);
    });

    test("debe retornar cero si ambas horas son iguales", () => {
        expect(compararHoras("09:00", "09:00")).toBe(0);
    });

    test("debe retornar un número negativo si hora1 es menor que hora2", () => {
        expect(compararHoras("08:15", "09:45")).toBeLessThan(0);
    });

    test("debe retornar null si el formato de hora es inválido", () => {
        expect(compararHoras("14:60", "13:15")).toBeNull(); // minutos inválidos
        expect(compararHoras("25:00", "14:00")).toBeNull(); // hora inválida
        expect(compararHoras("14:30", "13:xx")).toBeNull(); // formato incorrecto
    });
});

describe("newDate", () => {
    test("debe retornar un objeto Date con la hora establecida", () => {
        const fecha = newDate("14:30");
        expect(fecha).toBeInstanceOf(Date);
        if (fecha) {
            expect(fecha.getHours()).toBe(14);
            expect(fecha.getMinutes()).toBe(30);
        }
    });

    test("debe retornar un objeto Date del día siguiente si se incrementa", () => {
        const fecha = newDate("14:30", true);
        expect(fecha).toBeInstanceOf(Date);
        if (fecha) {
            expect(fecha.getHours()).toBe(14);
            expect(fecha.getMinutes()).toBe(30);
            expect(fecha.getDate()).toBe(new Date().getDate() + 1);
        }
    });

    test("debe retornar null si el formato de la hora es inválido", () => {
        expect(newDate("invalid-hour")).toBeNull(); // Formato incorrecto
        expect(newDate("25:00")).toBeNull(); // Hora inválida
        expect(newDate("14:60")).toBeNull(); // Minutos inválidos
    });
});

describe("diferenciaHoras", () => {
    test("debe retornar la diferencia entre dos horas en el mismo día", () => {
        expect(diferenciaHoras("12:00", "14:30")).toBe("02:30");
    });

    test("debe asumir que la segunda hora es del día siguiente si es menor que la primera", () => {
        expect(diferenciaHoras("23:00", "00:30")).toBe("01:30");
    });

    test("debe retornar una cadena vacía si alguna hora es inválida", () => {
        expect(diferenciaHoras("invalid", "14:30")).toBe("");
        expect(diferenciaHoras("12:00", "invalid")).toBe("");
    });

    test('debe retornar "00:00" si las horas son iguales', () => {
        expect(diferenciaHoras("14:30", "14:30")).toBe("00:00");
    });
});

describe("calcularTotalHoras", () => {
    test('debe acumular horas correctamente cuando no hay "DH"', () => {
        const dias = {
            "2024-10-10": { tomo: "08:00", dejo: "12:00" },
            "2024-10-11": { tomo: "09:00", dejo: "17:00" },
        };

        const resultado = calcularTotalHoras(dias);

        expect(resultado["2024-10-10"].totalHoras).toBe("04:00"); // 4 horas de diferencia
        expect(resultado["2024-10-11"].totalHoras).toBe("12:00"); // 4 + 8 horas
    });

    test('debe reiniciar horas acumuladas cuando tomo es "DH"', () => {
        const dias = {
            "2024-10-10": { tomo: "08:00", dejo: "12:00" },
            "2024-10-11": { tomo: "DH", dejo: "" },
            "2024-10-12": { tomo: "09:00", dejo: "17:00" },
        };

        const resultado = calcularTotalHoras(dias);

        expect(resultado["2024-10-10"].totalHoras).toBe("04:00"); // 4 horas de diferencia
        expect(resultado["2024-10-11"].totalHoras).toBe(""); // Reinicio en "DH"
        expect(resultado["2024-10-12"].totalHoras).toBe("08:00"); // 8 horas acumuladas desde "DH"
    });

    test('debe acumular horas correctamente después de un "DH"', () => {
        const dias = {
            "2024-10-10": { tomo: "08:00", dejo: "12:00" },
            "2024-10-11": { tomo: "DH", dejo: "" },
            "2024-10-12": { tomo: "09:00", dejo: "12:00" },
            "2024-10-13": { tomo: "13:00", dejo: "15:00" },
        };

        const resultado = calcularTotalHoras(dias);

        expect(resultado["2024-10-10"].totalHoras).toBe("04:00");
        expect(resultado["2024-10-11"].totalHoras).toBe("");
        expect(resultado["2024-10-12"].totalHoras).toBe("03:00"); // Acumulación reseteada tras "DH"
        expect(resultado["2024-10-13"].totalHoras).toBe("05:00"); // 3 + 2 horas
    });

    test("debe retornar horas vacías cuando las horas son inválidas", () => {
        const dias = {
            "2024-10-10": { tomo: "invalid", dejo: "12:00" },
            "2024-10-11": { tomo: "09:00", dejo: "invalid" },
        };

        const resultado = calcularTotalHoras(dias);

        expect(resultado["2024-10-10"].totalHoras).toBe(""); // Hora inválida
        expect(resultado["2024-10-11"].totalHoras).toBe(""); // Hora inválida
    });

    test('debe retornar "00:00" cuando no hay diferencia de horas', () => {
        const dias = {
            "2024-10-10": { tomo: "08:00", dejo: "08:00" },
        };

        const resultado = calcularTotalHoras(dias);

        expect(resultado["2024-10-10"].totalHoras).toBe("00:00"); // No hay diferencia
    });
});

describe("sumarHoras", () => {
    test("debe sumar correctamente las horas sin sobrepasar 24 horas", () => {
        expect(sumarHoras("23:00", 5)).toBe("04:00"); // 23:00 + 5 horas = 04:00 del día siguiente
    });

    test("debe retornar la misma hora cuando se suma 0 horas", () => {
        expect(sumarHoras("23:00", 0)).toBe("23:00");
    });

    test("debe retornar una cadena vacía si la hora es inválida", () => {
        expect(sumarHoras("invalid", 5)).toBe("");
    });

    test("debe ajustar correctamente al sumar minutos después de las 24 horas", () => {
        expect(sumarHoras("23:30", 1)).toBe("00:30"); // 23:30 + 1 hora = 00:30 del día siguiente
    });

    test("debe manejar correctamente cuando las horas acumuladas exceden las 24 horas", () => {
        expect(sumarHoras("10:00", 24)).toBe("10:00"); // 10:00 + 24 horas = 10:00 del día siguiente
    });

    test('debe retornar "00:00" si la hora es "00:00" y se suman 0 horas', () => {
        expect(sumarHoras("00:00", 0)).toBe("00:00");
    });

    test("debe manejar correctamente la suma de horas negativas", () => {
        expect(sumarHoras("05:00", -2)).toBe("03:00"); // 05:00 - 2 horas = 03:00
    });
});

describe("diaAnterior", () => {
    test("debe devolver el día anterior correctamente", () => {
        expect(diaAnterior("2024-10-16")).toBe("2024-10-15"); // El día anterior a 2024-10-16 es 2024-10-15
    });

    test("debe manejar correctamente los cambios de mes", () => {
        expect(diaAnterior("2024-11-01")).toBe("2024-10-31"); // El día anterior al 1 de noviembre es 31 de octubre
    });

    test("debe manejar correctamente los cambios de año", () => {
        expect(diaAnterior("2024-01-01")).toBe("2023-12-31"); // El día anterior al 1 de enero es 31 de diciembre del año anterior
    });

    test("debe devolver una cadena vacía si la fecha es inválida", () => {
        expect(diaAnterior("invalid")).toBe(""); // Fecha inválida
    });

    test("debe manejar correctamente los años bisiestos", () => {
        expect(diaAnterior("2024-03-01")).toBe("2024-02-29"); // 2024 es bisiesto, el día anterior a 1 de marzo es 29 de febrero
    });

    test("debe manejar correctamente el último día del mes", () => {
        expect(diaAnterior("2024-02-01")).toBe("2024-01-31"); // El día anterior a 1 de febrero es 31 de enero
    });
});

describe("dosDiasAnterior", () => {
    test("debe devolver la fecha de dos días anteriores correctamente", () => {
        expect(dosDiasAnterior("2024-10-17")).toBe("2024-10-15");
        expect(dosDiasAnterior("2024-01-03")).toBe("2024-01-01");
    });
    test("debe devolver una cadena vacía si la fecha es inválida", () => {
        expect(diaAnterior("invalid")).toBe(""); // Fecha inválida
    });
    // test('debe lanzar un error con fecha inválida', () => {
    //     expect(() => dosDiasAnterior('invalid-date')).toThrow('Fecha inválida');
    // });
});

describe("diaPosterior", () => {
    test("debe devolver la fecha del día siguiente correctamente", () => {
        expect(diaPosterior("2024-10-17")).toBe("2024-10-18");
        expect(diaPosterior("2023-12-31")).toBe("2024-01-01");
        expect(diaPosterior("2024-02-28")).toBe("2024-02-29"); // Años bisiestos
        expect(diaPosterior("2024-02-29")).toBe("2024-03-01"); // Desde un año bisiesto
    });
    test("debe devolver una cadena vacía si la fecha es inválida", () => {
        expect(diaAnterior("invalid")).toBe(""); // Fecha inválida
        // expect(() => diaPosterior('2024-02-30')).toThrow('Fecha inválida'); // Fecha no válida
        // expect(diaPosterior('2024-02-30')).toBe(''); // Fecha no válida
    });
});

describe("Funciones de días de la semana", () => {
    describe("obtenerNumeroDia", () => {
        test("Devuelve el índice correcto para un día válido", () => {
            expect(obtenerNumeroDia("Lunes")).toBe(1);
            expect(obtenerNumeroDia("Sábado")).toBe(6);
        });

        test("Devuelve -1 para un día no válido", () => {
            expect(obtenerNumeroDia("Funday")).toBe(-1);
        });

        test("Devuelve -1 para un día en diferente capitalización", () => {
            expect(obtenerNumeroDia("domingo")).toBe(-1); // Sin .toLowerCase()
        });
    });

    describe("obtenerDiaSemana", () => {
        test("Devuelve el nombre correcto para un índice válido", () => {
            expect(obtenerDiaSemana(0)).toBe("Domingo");
            expect(obtenerDiaSemana(6)).toBe("Sábado");
        });

        test("Devuelve undefined para un índice fuera de rango", () => {
            expect(obtenerDiaSemana(-1)).toBeUndefined();
            expect(obtenerDiaSemana(7)).toBeUndefined();
        });
    });
});

describe("itinerarioType", () => {
    test('Devuelve "D" para domingo', () => {
        const domingo = new Date("2024-10-20"); // Domingo
        expect(itinerarioType(domingo)).toBe("D");
    });

    test('Devuelve "S" para sábado', () => {
        const sabado = new Date("2024-10-26"); // Sábado
        expect(itinerarioType(sabado)).toBe("S");
    });

    test('Devuelve "H" para días hábiles (lunes a viernes)', () => {
        const lunes = new Date("2024-10-21"); // Lunes
        const miercoles = new Date("2024-10-23"); // Miércoles
        expect(itinerarioType(lunes)).toBe("H");
        expect(itinerarioType(miercoles)).toBe("H");
    });
});

describe("formatearFecha", () => {
    // Casos válidos
    test("debería formatear correctamente una fecha válida con formato ISO", () => {
        const fecha = "2024-10-23T14:00:00";
        const resultado = formatearFecha(fecha);
        expect(resultado).toBe("23/10/2024 14:00");
    });

    test("debería formatear correctamente una fecha con espacios", () => {
        const fecha = "2023-01-01 12:30:00";
        const resultado = formatearFecha(fecha);
        expect(resultado).toBe("01/01/2023 12:30");
    });

    // Casos inválidos
    test("debería devolver 'Fecha inválida' si la fecha es inválida", () => {
        const fechaInvalida = "fecha no válida";
        const resultado = formatearFecha(fechaInvalida);
        expect(resultado).toBe("Fecha inválida");
    });

    test("debería devolver 'Fecha inválida' para una cadena vacía", () => {
        const fechaVacia = "";
        const resultado = formatearFecha(fechaVacia);
        expect(resultado).toBe("Fecha inválida");
    });

    // Casos extremos
    test("debería manejar fechas muy antiguas correctamente", () => {
        const fechaAntigua = "1900-01-01T00:00:00";
        const resultado = formatearFecha(fechaAntigua);
        expect(resultado).toBe("01/01/1900 00:00");
    });

    test("debería manejar fechas muy futuras correctamente", () => {
        const fechaFutura = "3000-12-31T23:59:00";
        const resultado = formatearFecha(fechaFutura);
        expect(resultado).toBe("31/12/3000 23:59");
    });
});
