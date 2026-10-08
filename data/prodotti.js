/*
  LISTINO PRODOTTI — DATI DI PROVA (inventati)
  ------------------------------------------------
  Questo è l'unico file da modificare quando cambiano prodotti o prezzi.
  Non mettere qui i prezzi veri finché il sito è pubblico su GitHub Pages.

  Come funziona il prezzo:
  - prezzoMq  = prezzo al metro quadro del serramento
  - mqMinimo  = superficie minima fatturata (i pezzi piccoli si pagano come se fossero di mqMinimo)
  - limiti    = misure minime e massime realizzabili, in millimetri
  - opzioni   = extra selezionabili. "tipo" può essere:
                  "mq"          -> prezzo al m² (moltiplicato per la superficie)
                  "pezzo"       -> prezzo fisso per ogni pezzo
                  "percentuale" -> % in più sul prezzo base del pezzo
*/

window.LISTINO = {
  iva: 22,
  fornitori: [
    {
      id: "alfa",
      nome: "Alfa Infissi (TEST)",
      prodotti: [
        {
          id: "alfa-pvc70",
          nome: "Finestra PVC 70 mm – 1 anta",
          prezzoMq: 280,
          mqMinimo: 1.2,
          limiti: { larghezza: [400, 1200], altezza: [400, 2400] },
          opzioni: [
            { id: "triplo", nome: "Vetro triplo", tipo: "mq", valore: 45 },
            { id: "colore", nome: "Colore effetto legno", tipo: "percentuale", valore: 15 },
            { id: "anta-ribalta", nome: "Apertura anta-ribalta", tipo: "pezzo", valore: 60 },
            { id: "posa", nome: "Posa in opera", tipo: "pezzo", valore: 120 }
          ]
        },
        {
          id: "alfa-pvc70-2a",
          nome: "Finestra PVC 70 mm – 2 ante",
          prezzoMq: 260,
          mqMinimo: 1.5,
          limiti: { larghezza: [800, 2000], altezza: [400, 2400] },
          opzioni: [
            { id: "triplo", nome: "Vetro triplo", tipo: "mq", valore: 45 },
            { id: "colore", nome: "Colore effetto legno", tipo: "percentuale", valore: 15 },
            { id: "posa", nome: "Posa in opera", tipo: "pezzo", valore: 150 }
          ]
        }
      ]
    },
    {
      id: "beta",
      nome: "Beta Alluminio (TEST)",
      prodotti: [
        {
          id: "beta-taglio-termico",
          nome: "Finestra alluminio taglio termico",
          prezzoMq: 390,
          mqMinimo: 1.5,
          limiti: { larghezza: [500, 1800], altezza: [500, 2600] },
          opzioni: [
            { id: "ral", nome: "Colore RAL a scelta", tipo: "percentuale", valore: 10 },
            { id: "basso-emissivo", nome: "Vetro basso emissivo", tipo: "mq", valore: 30 },
            { id: "posa", nome: "Posa in opera", tipo: "pezzo", valore: 140 }
          ]
        },
        {
          id: "beta-scorrevole",
          nome: "Alzante scorrevole alluminio",
          prezzoMq: 520,
          mqMinimo: 3,
          limiti: { larghezza: [1500, 4000], altezza: [1800, 2800] },
          opzioni: [
            { id: "ral", nome: "Colore RAL a scelta", tipo: "percentuale", valore: 10 },
            { id: "soglia", nome: "Soglia ribassata", tipo: "pezzo", valore: 180 },
            { id: "posa", nome: "Posa in opera", tipo: "pezzo", valore: 300 }
          ]
        }
      ]
    },
    {
      id: "gamma",
      nome: "Gamma Persiane (TEST)",
      prodotti: [
        {
          id: "gamma-persiana",
          nome: "Persiana alluminio 2 ante",
          prezzoMq: 210,
          mqMinimo: 1.2,
          limiti: { larghezza: [600, 1800], altezza: [600, 2600] },
          opzioni: [
            { id: "lamelle", nome: "Lamelle orientabili", tipo: "mq", valore: 40 },
            { id: "colore", nome: "Colore effetto legno", tipo: "percentuale", valore: 12 },
            { id: "posa", nome: "Posa in opera", tipo: "pezzo", valore: 90 }
          ]
        }
      ]
    }
  ]
};
