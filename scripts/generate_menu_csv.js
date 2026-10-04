// scripts/generate_menu_csv.js
import fs from "fs";
import path from "path";
import { MENU_DATA } from "../src/data/menuData.js";
import { menuToCsv } from "../src/utils/csvMenuParser.js";

const publicDataDir = path.resolve("public/data");
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const csv = menuToCsv(MENU_DATA);
const targetPath = path.join(publicDataDir, "the_sixth_element_menu.csv");
fs.writeFileSync(targetPath, "\uFEFF" + csv, "utf8");

console.log(`Generated ${targetPath} successfully!`);
