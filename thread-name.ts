const phrases = [
    [
        "Marauder Monday",
        "Moneybag Monday",
        "Mischief Monday",
        "Midnight Marauder",
        "Masked Monday"
    ],
    [
        "Thief Tuesday",
        "Tactical Thievery",
        "Treachery Tuesday",
        "Takeover Tuesday",
        "Tough-Talk Tuesday"
    ],
    [
        "Wicked Wednesday",
        "Wily Wednesday",
        "Wealthy Wednesday",
        "Wicked Wager",
        "Waylay Wednesday"
    ],
    [
        "Thieving Thursday",
        "Turbulent Thursday",
        "Theft Thursday",
        "Treasure Thief",
        "Tactical Thursday"
    ],
    [
        "Felonious Friday",
        "Filch Friday",
        "Fortune Friday",
        "Fraudulent Friday",
        "Fortune-Finder Friday"
    ],
    [
        "Swindler Saturday",
        "Stealthy Saturday",
        "Shady Saturday",
        "Sneaky Saturday",
        "Schemer Saturday"
    ],
    [
        "Stealing Sunday",
        "Swindle Sunday",
        "Sneaky Sunday",
        "Stealth Sunday",
        "Sharp Sunday"
    ]
];

export function generateThreadName() {
    const d = new Date();
    const ps = phrases[(d.getDay()+7) % 7];
    return ps[Math.floor(Math.random()*ps.length)]
}
