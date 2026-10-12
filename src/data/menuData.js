// src/data/menuData.js
// Default menu structure and items for The Sixth Element

export const MENU_DATA = {
  daytime: {
    title: "Daytime",
    subtitle: "Served 8am – 2pm · Inspired by the five elements",
    icon: "☀️",
    sections: [
      {
        name: "Brunch",
        items: [
          { name: "Avocado & Feta Sourdough", desc: "Crushed avocado · feta · seeds · lemon · chilli flakes", price: "12", tags: ["V", "GF*"] },
          { name: "Masala Beans on Toast", desc: "Home-made spiced cannellini beans · grilled sourdough", price: "10", tags: ["VE", "GF*"] },
          { name: "Mango & Saffron Pot", desc: "Coconut yoghurt · granola · pistachio · toasted coconut", price: "12", tags: ["VE", "GF"] },
          { name: "House Masala Shakshuka", desc: "Spiced tomatoes · poached eggs · coriander · sourdough · vegan option available", price: "13", tags: ["V", "GF*"] },
          { name: "Buttermilk Pancakes", desc: "Maple syrup · seasonal berries · whipped cream", price: "14", tags: ["V"] },
          { name: "Crispy Chicken Waffle", desc: "Buttermilk-fried chicken · chilli honey · waffle", price: "16", tags: ["HALAL"] },
          { name: "Truffle Mushroom Croissant", desc: "Wild mushrooms · parmesan · truffle oil", price: "15", tags: ["V"] },
          { name: "Gin-Cured Salmon & Eggs", desc: "Sourdough · chives · cream cheese", price: "16", tags: ["GF*"] },
        ],
      },
      {
        name: "Larger Plates",
        items: [
          { name: "Chicken Burger", desc: "Two patties · brioche bun · house masala fries · house salad", price: "18", tags: ["HALAL"] },
          { name: "Plant Burger", desc: "Plant patty · brioche bun · house masala fries · house salad", price: "16", tags: ["VE"] },
          { name: "Lunch Bowl", desc: "Chef's daily creation — ask your server for today's bowl", price: "12", tags: ["V", "GF*"] },
          { name: "The Charcuterie Frank", desc: "Artisan sausage · frank roll · house mustard", price: "12", tags: [] },
        ],
      },
      {
        name: "Brunch for Two",
        items: [
          { name: "Prosecco Brunch for Two", desc: "Prosecco + 3 dishes", price: "70", tags: [] },
          { name: "Champagne Brunch for Two", desc: "Champagne + 3 dishes", price: "110", tags: [] },
        ],
      },
      {
        name: "Sides",
        items: [
          { name: "Eggs Your Way", desc: "Fried or poached", price: "3", tags: ["V", "GF"] },
          { name: "Masala Fries", desc: "", price: "5", tags: ["VE", "GF"] },
          { name: "Halloumi", desc: "", price: "5", tags: ["V", "GF"] },
          { name: "Smoked Salmon", desc: "", price: "5.50", tags: ["GF"] },
          { name: "Avocado", desc: "", price: "3", tags: ["VE", "GF"] },
          { name: "Sourdough", desc: "", price: "3", tags: ["VE"] },
          { name: "Mushrooms", desc: "", price: "2", tags: ["VE", "GF"] },
          { name: "Tomatoes", desc: "", price: "2", tags: ["VE", "GF"] },
          { name: "Bar Nibbles", desc: "", price: "5", tags: ["VE", "GF*"] },
        ],
      },
    ],
  },
  evening: {
    title: "Evening",
    subtitle: "Modern Indian · Served from 5pm",
    icon: "🌙",
    sections: [
      {
        name: "Small Plates · £10–£12 · Perfect for Sharing",
        items: [
          { name: "Beetroot & Goat's Cheese Tikki", desc: "Tamarind glaze · pistachio crumble", price: "12", tags: ["V", "GF"] },
          { name: "Samphire Pakoras", desc: "Seaweed salt · house dip", price: "10", tags: ["VE"] },
          { name: "Burrata Chaat", desc: "Heritage tomatoes · crispy papdi · tamarind, mint & coriander chutneys", price: "12", tags: ["V"] },
          { name: "Bombay Nachos", desc: "Makhani queso · pico de gallo · guacamole & sour cream · jalapeños", price: "10", tags: ["V"] },
          { name: "Lamb Chops", desc: "Kasundi glaze · pickled shallots & mint chutney", price: "12", tags: ["GF", "HALAL"] },
          { name: "Paneer Tikka", desc: "Mustard pickle marinade · smoked yoghurt", price: "10", tags: ["V", "GF"] },
          { name: "Chicken Tikka", desc: "Chargrilled chicken tikka · house spices", price: "12", tags: ["GF", "HALAL"] },
          { name: "Okra Fries", desc: "Crispy spiced okra fries", price: "10", tags: ["VE"] },
          { name: "Butter Chicken", desc: "Tomatoes, butter, cream, cashews & aromatic spices", price: "12", tags: ["GF", "HALAL"] },
          { name: "Paneer Lababdar", desc: "Tomato, cashew & aromatic spice gravy", price: "10", tags: ["V", "GF"] },
          { name: "Malabar King Prawn", desc: "King prawn · coconut, curry leaf & Malabar spice sauce", price: "12", tags: ["GF", "HALAL"] },
          { name: "Dal Makhani", desc: "Slow-cooked 12 hours · cultured butter & truffle oil", price: "10", tags: ["V", "GF"] },
          { name: "Chef Special Chicken Wings", desc: "In-house marinated · slow-cooked · makhani drizzle", price: "12", tags: ["GF", "HALAL"] },
          { name: "Jaipur Aloo", desc: "Spiced potatoes · mustard oil & fresh herbs", price: "10", tags: ["VE", "GF"] },
        ],
      },
      {
        name: "Signatures · The Sixth Element Classics",
        items: [
          { name: "Lamb Shank", desc: "12-hour slow-braised lamb shank · Kashmiri reduction · saffron rice · artisan naan", price: "28", tags: ["GF", "HALAL"] },
          { name: "Lamb Biryani", desc: "Saffron basmati · slow-finished in a copper pot", price: "18", tags: ["GF", "HALAL"] },
          { name: "Chicken Biryani", desc: "Saffron basmati · slow-finished in a copper pot", price: "16", tags: ["GF", "HALAL"] },
          { name: "Vegetable Biryani", desc: "Saffron basmati · slow-finished in a copper pot", price: "14", tags: ["V", "GF"] },
        ],
      },
      {
        name: "Sides",
        items: [
          { name: "Bread Basket", desc: "Peshawari naan · aloo kulcha · garlic naan", price: "6", tags: ["V"] },
          { name: "Mini Naan", desc: "Choice of peshawari, aloo kulcha or garlic", price: "3", tags: ["V"] },
          { name: "Saffron Rice", desc: "", price: "6", tags: ["VE", "GF"] },
          { name: "Poppadoms Basket", desc: "With a selection of chutneys", price: "6", tags: ["VE", "GF"] },
          { name: "Chickpea Salad", desc: "", price: "6", tags: ["VE", "GF"] },
          { name: "Raita", desc: "", price: "3", tags: ["V", "GF"] },
          { name: "Bar Nibbles", desc: "Marinated olives, spiced nuts & crisps", price: "5", tags: ["VE", "GF*"] },
        ],
      },
    ],
  },
  festive: {
    title: "Festive Menu",
    subtitle: "Make it a Christmas to remember · Served from 20th November",
    icon: "🎄",
    sections: [
      {
        name: "Festive Dinner · To Begin (Choose One)",
        items: [
          { name: "Christmas Turkey Tikka", desc: "Turkey tikka · cranberry & mint chutney", price: "35.95", tags: ["GF"] },
          { name: "Winter Ruby Tikki", desc: "Beetroot & goat's cheese tikki · tamarind glaze · pistachio crumble", price: "35.95", tags: ["V", "GF"] },
          { name: "Ember Glazed Wings", desc: "Chef special chicken wings · in-house marinated · slow-cooked · makhani drizzle", price: "35.95", tags: ["GF", "HALAL"] },
          { name: "Winter Shore Pakoras", desc: "Samphire pakoras · seaweed salt · house dip", price: "35.95", tags: ["VE"] },
          { name: "Fireside Paneer Tikka", desc: "Paneer tikka · mustard pickle marinade · smoked yoghurt", price: "35.95", tags: ["V", "GF"] },
        ],
      },
      {
        name: "Festive Dinner · The Main Event (Served with Naan or Saffron Rice)",
        items: [
          { name: "Velvet Christmas Makhani", desc: "Butter chicken · tomatoes, butter, cream, cashews & aromatic spices", price: "35.95", tags: ["GF", "HALAL"] },
          { name: "Mulled Spice Chicken Chettinad", desc: "Fragrant spiced chicken chettinad in coconut-peppercorn gravy", price: "35.95", tags: ["GF", "HALAL"] },
          { name: "Midwinter Malabar Prawns", desc: "King prawn · coconut, curry leaf & Malabar spice sauce", price: "35.95", tags: ["GF"] },
          { name: "Golden Paneer Lababdar", desc: "Paneer lababdar · tomato, cashew & aromatic spice gravy", price: "35.95", tags: ["V", "GF"] },
          { name: "Winter White Malai Kofta", desc: "Delicate paneer dumplings in spiced cashew gravy", price: "35.95", tags: ["V"] },
          { name: "Midnight Dal Makhani", desc: "Dal makhani · slow-cooked 12 hours · cultured butter & truffle oil", price: "35.95", tags: ["V", "GF"] },
          { name: "The Christmas Shank (Signature Main Upgrade)", desc: "12-hour slow-braised lamb shank · Kashmiri reduction · naan or saffron rice", price: "+£10", tags: ["GF", "HALAL"] },
        ],
      },
      {
        name: "Festive Dinner · To Finish",
        items: [
          { name: "Christmas Gulab Jamun", desc: "Warm gulab jamun · Baileys ice cream", price: "Included", tags: ["V"] },
          { name: "Midnight Chocolate Sphere (Signature Dessert Upgrade)", desc: "Filter coffee chocolate · Baileys ice cream · a little theatre at your table", price: "+£10", tags: ["V"] },
        ],
      },
      {
        name: "Christmas Feast · For 9+ guests · Sharing for the table (£37.95 pp)",
        items: [
          { name: "On Arrival Sharing Platters", desc: "Christmas Turkey Tikka · Winter Ruby Tikki · Ember Glazed Wings · Winter Shore Pakoras", price: "37.95", tags: ["GF"] },
          { name: "The Feast Table Spread", desc: "Velvet Christmas Makhani · Golden Paneer Lababdar · Midnight Dal Makhani · Golden Jaipur Aloo · Saffron Rice & Festive Bread Basket", price: "37.95", tags: ["GF"] },
          { name: "Christmas Gulab Jamun (Sharing Finish)", desc: "Warm gulab jamun · Baileys ice cream (Upgrade to Midnight Chocolate Sphere +£10 pp)", price: "Included", tags: ["V"] },
          { name: "The Signature Feast Upgrade", desc: "Everything above, plus Ember Lamb Chops (kasundi glaze · pickled shallots & mint chutney) and The Christmas Shank for the table", price: "49.95", tags: ["GF", "HALAL"] },
        ],
      },
      {
        name: "Festive Bottomless Brunch · Fri – Sun 11am – 2pm (£45 pp)",
        items: [
          { name: "90 Mins Bottomless Drinks Pours", desc: "Choice of Prosecco · Mango Mimosa · Bellini · Aperol Spritz · Hugo Spritz (Whole table must take part)", price: "45", tags: [] },
          { name: "Avocado & Feta Sourdough", desc: "Crushed avocado · feta · seeds · lemon · chilli flakes", price: "Included", tags: ["V", "GF*"] },
          { name: "House Masala Shakshuka", desc: "Spiced tomatoes · poached eggs · coriander · sourdough · vegan option available", price: "Included", tags: ["V", "GF*"] },
          { name: "Crispy Chicken Waffle", desc: "Buttermilk-fried chicken · chilli honey · waffle", price: "Included", tags: ["HALAL"] },
          { name: "Buttermilk Pancakes", desc: "Maple syrup · seasonal berries · whipped cream", price: "Included", tags: ["V"] },
          { name: "Truffle Mushroom Croissant", desc: "Wild mushrooms · parmesan · truffle oil", price: "Included", tags: ["V"] },
          { name: "Chef's Lunch Bowl", desc: "Chef's daily creation — ask your server for today's bowl", price: "Included", tags: ["V", "GF*"] },
          { name: "Beetroot & Goat's Cheese Tikki (Tapas)", desc: "Tamarind glaze · pistachio crumble", price: "Included", tags: ["V", "GF"] },
          { name: "Chicken or Vegetable Biryani (Tapas)", desc: "Saffron basmati · slow-finished in a copper pot", price: "Included", tags: ["GF"] },
          { name: "Samphire Pakoras (Tapas)", desc: "Seaweed salt · house dip", price: "Included", tags: ["VE"] },
          { name: "Bombay Nachos (Tapas)", desc: "Makhani queso · pico de gallo · sour cream · jalapeños", price: "Included", tags: ["V"] },
          { name: "Jaipur Aloo (Tapas)", desc: "Spiced potatoes · mustard oil & fresh herbs", price: "Included", tags: ["VE", "GF"] },
          { name: "Paneer Tikka (Tapas)", desc: "Mustard pickle marinade · smoked yoghurt", price: "Included", tags: ["V", "GF"] },
        ],
      },
      {
        name: "Drinks & Nibbles · For office parties & group celebrations (from £20 pp)",
        items: [
          { name: "The Merry Package (£20 pp)", desc: "2 drinks each (house wine, Prosecco, beer or soft drink) + Sharing nibbles: Bar Nibbles, Poppadoms & chutneys, Samphire Pakoras, Bombay Nachos", price: "20", tags: [] },
          { name: "The Jolly Package (£30 pp)", desc: "3 drinks each (including house cocktails) + Everything in The Merry, plus Chef Special Chicken Wings, Paneer Tikka, Beetroot & Goat's Cheese Tikki", price: "30", tags: [] },
          { name: "Welcome Glass of Prosecco Upgrade", desc: "Add a chilled glass of Prosecco for each guest upon arrival", price: "6", tags: [] },
        ],
      },
    ],
  },
};
