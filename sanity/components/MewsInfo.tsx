/** Pantalla informativa del panel: calendario, precios y reservas viven en Mews (los datos de huéspedes no pasan por la web). */
export function MewsInfo() {
  return (
    <div style={{ padding: "2rem", maxWidth: "36rem", lineHeight: 1.6 }}>
      <h2 style={{ marginTop: 0 }}>Calendario, precios y reservas</h2>
      <p>
        La disponibilidad, las tarifas, los cierres, las reservas, los cobros y los correos a los
        huéspedes se gestionan en Mews. Así los datos de los huéspedes y sus tarjetas nunca pasan
        por la web.
      </p>
      <p>
        <a href="https://app.mews.com" target="_blank" rel="noopener noreferrer">
          Abrir Mews
        </a>
      </p>
      <p style={{ opacity: 0.75 }}>
        Para conectar una habitación con su tipo en Mews, copia su identificador en la ficha de la
        habitación (pestaña «Reserva»).
      </p>
    </div>
  );
}
