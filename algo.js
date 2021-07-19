const COLORS = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "teal",
];

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

const mainDeck = {};
const form = document.getElementById('addCard');
const algoButton = document.getElementById('runAlgo');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cardName = form.elements.cardnameInput.value;
    const ATK = form.elements.ATK.value;
    const DEF = form.elements.DEF.value;
    const Attribute = form.elements.Attribute.value;
    const Level = form.elements.Level.value;
    const Type = form.elements.Type.value;
    addCardToMainDeck(cardName, ATK, DEF, Attribute, Level, Type);
    resetInputFields(
        form.elements.cardnameInput, 
        form.elements.ATK, 
        form.elements.DEF,
        form.elements.Type
        );
});

algoButton.addEventListener('click', (e) => {
    e.preventDefault();
    runAlgo(mainDeck);
});

function addCardToMainDeck(cardName, ATK, DEF, Attribute, Level, Type) {
    if (!cardName || mainDeck[cardName] || !Type) {
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
        "Level": Level,
        "Type": Type
    };
    mainDeck[cardName] = cardObj;
    const div = document.getElementById('mainMonsters');
    const li = document.createElement('h3');
    const cleanedName = removeTags(cardName);
    li.innerText = cleanedName;
    div.appendChild(li);
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
    let c = 0;
    for (const path of paths) {
        let color;
        const {startingMonster, revealedMonster, match1, finalMonster, match2} = path;
        if (!startingMonsters.has(startingMonster)) {
            c++;
            if (c >= COLORS.length) {
                c = 0;
            }
            color = COLORS[c];
            startingMonsters.add(startingMonster);
            const startingMonsterHTML = document.createElement('h2');
            startingMonsterHTML.className = `${headerClass} ${color}`;
            startingMonsterHTML.innerText = startingMonster;
            pathArea.appendChild(startingMonsterHTML);
        }else {
            color = COLORS[c];
        }
        const pathHtml = document.createElement('div');
        pathHtml.className = `${pathClass} ${color}`;
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

function resetInputFields(cardName, ATK, DEF, Type) {
    cardName.value = '';
    ATK.value = '';
    DEF.value = '';
    Type.value = '';
}