import js from "@eslint/js";
import htmlPlugin from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      htmlPlugin.configs["flat/recommended"], // 🔹 Ajoute HTML dans les extensions
      prettierConfig, // Ajoute Prettier comme extensZion
    ],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [
          key.trim(),
          value,
        ]),
      ),
      parser: htmlParser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@html-eslint": htmlPlugin,
      prettier: prettierPlugin, // Ajoute Prettier en plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...(htmlPlugin.configs["flat/recommended"]?.rules || {}),
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "prettier/prettier": "error", // Active les règles Prettier
      "@html-eslint/indent": "off", // ❌ Laisser Prettier gérer l'indentation
      "@html-eslint/max-len": "off", // ❌ Pas de restriction de longueur de ligne
      "@html-eslint/no-extra-spacing-attrs": "off", // 🚨 Supprime les espaces inutiles dans les attributs
      "@html-eslint/no-trailing-spaces": "off",
      "@html-eslint/require-closing-tags": [
        "error",
        { selfClosing: "always" },
      ], // ✅ Exige une fermeture, mais permet les autofermantes
      "@html-eslint/attrs-newline": "off", // ❌ Laisser Prettier gérer les retours à la ligne des attributs
      "@html-eslint/element-newline": "off", // ❌ Laisser Prettier gérer les retours à la ligne des éléments
      ...prettierPlugin.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          printWidth: 70, // ✅ Surcharge la largeur max des lignes
          htmlWhitespaceSensitivity: "ignore", // ✅ Empêche Prettier d'imposer des espaces inutiles
          singleAttributePerLine: true, // ✅ Force un attribut par ligne
          proseWrap: "always", // ✅ Garde les textes bien structurés
          semi: true, // 🚀 Ajoute automatiquement les `;`
          trailingComma: "all", // 🚀 Ajoute des virgules finales partout où c'est valide
        },
      ],
    },
  },
);
