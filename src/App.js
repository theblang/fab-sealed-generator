import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { cards } from "@flesh-and-blood/cards";

function App() {
    const pitchStrings = ["Red", "Yellow", "Blue"];

    const heavyHitters = cards.filter((card) =>
        card.sets.includes("Heavy Hitters"),
    );
    const heroes = heavyHitters.filter((card) => card.hero && card.young);
    const weapons = heavyHitters.filter((card) =>
        card.types.includes("Weapon"),
    );

    const majestics = heavyHitters.filter((card) => card.rarity === "Majestic");
    const rares = heavyHitters.filter((card) => card.rarity === "Rare");
    const commons = heavyHitters.filter((card) => card.rarity === "Common");

    const numRares = 11; // 12 rare/majestic slots, minus the 1 majestic assumption
    const numMajestics = 1; // 1 every 4 packs, so assume 1
    const numCommons = 72; // 11 commons + 1 common rainbow = 12 * 6 packs = 72

    const [selectedHero, setSelectedHero] = useState(null);
    const [selectedWeapon, setSelectedWeapon] = useState(null);
    const [selectedSecondWeapon, setSelectedSecondWeapon] = useState(null);
    const [weaponIsValid, setWeaponIsValid] = useState(false);
    const [deckString, setDeckString] = useState(null);
    const [weaponOptions, setWeaponOptions] = useState([]);

    useEffect(() => {
        const options = weapons.filter((weapon) =>
            intersects(weapon.classes, selectedHero?.classes),
        );
        setWeaponOptions(options);
    }, [selectedHero]);

    useEffect(() => {
        if (
            selectedWeapon?.subtypes.includes("2H") ||
            (selectedWeapon && selectedSecondWeapon)
        ) {
            setWeaponIsValid(true);
            generate();
        }
    }, [selectedWeapon, selectedSecondWeapon]);

    const changeHero = (event) => {
        setSelectedHero(
            heroes.find((hero) => hero.name === event.target.value),
        );
        setSelectedWeapon(null);
        setSelectedSecondWeapon(null);
        setDeckString(null);
        setWeaponOptions([]);
    };

    // https://stackoverflow.com/a/34890276/1747491
    const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const getRandomCard = (cards) => {
        return cards[Math.floor(Math.random() * cards.length)];
    };

    const generate = () => {
        const deck = [];
        for (let i = 0; i < numRares; i++) deck.push(getRandomCard(rares));
        for (let i = 0; i < numMajestics; i++)
            deck.push(getRandomCard(majestics));
        for (let i = 0; i < numCommons; i++) deck.push(getRandomCard(commons));

        const string = compileDeckString(deck);
        setDeckString(string);
    };

    const compileDeckString = (deck) => {
        if (!selectedHero || !selectedWeapon) return "";

        let selectedWeapons = [selectedWeapon, selectedSecondWeapon].filter(
            Boolean,
        );

        let string = "Deck build - via https://fabdb.net :\n\n";
        string += `New deck (${selectedHero.name})\n\n`;
        string += `Weapons: ${selectedWeapons.map((weapon) => weapon.name).join(", ")}\n\n`;

        const groupedDeck = groupBy(deck, "cardIdentifier");

        for (const [cardIdentifier, cards] of Object.entries(groupedDeck)) {
            const card = cards[0];
            string += `[${cards.length}] ${card.name}`;

            if (card.pitch != null) {
                string += ` (${pitchStrings[card.pitch - 1]})`;
            }

            string += "\n";
        }

        return string;
    };

    const copyDeck = () => {
        const deck = document.getElementById("deck");
        deck.select();
        deck.setSelectionRange(0, 99999);
        document.execCommand("copy");
        window.location.href = "https://fabrary.net/decks?tab=import";
    };

    const intersects = (array1, array2) => {
        return array1.some((item) => array2?.includes(item));
    };

    return (
        <div className="App">
            <div id="assumptions">
                <span>
                    <b>Assumptions</b>
                </span>
                <ul>
                    <li>6 packs of 16</li>
                    <li>Minus the two token/expansion slots</li>
                    <li>1 majestic</li>
                    <li>All commons in rainbow slot</li>
                </ul>
            </div>
            <select onChange={(event) => changeHero(event)}>
                <option disabled selected value>
                    Select hero
                </option>
                {heroes.map((hero) => (
                    <option key={hero.name}>{hero.name}</option>
                ))}
            </select>
            <select
                onChange={(event) =>
                    setSelectedWeapon(
                        weapons.find(
                            (weapon) => weapon.name === event.target.value,
                        ),
                    )
                }
            >
                <option disabled selected value>
                    Select weapon
                </option>
                {weaponOptions.map((weapon) => (
                    <option key={weapon.name}>{weapon.name}</option>
                ))}
            </select>
            {selectedWeapon?.subtypes.includes("1H") && (
                <select
                    onChange={(event) =>
                        setSelectedSecondWeapon(
                            weapons.find(
                                (weapon) => weapon.name === event.target.value,
                            ),
                        )
                    }
                >
                    <option disabled selected value>
                        Select second weapon
                    </option>
                    {weaponOptions
                        .filter((weapon) => weapon.subtypes.includes("1H"))
                        .map((weapon) => (
                            <option key={weapon.name}>{weapon.name}</option>
                        ))}
                </select>
            )}
            <button onClick={copyDeck}>Export</button>
            <br />
            <textarea id="deck" value={deckString} readOnly />
            <br />
            <button onClick={generate} disabled={!weaponIsValid}>Regenerate</button>
        </div>
    );
}

export default App;
