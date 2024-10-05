import React from "react";
import { render, screen } from "@testing-library/react";
import Battle from "../../src/pageRoutes/battle";
import { MemoryRouter } from "react-router-dom";
import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom";

beforeEach(() => {
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

it("Renders the error screen when UserPokemon is missing from localStorage", () => {
  Storage.prototype.getItem = jest.fn((key) => {
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

  render(
    <MemoryRouter>
      <Battle />
    </MemoryRouter>
  );

  const errorElement = screen.getByText(/Sorry an error occurred/i);
  expect(errorElement).toBeInTheDocument();
});

it("Renders the error screen when OpponentPokemon is missing from localStorage", () => {
  Storage.prototype.getItem = jest.fn((key) => {
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

  render(
    <MemoryRouter>
      <Battle />
    </MemoryRouter>
  );

  const errorElement = screen.getByText(/Sorry an error occurred/i);
  expect(errorElement).toBeInTheDocument();
});

it("Renders the error screen when both UserPokemon and OpponentPokemon are missing from localStorage", () => {
  Storage.prototype.getItem = jest.fn(() => null);

  render(
    <MemoryRouter>
      <Battle />
    </MemoryRouter>
  );

  const errorElement = screen.getByText(/Sorry an error occurred/i);
  expect(errorElement).toBeInTheDocument();
});

it("Renders The Battle Route When UserPokemon & OpponentPokemon is found in localStorage", async () => {
  Storage.prototype.getItem = jest.fn((key) => {
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

  fetchMock.mockResponseOnce(
    JSON.stringify({
      accuracy: 100,
      name: "mega-punch",
      power: 90,
      pp: 15,
    })
  );

  render(
    <MemoryRouter>
      <Battle />
    </MemoryRouter>
  );

  const userTurnElement = await screen.findByText("User's Turn");
  expect(userTurnElement).toBeInTheDocument();
});
