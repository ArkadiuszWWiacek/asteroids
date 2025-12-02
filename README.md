# Asteroids

Klasyczna gra Asteroids zaimplementowana w czystym JavaScript z użyciem HTML5 Canvas.[file:44]

## 🎮 Funkcje gry

- Statek kosmiczny z obrotem w kierunku kursora myszy
- Sterowanie klawiaturą: WASD/Strzałki (ruch), klik myszy (strzelanie)
- Parallax scrolling z 3 warstwami gwiazd w tle
- System kolizji okręgowych z asteroidami
- Dynamiczne asteroidy (4-8 wierzchołków, losowy kształt/kolor/rozmiar)
- Progresywna trudność: więcej asteroid co 100 pkt
- Paski HUD: zdrowie (czerwony), bonus strzału (zielony)
- Power-upy: apteczki (+50 HP), triple-shot (3→5 strzałów na 25s)

## 📋 Sterowanie

| Klawisz | Działanie |
|---------|-----------|
| A/←     | Ruch w lewo [file:44] |
| D/→     | Ruch w prawo [file:44] |
| W/↑     | Ruch w górę [file:44] |
| S/↓     | Ruch w dół [file:44] |
| Klik myszy | Strzelanie [file:44] |

## 🛸 Mechanika gry

- **Statek**: 300 HP, wrap-around ekranu, obrót do kursora
- **Asteroidy**: Spawn z krawędzi, rotacja, dzielą się po trafieniu
- **Strzały**: 1-5 pocisków (bonus), zasięg 20px, usuwanie poza ekranem
- **Game Over**: gdy HP ≤ 0, przycisk restartu[file:44]

## 📁 Struktura projektu

── index.html (canvas + UI)
── script.js (cała logika gry)
── style.scss (stylizacja)
── img/
 ├── first-aid-kit.png
 └── triple-fire.png


## 🚀 Rozpoczęcie

1. Sklonuj repozytorium
2. Otwórz `index.html` w przeglądarce
3. Kliknij "Start New Game"
4. Graj!

## 🎯 Technologie

- **Canvas 2D API** – renderowanie grafiki [file:44]
- **Vanilla JavaScript** – brak frameworków
- **SCSS** – style responsywne
- **Event Listeners** – obsługa inputu

## 📈 Wynik

Punkty za trafienia, bonusy za zniszczenie małych asteroid. Poziom trudności rośnie automatycznie.[file:44]
