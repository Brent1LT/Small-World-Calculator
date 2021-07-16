from deck import MAIN_DECK, Attribute

def run_algo(main_deck):
    paths = []
    for monster in main_deck:
        for revealed_monster in main_deck:
            match1 = match_one_field(main_deck[monster], main_deck[revealed_monster])
            if match1:
                for final_monster in main_deck:
                    if final_monster == monster:
                        continue
                    match2 = match_one_field(main_deck[revealed_monster], main_deck[final_monster])
                    if match2:
                        path_obj = {
                            "starting_monster": monster,
                            "revealed_monster": revealed_monster,
                            "final_monster": final_monster,
                            "first_match": match1,
                            "second_match": match2,
                        }

                        paths.append(path_obj)
    
    if paths:
        print_paths(paths)

def match_one_field(monster1, monster2):
    matches = 0
    matching_field = None
    for field in monster1:
        if monster1[field] == monster2[field]:
            matches += 1
            matching_field = field

    if matches == 1:
        return matching_field
    else:
        return False

def print_paths(paths):
    print(len(paths))
    for path in paths:
        print(
            "%s -> %s via %s -> %s via %s \n" % (
                path["starting_monster"],
                path["revealed_monster"],
                path["first_match"],
                path["final_monster"],
                path["second_match"],
            )
        )

if __name__ == "__main__":
    run_algo(MAIN_DECK)