export const RECIPES = {
    cookies: {
        id: 'cookies',
        name: 'Choco Cookies',
        icon: 'asset_icon_cookie.png',
        ingredients: [
            { id: 'flour', img: 'asset_ing_flour.png', name: 'Flour' },
            { id: 'sugar', img: 'asset_ing_sugar.png', name: 'Sugar' },
            { id: 'butter', img: 'asset_ing_butter.png', name: 'Butter' },
            { id: 'eggs', img: 'asset_ing_eggs.png', name: 'Eggs' },
            { id: 'chips', img: 'asset_ing_choc_chips.png', name: 'Choco Chips' }
        ],
        mixColor: '#E6C9A8', // Dough color
        bakeTime: 5000,
        base: 'asset_icon_cookie.png' // Result
    },
    cupcakes: {
        id: 'cupcakes',
        name: 'Rainbow Cupcakes',
        icon: 'asset_icon_cupcake.png',
        ingredients: [
            { id: 'flour', img: 'asset_ing_flour.png', name: 'Flour' },
            { id: 'sugar', img: 'asset_ing_sugar.png', name: 'Sugar' },
            { id: 'milk', img: 'asset_ing_milk.png', name: 'Milk' },
            { id: 'eggs', img: 'asset_ing_eggs.png', name: 'Eggs' }
        ],
        mixColor: '#FFF0F5',
        bakeTime: 5000,
        base: 'asset_icon_cupcake.png'
    },
    pizza: {
        id: 'pizza',
        name: 'Mini Pizza',
        icon: 'asset_icon_pizza.png',
        ingredients: [
            { id: 'flour', img: 'asset_ing_flour.png', name: 'Flour' },
            { id: 'sauce', img: 'asset_ing_sauce.png', name: 'Sauce' },
            { id: 'cheese', img: 'asset_ing_cheese.png', name: 'Cheese' },
            { id: 'pepperoni', img: 'asset_ing_pepperoni.png', name: 'Pepperoni' }
        ],
        mixColor: '#FFE4B5',
        bakeTime: 5000,
        base: 'asset_icon_pizza.png'
    }
};

export const DECORATIONS = [
    { id: 'sprinkles', img: 'asset_decoration_sprinkles.png' },
    { id: 'candy', img: 'asset_decoration_candy.png' },
    { id: 'chips', img: 'asset_ing_choc_chips.png' },
    { id: 'pep_slice', img: 'asset_ing_pepperoni.png' } // Reused for pizza
];