# Configuratore preventivi serramenti – TEST

Prototipo di configuratore per preparare preventivi di serramenti:
si sceglie fornitore e prodotto, si inseriscono misure e opzioni,
e il programma calcola il prezzo e compone il preventivo (stampabile in PDF).

> ⚠️ Tutti i fornitori, i prodotti e i prezzi sono **inventati**: è una versione di prova.

## File del progetto

| File | A cosa serve |
|---|---|
| `index.html` | La pagina: i campi del form e la tabella del preventivo |
| `style.css` | L'aspetto grafico |
| `script.js` | I calcoli (superficie, minimo fatturato, opzioni, sconto, IVA) |
| `data/prodotti.js` | Il listino: fornitori, prodotti, limiti di misura, opzioni e prezzi |

## Come si calcola il prezzo

1. Superficie = larghezza × altezza (in m²), con un minimo fatturato per prodotto
2. Prezzo base = superficie × prezzo al m²
3. Opzioni: al m², a pezzo, oppure in % sul prezzo base
4. Riga = prezzo unitario × quantità
5. Totale = somma righe − sconto + IVA

## Come modificare i prezzi

Si modifica solo `data/prodotti.js`, seguendo le istruzioni scritte in cima al file.


