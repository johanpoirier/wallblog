Wallblog.Item = DS.Model.extend({
    file: DS.attr('string'),
    description: DS.attr('string'),
    date: DS.attr('date'),
    ratio: DS.attr('number'),
    reverseRatio: DS.attr('number'),
    type: DS.attr('string')
});

Wallblog.Item.FIXTURES = [
    {
        id: 1,
        file: "2011_09_25_17_54_25 - 1004.jpg",
        description: "Tête à tête",
        date: "2011-09-25 17:54:25",
        ratio: 1.0,
        reverseRatio: 1.0,
        type: "picture"
    },
    {
        id: 2,
        file: "2011_09_25_18_38_11 - 1062.jpg",
        description: "In love",
        date: "2011-09-25 18:38:11",
        ratio: 1.50,
        reverseRatio: 0.66,
        type: "picture"
    },
    {
        id: 3,
        file: "2011_11_02_12_08_00.jpg",
        description: "Coiffure",
        date: "2011-11-02 12:08:04",
        ratio: 0.75,
        reverseRatio: 1.33,
        type: "picture"
    }
];