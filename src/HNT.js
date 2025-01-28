import githubMark from './github-mark.svg';
import { cards } from '@flesh-and-blood/cards';
import { Class, Rarity, Release, Talent, Type } from '@flesh-and-blood/types';
import getRandomCard from './getRandomCard';
import { useState } from 'react';
import './HNT.css';

const sealedLegal = cards.filter(
    c =>
        c.sets.includes(Release.TheHunted) &&
        !c.meta?.includes('Expansion slot') &&
        !c.rarities.includes(Rarity.Token) &&
        !c.types.includes(Type.Hero),
);

const common = sealedLegal.filter(c => c.rarity === Rarity.Common);
const rare = sealedLegal.filter(c => c.rarity === Rarity.Rare);
const majestic = sealedLegal.filter(c => c.rarity === Rarity.Majestic);
const commonRare = common.concat(rare);

const commonNoEquipment = common.filter(c => !c.types.includes(Type.Equipment));
const commonEquipment = common.filter(c => c.types.includes(Type.Equipment));

const assassin = commonNoEquipment.filter(c => c.classes.length === 1 && c.classes.includes(Class.Assassin));
const ninja = commonNoEquipment.filter(c => c.classes.length === 1 && c.classes.includes(Class.Ninja));
const warrior = commonNoEquipment.filter(c => c.classes.length === 1 && c.classes.includes(Class.Warrior));

const assassinNinja = commonNoEquipment.filter(
    c => c.classes.includes(Class.Assassin) && c.classes.includes(Class.Ninja),
);
const assassinWarrior = commonNoEquipment.filter(
    c => c.classes.includes(Class.Assassin) && c.classes.includes(Class.Warrior),
);
const draconicOnly = commonNoEquipment.filter(
    c => c.classes.includes(Class.NotClassed) && c.talents.includes(Talent.Draconic),
);
const generic = commonNoEquipment.filter(c => c.classes.includes(Class.Generic));
const hybridDraconicGeneric = assassinNinja.concat(assassinWarrior).concat(draconicOnly).concat(generic);

[
    sealedLegal,
    common,
    rare,
    commonRare,
    commonNoEquipment,
    commonEquipment,
    assassin,
    ninja,
    warrior,
    assassinNinja,
    assassinWarrior,
    draconicOnly,
    generic,
    hybridDraconicGeneric,
].forEach(b => {
    if (b.length === 0) window.alert('Error: bucket missing cards');
});

// See https://www.youtube.com/watch?v=HCKLBXimmfY&t=28s
const generate = majesticCount => {
    let deck = [];
    const numPacks = 8;

    for (let i = 0; i < numPacks; i++) {
        deck.push(getRandomCard(assassin));
        deck.push(getRandomCard(assassin));
        deck.push(getRandomCard(ninja));
        deck.push(getRandomCard(ninja));
        deck.push(getRandomCard(warrior));
        deck.push(getRandomCard(warrior));

        deck.push(getRandomCard(hybridDraconicGeneric));
        deck.push(getRandomCard(hybridDraconicGeneric));
        deck.push(getRandomCard(hybridDraconicGeneric));

        deck.push(getRandomCard(common));
        deck.push(getRandomCard(commonEquipment));

        deck.push(getRandomCard(rare));

        if (i < majesticCount) {
            deck.push(getRandomCard(majestic));
        } else {
            deck.push(getRandomCard(rare));
        }

        deck.push(getRandomCard(commonRare));
    }

    // Prerelease pack
    const prereleaseWeapons = cards.filter(
        c =>
            c.setIdentifiers.includes('HNT010') ||
            c.setIdentifiers.includes('HNT056') ||
            c.setIdentifiers.includes('HNT100'),
    );
    deck = deck.concat(prereleaseWeapons);
    deck.push(getRandomCard(prereleaseWeapons));

    const params = new URLSearchParams();
    params.append('tab', 'import');
    params.append('format', 'Sealed');
    params.append('cards', 'HNT002'); // Arakni default
    deck.forEach((c, i) => {
        params.append('cards', c.setIdentifiers[0]);
    });

    // debugging
    // console.log(deck.filter(c => c.types.includes(Type.Equipment)));
    // console.log(deck.filter(c => c.classes.includes(Class.Generic) && !c.types.includes(Type.Equipment)));
    // console.log(deck.filter(c => c.classes.length === 0 && c.talents.includes(Talent.Draconic)));

    window.open(`https://fabrary.net/decks?${params.toString()}`, '_blank');
};

export default function HNT() {
    const [majesticCount, setMajesticCount] = useState(0);

    const handleMajesticCountChange = event => {
        let count = parseInt(event.target.value, 10) || 0;
        if (count > 8) count = 8;
        setMajesticCount(count); // Parse to integer, default to 0 if invalid
    };

    const runGenerate = () => {
        generate(majesticCount);
    };

    return (
        <>
            <div id="version">
                <span>v HNT.2</span>
                <a id="fork-me" href="https://github.com/theblang/fab-sealed-generator">
                    <img src={githubMark} />
                </a>
            </div>
            <div id="assumptions">
                <div>
                    <b>
                        Assumptions based on{' '}
                        <a href="https://www.youtube.com/watch?v=HCKLBXimmfY&t=28s">Naib's video</a>
                    </b>
                </div>
                <ul>
                    <li>2 Assassin only</li>
                    <li>2 Ninja only</li>
                    <li>2 Warrior only</li>
                    <li>3 Hybrid / Draconic only / Generic</li>
                    <li>1 Common wildcard</li>
                    <li>1 Common Equipment</li>
                    <li>1 Rare slot</li>
                    <li>1 Rare / Majestic slot</li>
                    <li>1 Rainbow Foil slot</li>
                    <li>Prerelease pack with all tokens and one (of three) additional Rainbow Foil weapon</li>
                </ul>
            </div>
            <label htmlFor="majesticCount">Majestic count:</label>
            <input
                type="number"
                id="majesticCount"
                value={majesticCount}
                min="0"
                max="8"
                onChange={handleMajesticCountChange}
            />
            <br />
            <button type="button" onClick={runGenerate}>
                Generate
            </button>
        </>
    );
}
