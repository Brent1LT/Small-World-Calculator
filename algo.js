
const mainDeck = {};
let form = document.getElementById('addCard');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cardName = form.elements['cardname'].value;
    const ATK = form.elements['ATK'].value;
    const DEF = form.elements['DEF'].value;
    const Attribute = form.elements['Attribute'].value;
    const Level = form.elements['Level'].value;
    addCardToMainDeck(cardName, ATK, DEF, Attribute, Level);
})

function addCardToMainDeck(cardName, ATK, DEF, Attribute, Level) {
    const cardObj = {
        "ATK": ATK,
        "DEF": DEF,
        "Attribute": Attribute,
        "Level": Level
    };

    mainDeck[cardName] = cardObj;
    const ul = document.getElementById('mainMonsters');
    const li = document.createElement('li');
    li.textContent = cardname;
    ul.append(li);
}

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

