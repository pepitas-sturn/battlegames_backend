import { z } from "zod";
import { Validations } from "../validations";

// Enum for team colors
export enum TeamColor {
    RED = "red",
    BLUE = "blue"
}

// Enum for card colors
export enum CardColor {
    RED = "red",
    BLUE = "blue",
    BYSTANDER = "bystander",
    ASSASSIN = "assassin"
}

// Card type interface
export interface CardType {
    word: string;
    color: CardColor | null;
    isRevealed: boolean;
    wasRecentlyRevealed: boolean;
}

// Role enum
export enum Role {
    SPYMASTER = "spymaster",
    OPERATIVE = "operative"
}

// Chat message interface
export interface ChatMessage {
    sender: Role;
    message: string;
    team: TeamColor;
    cards: CardType[];
}

// Clue interface
export interface Clue {
    clueText: string;
    number: number;
}

// Game state interface
export interface GameState {
    roomId: string;
    cards: CardType[];
    chatHistory: ChatMessage[];
    currentTeam: TeamColor;
    currentRole: Role;
    previousTeam: TeamColor | null;
    previousRole: Role | null;
    remainingRed: number;
    remainingBlue: number;
    currentClue: Clue | null;
    currentGuesses: string[] | null;
    gameWinner: TeamColor | null;
}

// You can infer the types from the schema if needed
export type TGameState = z.infer<typeof Validations.GameStatePayloadSchema>;