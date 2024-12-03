export interface ITarjetaPersonalSinDiagrama {
  _id: string;
  mes: string;
  legajo: number;
  Ciclo: number;
  francoInicio: number;
  HoraInicio: string;
  francoHasta: number;
  HoraHasta: string;
  // mes: Mes; // Un solo mes por documento
  days: { [key: string]: Jornada; }
}

export interface Jornada {
  tren: string;
  franco: string;
  desde: string;
  hasta: string;
  disponibleHora: string;
  tomo: string;
  dejo: string;
  totalHoras: string;
  dia_laboral: number | null;
  observaciones: string;
  relevando: boolean;
  deBaja: boolean;
  editable: boolean;
  [key: string]: any;
  nroNovedad: number | null;
}