"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@testing-library/react");
var battle_1 = __importDefault(require("../../src/pageRoutes/battle"));
var react_router_dom_1 = require("react-router-dom");
var jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
require("@testing-library/jest-dom");
beforeEach(function () {
    Storage.prototype.getItem = jest.fn();
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
        configurable: true,
        value: jest.fn(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
        configurable: true,
        value: jest.fn(),
    });
});
it("Renders the error screen when UserPokemon is missing from localStorage", function () {
    Storage.prototype.getItem = jest.fn(function (key) {
        if (key === "opponentsPokemon") {
            return JSON.stringify({
                stats: [{ base_stat: 100 }],
                sprites: {
                    other: {
                        "official-artwork": {
                            front_shiny: "https://example.com/opponent-pokemon.png",
                        },
                    },
                },
                name: "OpponentPokemon",
                types: [{ type: { name: "Water" } }],
                moves: [{ move: { url: "https://example.com/move" } }],
            });
        }
        return null;
    });
    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(battle_1.default, {}) }));
    var errorElement = react_1.screen.getByText(/Sorry an error occurred/i);
    expect(errorElement).toBeInTheDocument();
});
it("Renders the error screen when OpponentPokemon is missing from localStorage", function () {
    Storage.prototype.getItem = jest.fn(function (key) {
        if (key === "selectedPokemon") {
            return JSON.stringify({
                hp: 100,
                image: "https://example.com/user-pokemon.png",
                name: "UserPokemon",
                types: ["Fire"],
                moves: [{ accuracy: 100, name: "Flamethrower", power: 90, pp: 15 }],
            });
        }
        return null;
    });
    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(battle_1.default, {}) }));
    var errorElement = react_1.screen.getByText(/Sorry an error occurred/i);
    expect(errorElement).toBeInTheDocument();
});
it("Renders the error screen when both UserPokemon and OpponentPokemon are missing from localStorage", function () {
    Storage.prototype.getItem = jest.fn(function () { return null; });
    (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(battle_1.default, {}) }));
    var errorElement = react_1.screen.getByText(/Sorry an error occurred/i);
    expect(errorElement).toBeInTheDocument();
});
it("Renders The Battle Route When UserPokemon & OpponentPokemon is found in localStorage", function () { return __awaiter(void 0, void 0, void 0, function () {
    var userTurnElement;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Storage.prototype.getItem = jest.fn(function (key) {
                    if (key === "opponentsPokemon") {
                        return JSON.stringify({
                            stats: [{ base_stat: 100 }],
                            sprites: {
                                other: {
                                    "official-artwork": {
                                        front_shiny: "https://example.com/opponent-pokemon.png",
                                    },
                                },
                            },
                            name: "OpponentPokemon",
                            types: [{ type: { name: "Water" } }],
                            moves: [
                                {
                                    move: {
                                        name: "mega-punch",
                                        url: "https://pokeapi.co/api/v2/move/5/",
                                    },
                                },
                                {
                                    move: {
                                        name: "mega-punch",
                                        url: "https://pokeapi.co/api/v2/move/5/",
                                    },
                                },
                                {
                                    move: {
                                        name: "mega-punch",
                                        url: "https://pokeapi.co/api/v2/move/5/",
                                    },
                                },
                                {
                                    move: {
                                        name: "mega-punch",
                                        url: "https://pokeapi.co/api/v2/move/5/",
                                    },
                                },
                            ],
                        });
                    }
                    if (key === "selectedPokemon") {
                        return JSON.stringify({
                            hp: 100,
                            image: "https://example.com/user-pokemon.png",
                            name: "UserPokemon",
                            types: ["Fire"],
                            moves: [
                                [
                                    {
                                        move: {
                                            name: "mega-punch",
                                            url: "https://pokeapi.co/api/v2/move/5/",
                                        },
                                    },
                                    {
                                        move: {
                                            name: "mega-punch",
                                            url: "https://pokeapi.co/api/v2/move/5/",
                                        },
                                    },
                                    {
                                        move: {
                                            name: "mega-punch",
                                            url: "https://pokeapi.co/api/v2/move/5/",
                                        },
                                    },
                                    {
                                        move: {
                                            name: "mega-punch",
                                            url: "https://pokeapi.co/api/v2/move/5/",
                                        },
                                    },
                                ],
                            ],
                        });
                    }
                    return null;
                });
                jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({
                    accuracy: 100,
                    name: "mega-punch",
                    power: 90,
                    pp: 15,
                }));
                (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(battle_1.default, {}) }));
                return [4 /*yield*/, react_1.screen.findByText("User's Turn")];
            case 1:
                userTurnElement = _a.sent();
                expect(userTurnElement).toBeInTheDocument();
                return [2 /*return*/];
        }
    });
}); });
