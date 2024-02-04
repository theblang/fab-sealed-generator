import './App.css';
import githubMark from './github-mark.svg';
import { cards } from '@flesh-and-blood/cards';
import ExpansionSlotMap from './ExpansionSlotMap';
import { Class, Rarity, Release, Type } from '@flesh-and-blood/types';

function App() {
    const heavyHitters = cards.filter(
        card =>
            card.sets.includes(Release.HeavyHitters) &&
            !ExpansionSlotMap[Release.HeavyHitters].includes(card.setIdentifiers[0]),
    );
    const tokenWeapons = heavyHitters.filter(
        card => card.types.includes(Type.Weapon) && card.rarities.includes(Rarity.Token),
    );

    const mainPool = heavyHitters.filter(card => !card.hero && !card.rarities.includes(Rarity.Token));

    const rares = mainPool.filter(card => card.rarity === Rarity.Rare);
    const commons = mainPool.filter(card => card.rarity === Rarity.Common);

    const commonsClass = commons.filter(
        card => card.classes[0] !== Class.Generic && !card.types.includes(Type.Equipment),
    );
    const commonsGenericAndEquipment = commons.filter(
        card => card.classes[0] === Class.Generic || card.types.includes(Type.Equipment),
    );

    const commonsSingleClass = commonsClass.filter(card => card.classes.length === 1);
    const commonsWedge = commonsClass.filter(card => card.classes.length === 2);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
    const getRandomCard = cards => {
        const min = 0;
        const max = cards.length;
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        const randInt = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive

        return cards[randInt];
    };

    const generate = () => {
        const deck = [];
        const numPacks = 6;

        for (let i = 0; i < numPacks; i++) {
            for (let j = 0; j < 5; j++) deck.push(getRandomCard(commonsSingleClass));
            for (let j = 0; j < 3; j++) deck.push(getRandomCard(commonsWedge));
            for (let j = 0; j < 3; j++) deck.push(getRandomCard(commonsGenericAndEquipment));
            for (let j = 0; j < 2; j++) deck.push(getRandomCard(rares));
            deck.push(getRandomCard(commons));
        }

        const params = new URLSearchParams();
        params.append('tab', 'import');
        params.append('format', 'Sealed');
        params.append('cards', 'HVY002'); // Kayo
        deck.forEach(card => {
            params.append('cards', card.setIdentifiers[0]);
        });
        tokenWeapons.forEach(card => {
            params.append('cards', card.setIdentifiers[0]);
            params.append('cards', card.setIdentifiers[0]);
        });

        window.open(`https://fabrary.net/decks?${params.toString()}`, '_blank');
    };

    return (
        <div className="App">
            <div id="version">
                <span>v HVY.2</span>
                <a id="fork-me" href="https://github.com/theblang/fab-sealed-generator">
                    <img src={githubMark} />
                </a>
            </div>
            <div id="assumptions">
                <div>
                    <b>Assumptions</b>
                </div>
                <ul>
                    <li>5 single-class slots</li>
                    <li>3 wedge slots</li>
                    <li>3 generic/equipment slots</li>
                    <li>2 rare/majestic slots</li>
                    <ul>
                        <li>assume only rares</li>
                    </ul>
                    <li>1 rainbow slot</li>
                    <ul>
                        <li>assume only commons</li>
                    </ul>
                    <li>
                        <del>2 token/expansion slots</del>
                    </li>
                </ul>
            </div>
            <button onClick={generate}>Generate</button>
        </div>
    );
}

export default App;
