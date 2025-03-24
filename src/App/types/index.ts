import { z } from "zod";
import { Validations } from "../validations";

// Enum for team colors
export enum ETeamColor {
    RED = "red",
    BLUE = "blue"
}

// Enum for card colors
export enum ECardColor {
    RED = "red",
    BLUE = "blue",
    BYSTANDER = "bystander",
    ASSASSIN = "assassin"
}

// Card type interface
export interface ICardType {
    word: string;
    color: ECardColor | null;
    isRevealed: boolean;
    wasRecentlyRevealed: boolean;
}

// Role enum
export enum ERole {
    SPYMASTER = "spymaster",
    OPERATIVE = "operative"
}

// Chat message interface
export interface IChatMessage {
    sender: ERole;
    message: string;
    team: ETeamColor;
    cards: ICardType[];
}

// Clue interface
export interface IClue {
    clueText: string;
    number: number;
}

// Participant interface
export type TParticipant = {
    name: string;
    team: ETeamColor;
}
// Game state interface
export interface IGameState {
    roomId: string;
    cards: ICardType[];
    chatHistory: IChatMessage[];
    currentTeam: ETeamColor;
    currentRole: ERole;
    previousTeam: ETeamColor | null;
    previousRole: ERole | null;
    remainingRed: number;
    remainingBlue: number;
    currentClue: IClue | null;
    currentGuesses: string[] | null;
    participants: TParticipant[];
    createdAt: Date;
    updatedAt: Date;
}

// You can infer the types from the schema if needed
export type TGameState = z.infer<typeof Validations.GameStatePayloadSchema>;