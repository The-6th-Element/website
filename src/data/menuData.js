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
          { name: "House Masala Shakshuka", desc: "Spiced tomatoes · poached eggs · coriander · sourdough · vegan option available", price: "13", tags: ["GF"] },
          { name: "Buttermilk Pancakes", desc: "Maple syrup · seasonal berries · whipped cream", price: "14", tags: ["V"] },
          { name: "Crispy Chicken Waffle", desc: "Buttermilk-fried chicken · chilli honey · waffle", price: "16", tags: [] },
          { name: "Truffle Mushroom Croissant", desc: "Wild mushrooms · parmesan · truffle oil", price: "15", tags: ["V"] },
          { name: "Gin-Cured Salmon & Eggs", desc: "Sourdough · chives · cream cheese", price: "16", tags: ["GF*"] },
        ],
      },
      {
        name: "Larger Plates",
        items: [
          { name: "Chicken Burger", desc: "Two patties · brioche bun · house masala fries · house salad", price: "18", tags: [] },
          { name: "Plant Burger", desc: "Plant patty · brioche bun · house masala fries · house salad", price: "16", tags: ["VE"] },
          { name: "Lunch Bowl", desc: "Chef's daily creation — ask your server for today's bowl", price: "12", tags: [] },
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
          { name: "Eggs Your Way", desc: "Fried or poached", price: "3", tags: [] },
          { name: "Masala Fries", desc: "", price: "5", tags: [] },
          { name: "Halloumi", desc: "", price: "5", tags: [] },
          { name: "Smoked Salmon", desc: "", price: "5.50", tags: [] },
          { name: "Avocado", desc: "", price: "3", tags: [] },
          { name: "Sourdough", desc: "", price: "3", tags: [] },
          { name: "Mushrooms", desc: "", price: "2", tags: [] },
          { name: "Tomatoes", desc: "", price: "2", tags: [] },
          { name: "Bar Nibbles", desc: "", price: "5", tags: [] },
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
          { name: "Lamb Chops", desc: "Kasundi glaze · pickled shallots & mint chutney", price: "12", tags: ["GF"] },
          { name: "Paneer Tikka", desc: "Mustard pickle marinade · smoked yoghurt", price: "10", tags: ["V", "GF"] },
          { name: "Chicken Tikka", desc: "Chargrilled chicken tikka · house spices", price: "12", tags: ["GF"] },
          { name: "Okra Fries", desc: "Crispy spiced okra fries", price: "10", tags: ["VE"] },
          { name: "Butter Chicken", desc: "Tomatoes, butter, cream, cashews & aromatic spices", price: "12", tags: ["GF"] },
          { name: "Paneer Lababdar", desc: "Tomato, cashew & aromatic spice gravy", price: "10", tags: ["V", "GF"] },
          { name: "Malabar King Prawn", desc: "King prawn · coconut, curry leaf & Malabar spice sauce", price: "12", tags: ["GF"] },
          { name: "Dal Makhani", desc: "Slow-cooked 12 hours · cultured butter & truffle oil", price: "10", tags: ["V", "GF"] },
          { name: "Chef Special Chicken Wings", desc: "In-house marinated · slow-cooked · makhani drizzle", price: "12", tags: ["GF"] },
          { name: "Jaipur Aloo", desc: "Spiced potatoes · mustard oil & fresh herbs", price: "10", tags: ["VE", "GF"] },
        ],
      },
      {
        name: "Signatures · The Sixth Element Classics",
        items: [
          { name: "Lamb Shank", desc: "12-hour slow-braised lamb shank · Kashmiri reduction · saffron rice · artisan naan", price: "28", tags: ["GF"] },
          { name: "Lamb Biryani", desc: "Saffron basmati · slow-finished in a copper pot", price: "18", tags: ["GF"] },
          { name: "Chicken Biryani", desc: "Saffron basmati · slow-finished in a copper pot", price: "16", tags: ["GF"] },
          { name: "Vegetable Biryani", desc: "Saffron basmati · slow-finished in a copper pot", price: "14", tags: ["V", "GF"] },
        ],
      },
      {
        name: "Sides",
        items: [
          { name: "Bread Basket", desc: "Peshawari naan · aloo kulcha · garlic naan", price: "6", tags: [] },
          { name: "Mini Naan", desc: "Choice of peshawari, aloo kulcha or garlic", price: "3", tags: [] },
          { name: "Saffron Rice", desc: "", price: "6", tags: [] },
          { name: "Poppadoms Basket", desc: "With a selection of chutneys", price: "6", tags: [] },
          { name: "Chickpea Salad", desc: "", price: "6", tags: [] },
          { name: "Raita", desc: "", price: "3", tags: [] },
          { name: "Bar Nibbles", desc: "Marinated olives, spiced nuts & crisps", price: "5", tags: [] },
        ],
      },
    ],
  },
};
