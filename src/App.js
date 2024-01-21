import { useState } from "react";
import "./App.css";
import { cards } from "@flesh-and-blood/cards";
import ExpansionSlotMap from "./ExpansionSlotMap";
import { Rarity, Release, Type } from "@flesh-and-blood/types";

function App() {
    const heavyHitters = cards.filter(card => card.sets.includes(Release.HeavyHitters) && !ExpansionSlotMap[Release.HeavyHitters].includes(card.setIdentifiers[0]));
    const heroes = heavyHitters.filter(card => card.hero && card.young);
    const tokenWeapons = heavyHitters.filter(card => card.types.includes(Type.Weapon) && card.rarities.includes(Rarity.Token));

    const mainPool = heavyHitters.filter(card => !card.hero && !card.rarities.includes(Rarity.Token));
    const majestics = mainPool.filter(card => card.rarity === Rarity.Majestic);
    const rares = mainPool.filter(card => card.rarity === Rarity.Rare);
    const commons = mainPool.filter(card => card.rarity === Rarity.Common);

    const numRares = 11; // 12 rare/majestic slots, minus the 1 majestic assumption
    const numMajestics = 1; // 1 every 4 packs, so assume 1
    const numCommons = 72; // 11 commons + 1 common rainbow = 12 * 6 packs = 72

    const [deckString, setDeckString] = useState(null);

    const getRandomCard = (cards) => {
        return cards[Math.floor(Math.random() * cards.length)];
    };

    const pitchStrings = [null, "Red", "Yellow", "Blue"];

    // https://stackoverflow.com/a/34890276/1747491
    const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const generateDeckString = () => {
        const deck = [];
        for (let i = 0; i < numRares; i++) deck.push(getRandomCard(rares));
        for (let i = 0; i < numMajestics; i++)
            deck.push(getRandomCard(majestics));
        for (let i = 0; i < numCommons; i++) deck.push(getRandomCard(commons));

        const string = compileDeckString(deck);
        setDeckString(string);
    };

    const compileDeckString = (deck) => {
        let string = "Deck build - via https://fabdb.net :\n\n";
        string += `New deck (${heroes[0].name})\n\n`;
        string += `Weapons: ${tokenWeapons.map((weapon) => weapon.name).join(", ")}\n\n`;

        const groupedDeck = groupBy(deck, "cardIdentifier");

        for (const [_cardIdentifier, cards] of Object.entries(groupedDeck)) {
            const card = cards[0];
            string += `[${cards.length}] ${card.name}`;

            if (card.pitch != null) {
                string += ` (${pitchStrings[card.pitch]})`;
            }

            string += "\n";
        }

        return string;
    };

    const exportDeckString = () => {
        const deck = document.getElementById("deck");
        deck.select();
        deck.setSelectionRange(0, 99999);
        document.execCommand("copy");
        window.location.href = "https://fabrary.net/decks?tab=import";
    };

    return (
        <div className="App">
            <div id="version">v1.0.1</div>
            <div id="assumptions">
                <span>
                    <b>Assumptions</b>
                </span>
                <ul>
                    <li>6 packs of 16</li>
                    <li>Minus the two token/expansion slots</li>
                    <li>1 majestic</li>
                    <li>Only commons in rainbow slot</li>
                    <li>All token weapons included</li>
                </ul>
            </div>
            <button onClick={generateDeckString}>Generate</button>
            <button onClick={exportDeckString}>Export</button>
            <div><b>Note:</b> Kayo is selected by default to let FaBrary know the format, you can easily change your hero later</div>
            <textarea id="deck" value={deckString} readOnly />
        </div>
    );
}

export default App;
