
const Attribute = {
    "LIGHT": 0,
    "DARK": 1,
    "EARTH": 2,
    "FIRE": 3,
    "WIND": 4,
    "WATER": 5,
};

const MAIN_DECK = {
    "Any Drytron": {
        "ATK": 2000,
        "DEF": 0,
        "Attr": Attribute.LIGHT,
        "Level": 1,
        "Type": "Machine"
    },
    "Diviner": {
        "ATK": 500,
        "DEF": 300,
        "Attr": Attribute.LIGHT,
        "Level": 2,
        "Type": "Fairy"
    },
    "Orange Light": {
        "DEF": 500,
        "ATK": 300,
        "Attr": Attribute.LIGHT,
        "Level": 2,
        "Type": "Fairy"
    },
    "Ultimateness": {
        "ATK": 2000,
        "DEF": 3000,
        "Attr": Attribute.LIGHT,
        "Level": 12,
        "Type": "Fairy"
    },
    "Perfection": {
        "ATK": 1800,
        "DEF": 2800,
        "Attr": Attribute.LIGHT,
        "Level": 6,
        "Type": "Fairy"
    },
    "Benten": {
        "ATK": 1600,
        "DEF": 1500,
        "Attr": Attribute.LIGHT,
        "Level": 6,
        "Type": "Fairy"
    },
    "Natasha": {
        "ATK": 1000,
        "DEF": 1000,
        "Attr": Attribute.LIGHT,
        "Level": 5,
        "Type": "Fairy"
    },
    "Eva": {
        "ATK": 500,
        "DEF": 200,
        "Attr": Attribute.LIGHT,
        "Level": 1,
        "Type": "Fairy"
    },
    "Belle": {
        "ATK": 0,
        "DEF": 1800,
        "Attr": Attribute.EARTH,
        "Level": 3,
        "Type": "Zombie"
    },
    "Ash": {
        "ATK": 0,
        "DEF": 1800,
        "Attr": Attribute.FIRE,
        "Level": 3,
        "Type": "Zombie"
    },
    "Veiler": {
        "ATK": 0,
        "DEF": 0,
        "Attr": Attribute.LIGHT,
        "Level": 1,
        "Type": "Spellcaster"
    },
};


function runAlgo(mainDeck) {
    const paths = [];
    for (startingMonster in mainDeck) {
        for (revealedMonster in mainDeck) {
            match1 = matchOneField(mainDeck[startingMonster], mainDeck[revealedMonster]);
            if (match1) {
                for (finalMonster in mainDeck) {
                    if (finalMonster == startingMonster) {
                        continue;
                    }
                    match2 = matchOneField(mainDeck[revealedMonster], mainDeck[finalMonster]);
                    if (match2) {
                        const pathObj = {
                            startingMonster,
                            revealedMonster,
                            finalMonster,
                            match1,
                            match2
                        };

                        paths.push(pathObj);
                    }
                }
            }
        }
    }

    if (paths.length >= 1) {
        printPaths(paths);
    }
}

function matchOneField(monster1, monster2) {
    let matches = 0;
    let matchingField;
    for (field in monster1) {
        if (monster1[field] == monster2[field]) {
            matches += 1;
            matchingField = field;
        }
    }

    if (matches === 1) {
        return matchingField;
    }
    else{
        return false;
    }
}

function printPaths(paths) {
    console.log(paths.length);
    for (path of paths) {
        const {startingMonster, revealedMonster, match1, finalMonster, match2} = path;
        console.log(`${startingMonster} -> ${revealedMonster} via ${match1} -> ${finalMonster} via ${match2} \n`);
    }
}

