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

const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

const tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

// const mainDeck = {};
const mainDeck = MAIN_DECK;
const form = document.getElementById('addCard');
const algoButton = document.getElementById('runAlgo');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cardName = form.elements.cardnameInput.value;
    const ATK = form.elements.ATK.value;
    const DEF = form.elements.DEF.value;
    const Attribute = form.elements.Attribute.value;
    const Level = form.elements.Level.value;
    addCardToMainDeck(cardName, ATK, DEF, Attribute, Level);
    resetInputFields(
        form.elements.cardnameInput, 
        form.elements.ATK, 
        form.elements.DEF
        );
});

algoButton.addEventListener('click', (e) => {
    e.preventDefault();
    runAlgo(mainDeck);
});

function addCardToMainDeck(cardName, ATK, DEF, Attribute, Level) {
    if (!cardName || mainDeck[cardName]) {
        return;
    }else if (!ATK) {
        ATK = 0;
    }else if (!DEF) {
        DEF = 0;
    }

    const cardObj = {
        "ATK": ATK,
        "DEF": DEF,
        "Attribute": Attribute,
        "Level": Level
    };
    mainDeck[cardName] = cardObj;
    const ul = document.getElementById('mainMonsters');
    const li = document.createElement('li');
    const cleanedName = removeTags(cardName);
    li.innerText = cleanedName;
    ul.appendChild(li);
}

function runAlgo(mainDeck) {
    const paths = [];
    for (const startingMonster in mainDeck) {
        for (const revealedMonster in mainDeck) {
            match1 = matchOneField(mainDeck[startingMonster], mainDeck[revealedMonster]);
            if (match1) {
                for (const finalMonster in mainDeck) {
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
    for (const field in monster1) {
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
    const headerClass = 'path-header';
    const pathClass = 'path-item';
    removeOldPaths(headerClass);
    removeOldPaths(pathClass);
    const pathArea = document.getElementById('pathResults');
    const startingMonsters = new Set();
    for (const path of paths) {
        const {startingMonster, revealedMonster, match1, finalMonster, match2} = path;
        if (!startingMonsters.has(startingMonster)) {
            startingMonsters.add(startingMonster);
            const startingMonsterHTML = document.createElement('h2');
            startingMonsterHTML.className = headerClass;
            startingMonsterHTML.innerText = startingMonster;
            pathArea.appendChild(startingMonsterHTML);
        }
        const pathHtml = document.createElement('div');
        pathHtml.className = pathClass;
        const pathString = `${startingMonster} -> ${revealedMonster} via ${match1} -> ${finalMonster} via ${match2}`;
        pathHtml.innerText = pathString;
        pathArea.appendChild(pathHtml);
    }
}

function removeOldPaths(className) {
    const items = document.getElementsByClassName(className);
    const htmlElements = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        htmlElements.push(item);
    }

    for (let ele of htmlElements) {
        ele.remove();
    }
}

function removeTags(string) {
    let oldHtml;
    do {
        oldHtml = string;
        string = string.replace(tagOrComment, '');
    } while (string !== oldHtml);
    return string.replace(/</g, '&lt;');
}

function resetInputFields(cardName, ATK, DEF) {
    cardName.value = '';
    ATK.value = '';
    DEF.value = '';
}